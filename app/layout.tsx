import type { Metadata } from "next";
import "./globals.css";
import { SessionProviders } from "@/components/session-provider";
import { getLandingContent } from "@/lib/content-store";
import type { Locale } from "@/lib/i18n";

const DEFAULT_META_LOCALE: Locale = "en";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getLandingContent(DEFAULT_META_LOCALE);
  const branding = content.branding ?? {
    title: "Portfolio | Full Stack Developer",
    description: "A bilingual portfolio showcasing projects and skills in web development.",
    favicon: "/favicon.ico",
  };

  return {
    title: branding.title,
    description: branding.description,
    icons: branding.favicon
      ? {
          icon: [{ url: branding.favicon }],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-50 font-sans">
        <SessionProviders>{children}</SessionProviders>
      </body>
    </html>
  );
}
