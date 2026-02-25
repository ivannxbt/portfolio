import type { LandingContent } from "@/content/site-content";
import { isValidLocale, type Locale } from "@/lib/i18n";

export type ContentGetQuery = {
  lang?: string | null;
};

export type ContentPutRequest = {
  lang?: string;
  content?: Partial<LandingContent>;
};

export function parseContentGetQuery(input: ContentGetQuery): {
  ok: true;
  locale?: Locale;
} | {
  ok: false;
  error: string;
  status: number;
} {
  if (!input.lang) {
    return { ok: true };
  }

  if (!isValidLocale(input.lang)) {
    return { ok: false, error: "Invalid language parameter.", status: 400 };
  }

  return { ok: true, locale: input.lang };
}

export function parseContentPutRequest(input: ContentPutRequest): {
  ok: true;
  lang: Locale;
  content: Partial<LandingContent>;
} | {
  ok: false;
  error: string;
  status: number;
} {
  const { lang, content } = input;

  if (!lang || !isValidLocale(lang) || !content || typeof content !== "object") {
    return {
      ok: false,
      error: "Payload must include a valid lang and content object.",
      status: 400,
    };
  }

  return {
    ok: true,
    lang,
    content,
  };
}
