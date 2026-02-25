import "server-only";

import { readFile, writeFile, mkdir } from "fs/promises";
import os from "os";
import path from "path";

import {
  defaultContent,
  type LandingContent,
} from "@/content/site-content";
import { locales, type Locale } from "@/lib/i18n";

export type ContentOverrides = Partial<Record<Locale, Partial<LandingContent>>>;

const defaultOverridesPath = path.join(process.cwd(), "data", "content-overrides.json");
const fallbackOverridesPath = path.join(os.tmpdir(), "content-overrides.json");

let resolvedOverridesPath: string | undefined;
let pathResolutionPromise: Promise<string> | undefined;

function isSystemCode(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string" &&
    (error as { code: string }).code === code
  );
}

const isErofs = (error: unknown) => isSystemCode(error, "EROFS");
const isEnoent = (error: unknown) => isSystemCode(error, "ENOENT");
const isEperm = (error: unknown) => isSystemCode(error, "EPERM");
const isEacces = (error: unknown) => isSystemCode(error, "EACCES");

async function ensureOverridesFileExists(targetPath: string) {
  await mkdir(path.dirname(targetPath), { recursive: true });
  try {
    await readFile(targetPath, "utf-8");
  } catch (error: unknown) {
    if (isEnoent(error)) {
      await writeFile(targetPath, "{}", "utf-8");
    } else {
      throw error;
    }
  }
}

async function getOverridesPath() {
  if (resolvedOverridesPath) {
    return resolvedOverridesPath;
  }

  if (!pathResolutionPromise) {
    pathResolutionPromise = (async () => {
      try {
        await ensureOverridesFileExists(defaultOverridesPath);
        resolvedOverridesPath = defaultOverridesPath;
      } catch (error: unknown) {
        if (isErofs(error) || isEperm(error) || isEacces(error)) {
          console.warn(
            `Primary overrides path is not writable (${error instanceof Error ? error.message : String(error)}), using fallback: ${fallbackOverridesPath}`
          );
          await ensureOverridesFileExists(fallbackOverridesPath);
          resolvedOverridesPath = fallbackOverridesPath;
        } else {
          throw error;
        }
      }

      return resolvedOverridesPath!;
    })();
  }

  return pathResolutionPromise;
}

export async function readOverrides(): Promise<ContentOverrides> {
  const overridesPath = await getOverridesPath();
  const raw = await readFile(overridesPath, "utf-8");
  if (!raw.trim()) {
    return {};
  }

  try {
    return JSON.parse(raw) as ContentOverrides;
  } catch (error) {
    console.warn("Invalid overrides file detected. Resetting to empty object.", (error instanceof Error ? error.message : String(error)));
    await writeFile(overridesPath, "{}", "utf-8");
    return {};
  }
}

export async function writeOverrides(overrides: ContentOverrides) {
  const overridesPath = await getOverridesPath();
  await mkdir(path.dirname(overridesPath), { recursive: true });
  await writeFile(overridesPath, JSON.stringify(overrides, null, 2), "utf-8");
}

const MAX_MERGE_DEPTH = 50;

export function deepMerge<T>(target: T, source: unknown, depth = 0): T {
  if (depth > MAX_MERGE_DEPTH) {
    throw new Error(
      `Maximum merge depth (${MAX_MERGE_DEPTH}) exceeded. This may indicate a circular reference or malicious input.`
    );
  }

  if (source === undefined) {
    return target;
  }

  if (Array.isArray(source)) {
    return source.slice() as T;
  }

  if (source && typeof source === "object") {
    const base =
      target && typeof target === "object"
        ? { ...(target as Record<string, unknown>) }
        : {};
    for (const key of Object.keys(source as Record<string, unknown>)) {
      const nextSource = (source as Record<string, unknown>)[key];
      const nextTarget =
        target && typeof target === "object"
          ? (target as Record<string, unknown>)[key]
          : undefined;
      base[key] = deepMerge(nextTarget, nextSource, depth + 1);
    }
    return base as T;
  }

  return source as T;
}

export function mergeWithDefaults(
  locale: Locale,
  overrides?: Partial<LandingContent>
): LandingContent {
  return deepMerge(defaultContent[locale], overrides ?? {});
}

export async function getLandingContent(locale: Locale): Promise<LandingContent> {
  const overrides = await readOverrides();
  return mergeWithDefaults(locale, overrides[locale]);
}

export async function getAllLandingContent(): Promise<Record<Locale, LandingContent>> {
  const overrides = await readOverrides();
  return locales.reduce<Record<Locale, LandingContent>>((acc, locale) => {
    acc[locale] = mergeWithDefaults(locale, overrides[locale]);
    return acc;
  }, {} as Record<Locale, LandingContent>);
}
