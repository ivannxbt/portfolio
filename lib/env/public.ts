const trimTrailingSlash = (value: string) => value.replace(/\/$/, "");

const toAbsoluteApiBaseUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  return trimTrailingSlash(value);
};

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ivan-caamano.me",
  substackUsername: process.env.NEXT_PUBLIC_SUBSTACK_USERNAME ?? "ivanxbt",
  apiBaseUrl: toAbsoluteApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
} as const;

export function getPublicApiUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!publicEnv.apiBaseUrl) {
    return normalizedPath;
  }

  return `${publicEnv.apiBaseUrl}${normalizedPath}`;
}

export function getSubstackUrl(): string {
  return `https://${publicEnv.substackUsername}.substack.com`;
}
