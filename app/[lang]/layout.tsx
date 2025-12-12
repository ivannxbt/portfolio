import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
    title:
      lang === "es"
        ? "Iván Caamaño | Ingeniero de IA"
        : "Ivan Caamano | AI Engineer",
    description:
      lang === "es"
        ? "Portafolio bilingüe con agentes, RAG y operaciones de datos para empresas reguladas."
        : "Bilingual portfolio featuring agents, RAG systems, and data operations for regulated teams.",
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
      <main className="flex-1">{children}</main>
    </div>
  );
}
