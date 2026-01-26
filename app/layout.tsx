import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SessionProviders } from "@/components/session-provider";
import { getLandingContent } from "@/lib/content-store";
import type { Locale } from "@/lib/i18n";

const DEFAULT_META_LOCALE: Locale = "en";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ivan-caamano.me";
const OG_IMAGE_PATH = "/profile.jpeg";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingContent(DEFAULT_META_LOCALE);
  const branding = content.branding ?? {
    title: "Portfolio | Full Stack Developer",
    description: "A bilingual portfolio showcasing projects and skills in web development.",
    favicon: "/favicon.ico",
    logoText: "Portfolio",
  };

  const siteName = branding.logoText || branding.title;
  const imageUrl = `${SITE_URL}${OG_IMAGE_PATH}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: branding.title,
    description: branding.description,
    icons: branding.favicon
      ? {
          icon: [{ url: branding.favicon }],
        }
      : undefined,
    openGraph: {
      title: branding.title,
      description: branding.description,
      siteName,
      url: "/",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} preview`,
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className="antialiased bg-zinc-950 text-zinc-50 font-sans">
        <SessionProviders>{children}</SessionProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
