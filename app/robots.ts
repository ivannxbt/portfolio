import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env/public";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    publicEnv.siteUrl;

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
