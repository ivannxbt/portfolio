import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { isValidLocale, locales } from "@/lib/i18n";

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
        ? "Iván Caamaño | Ingeniero de IA y Software para empresas"
        : "Iván Caamaño | AI & Software Engineer for production teams",
    description:
      lang === "es"
        ? "Portafolio bilingüe con agentes de IA, sistemas RAG y operaciones de datos orientadas a producto para equipos y empresas."
        : "Bilingual portfolio featuring AI agents, RAG systems, and data operations designed for production software and measurable outcomes.",
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        es: "/es",
        "x-default": "/es",
      },
    },
    openGraph: {
      url: `/${lang}`,
      locale: lang === "es" ? "es_ES" : "en_US",
      images: ["/profile.webp"],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@ivannxbt",
      images: ["/profile.webp"],
    },
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
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
