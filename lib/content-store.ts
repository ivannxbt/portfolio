import "server-only";

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

import {
  defaultContent,
  type LandingContent,
} from "@/content/site-content";
import { locales, type Locale } from "@/lib/i18n";

export type ContentOverrides = Partial<Record<Locale, Partial<LandingContent>>>;

const overridesPath = path.join(process.cwd(), "data", "content-overrides.json");

async function ensureOverridesFile() {
  await mkdir(path.dirname(overridesPath), { recursive: true });
  try {
    await readFile(overridesPath, "utf-8");
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      await writeFile(overridesPath, "{}", "utf-8");
    } else {
      throw error;
    }
  }
}

export async function readOverrides(): Promise<ContentOverrides> {
  await ensureOverridesFile();
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
