import type { LandingContent } from "@/content/site-content";
import {
  deepMerge,
  getAllLandingContent,
  getLandingContent,
  readOverrides,
  writeOverrides,
} from "@/lib/content-store";
import type { Locale } from "@/lib/i18n";

export async function fetchContent(locale?: Locale) {
  if (locale) {
    const data = await getLandingContent(locale);
    return { data };
  }

  const data = await getAllLandingContent();
  return { data };
}

export async function updateContent(lang: Locale, content: Partial<LandingContent>) {
  const overrides = await readOverrides();
  const current = overrides[lang] ?? {};
  overrides[lang] = deepMerge(current, content);
  await writeOverrides(overrides);

  const data = await getLandingContent(lang);
  return { data };
}
