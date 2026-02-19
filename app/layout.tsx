import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SessionProviders } from "@/components/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ivan-caamano.me";
const OG_IMAGE_PATH = "/profile.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Portfolio | Full Stack Developer",
  description: "A bilingual portfolio showcasing projects and skills in web development.",
  openGraph: {
    title: "Portfolio | Full Stack Developer",
    description: "A bilingual portfolio showcasing projects and skills in web development.",
    siteName: "Portfolio",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased font-sans">
        <ThemeProvider>
          <SessionProviders>{children}</SessionProviders>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
