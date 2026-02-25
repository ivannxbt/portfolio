import type { LandingContent } from "@/content/site-content";
import type { Locale } from "@/lib/i18n";

type ContentResponse<T> = {
  data: T;
};

function getApiBaseUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return siteUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

async function fetchFromApi<T>(pathname: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${pathname}`);
  }

  const payload = (await response.json()) as ContentResponse<T>;
  return payload.data;
}

export async function getLandingContentFromApi(
  locale: Locale,
  init?: RequestInit
): Promise<LandingContent> {
  const params = new URLSearchParams({ lang: locale });
  return fetchFromApi<LandingContent>(`/api/content?${params.toString()}`, init);
}
