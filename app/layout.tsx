import type { Metadata } from "next";
import "./globals.css";
import { SessionProviders } from "@/components/session-provider";

export const metadata: Metadata = {
  title: "Portfolio | Full Stack Developer",
  description: "A bilingual portfolio showcasing projects and skills in web development.",
};

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
