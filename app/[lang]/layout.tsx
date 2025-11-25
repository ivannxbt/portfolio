import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { isValidLocale, type Locale, locales } from "@/lib/i18n";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: lang === "es" 
      ? "Portfolio | Desarrollador Full Stack" 
      : "Portfolio | Full Stack Developer",
    description: lang === "es"
      ? "Un portfolio bilingüe que muestra proyectos y habilidades en desarrollo web."
      : "A bilingual portfolio showcasing projects and skills in web development.",
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  if (!isValidLocale(lang)) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar lang={lang as Locale} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer lang={lang as Locale} />
    </div>
  );
}
