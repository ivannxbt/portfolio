import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://ivan-caamano.me"
      : "http://127.0.0.1:3000");

  const lastModifiedSource =
    process.env.NEXT_PUBLIC_SITE_LASTMOD ??
    process.env.VERCEL_GIT_COMMIT_DATE ??
    "2026-03-03T00:00:00.000Z";
  const lastModified = new Date(lastModifiedSource);

  const localizedPages = locales.flatMap((lang) => {
    const pages = ["", "privacy"];
    return pages.map((slug) => ({
      url: slug ? `${baseUrl}/${lang}/${slug}` : `${baseUrl}/${lang}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [
            l,
            slug ? `${baseUrl}/${l}/${slug}` : `${baseUrl}/${l}`,
          ]),
        ),
      },
    }));
  });

  return localizedPages;
}
