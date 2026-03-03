import Link from "next/link";
import type { Metadata } from "next";

import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;

  return {
    title:
      locale === "es"
        ? "Sobre mí | Iván Caamaño, IA y Software en producción"
        : "About | Iván Caamaño, AI and Software in production",
    description:
      locale === "es"
        ? "Perfil profesional de Iván Caamaño con experiencia en IA aplicada, desarrollo de software y operaciones de datos para productos digitales en producción."
        : "Professional profile of Iván Caamaño, focused on applied AI, software engineering, and data operations for production digital products.",
    alternates: {
      canonical: `/${locale}/about`,
    },
    openGraph: {
      url: `/${locale}/about`,
      images: ["/profile.webp"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/profile.webp"],
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;

  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <h1 className="text-3xl font-bold">
        {locale === "es" ? "Sobre mí" : "About"}
      </h1>
      <p className="mt-6 text-base leading-7 text-neutral-600 dark:text-neutral-300">
        {locale === "es"
          ? "Soy Iván Caamaño, ingeniero de IA y software. Trabajo en agentes, RAG y sistemas de datos orientados a producción para entregar impacto medible."
          : "I am Iván Caamaño, an AI and software engineer. I build agents, RAG workflows, and data systems for production environments with measurable impact."}
      </p>
      <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">
        {locale === "es"
          ? "Durante los últimos años he trabajado en consultoría y producto diseñando soluciones end-to-end: desde arquitectura hasta despliegue y operación."
          : "Over the last years I have worked across consulting and product contexts, building end-to-end solutions from architecture to deployment and operations."}
      </p>
      <div className="mt-8 flex gap-4 text-sm">
        <Link href={`/${locale}`} className="underline underline-offset-4">
          {locale === "es" ? "Volver al inicio" : "Back to home"}
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="underline underline-offset-4"
        >
          {locale === "es" ? "Contacto" : "Contact"}
        </Link>
        <Link
          href={`/${locale}/privacy`}
          className="underline underline-offset-4"
        >
          {locale === "es" ? "Privacidad" : "Privacy"}
        </Link>
      </div>
    </main>
  );
}
