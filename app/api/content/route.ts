import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

import {
  defaultContent,
  type LandingContent,
} from "@/content/site-content";
import { isValidLocale, locales, type Locale } from "@/lib/i18n";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type ContentOverrides = Partial<Record<Locale, Partial<LandingContent>>>;

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

async function readOverrides(): Promise<ContentOverrides> {
  await ensureOverridesFile();
  const raw = await readFile(overridesPath, "utf-8");
  if (!raw.trim()) {
    return {};
  }

  try {
    return JSON.parse(raw) as ContentOverrides;
  } catch (error) {
    console.warn("Invalid overrides file detected. Resetting to empty object.", error);
    await writeFile(overridesPath, "{}", "utf-8");
    return {};
  }
}

async function writeOverrides(overrides: ContentOverrides) {
  await mkdir(path.dirname(overridesPath), { recursive: true });
  await writeFile(overridesPath, JSON.stringify(overrides, null, 2), "utf-8");
}

function deepMerge<T>(target: T, source: unknown): T {
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
      base[key] = deepMerge(nextTarget, nextSource);
    }
    return base as T;
  }

  return source as T;
}

function mergeWithDefaults(
  locale: Locale,
  overrides?: Partial<LandingContent>
): LandingContent {
  return deepMerge(defaultContent[locale], overrides ?? {});
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const langParam = searchParams.get("lang");
    const overrides = await readOverrides();

    if (langParam) {
      if (!isValidLocale(langParam)) {
        return NextResponse.json(
          { error: "Invalid language parameter." },
          { status: 400 }
        );
      }

      const data = mergeWithDefaults(langParam, overrides[langParam]);
      return NextResponse.json({ data });
    }

    const data = locales.reduce<Record<Locale, LandingContent>>(
      (acc, locale) => {
        acc[locale] = mergeWithDefaults(locale, overrides[locale]);
        return acc;
      },
      {} as Record<Locale, LandingContent>
    );

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Content API GET error:", error);
    return NextResponse.json(
      { error: "Failed to load content." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lang, content } = body as {
      lang?: string;
      content?: Partial<LandingContent>;
    };

    if (!lang || !isValidLocale(lang) || !content || typeof content !== "object") {
      return NextResponse.json(
        { error: "Payload must include a valid lang and content object." },
        { status: 400 }
      );
    }

    const overrides = await readOverrides();
    const current = overrides[lang] ?? {};
    overrides[lang] = deepMerge(current, content);
    await writeOverrides(overrides);

    const data = mergeWithDefaults(lang, overrides[lang]);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Content API PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update content." },
      { status: 500 }
    );
  }
}
