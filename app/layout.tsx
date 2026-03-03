import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SessionProviders } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, isValidLocale } from "@/lib/i18n";
import { getAuthOptions } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-body",
  weight: ["400", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "optional",
  variable: "--font-heading",
  weight: ["400", "600"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://ivan-caamano.me"
    : "http://127.0.0.1:3000");
const OG_IMAGE_PATH = "/profile.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Iván Caamaño | AI & Software Engineer Portfolio",
  description:
    "Bilingual portfolio of Iván Caamaño featuring production AI agents, RAG systems, data engineering, and software projects for real teams.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Iván Caamaño | AI & Software Engineer Portfolio",
    description:
      "Bilingual portfolio featuring production AI agents, RAG systems, data engineering, and software project outcomes.",
    siteName: "Iván Caamaño",
    url: "/",
    type: "website",
    images: [
      {
        url: `${SITE_URL}${OG_IMAGE_PATH}`,
        width: 1200,
        height: 630,
        alt: "Portfolio preview",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get("x-locale");
  const htmlLang =
    headerLocale && isValidLocale(headerLocale) ? headerLocale : defaultLocale;
  const isAuthConfigured = Boolean(getAuthOptions());

  return (
    <html
      lang={htmlLang}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          {isAuthConfigured ? (
            <SessionProviders>{children}</SessionProviders>
          ) : (
            children
          )}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
