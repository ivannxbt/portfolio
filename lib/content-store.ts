import "server-only";

import { cache } from "react";
import {
  defaultContent,
  type LandingContent,
} from "@/content/site-content";
import { locales, type Locale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/server";

export type ContentOverrides = Partial<Record<Locale, Partial<LandingContent>>>;

/**
 * Read content overrides from Supabase database
 */
export const readOverrides = cache(async (): Promise<ContentOverrides> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("content_overrides")
      .select("locale, content");

    if (error) {
      console.error("Error reading content overrides from database:", error);
      return {};
    }

    if (!data || data.length === 0) {
      return {};
    }

    // Convert array of locale/content pairs to ContentOverrides object
    const overrides: ContentOverrides = {};
    for (const row of data) {
      overrides[row.locale as Locale] = row.content as Partial<LandingContent>;
    }

    return overrides;
  } catch (error) {
    console.error("Unexpected error reading content overrides:", error);
    return {};
  }
});

/**
 * Write content overrides to Supabase database
 */
export async function writeOverrides(overrides: ContentOverrides, userId?: string) {
  try {
    const supabase = await createClient();

    // Update or insert each locale's content
    for (const [locale, content] of Object.entries(overrides)) {
      const { error } = await supabase
        .from("content_overrides")
        .upsert({
          locale,
          content,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "locale",
        });

      if (error) {
        console.error(`Error writing content override for locale ${locale}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Unexpected error writing content overrides:", error);
    throw error;
  }
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

export const getLandingContent = cache(async (locale: Locale): Promise<LandingContent> => {
  const overrides = await readOverrides();
  return mergeWithDefaults(locale, overrides[locale]);
});

export const getAllLandingContent = cache(async (): Promise<Record<Locale, LandingContent>> => {
  const overrides = await readOverrides();
  return locales.reduce<Record<Locale, LandingContent>>((acc, locale) => {
    acc[locale] = mergeWithDefaults(locale, overrides[locale]);
    return acc;
  }, {} as Record<Locale, LandingContent>);
});
