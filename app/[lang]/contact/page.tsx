import Link from "next/link";
import type { Metadata } from "next";

import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;

  return {
    title:
      locale === "es"
        ? "Contacto | Iván Caamaño, proyectos de IA y software"
        : "Contact | Iván Caamaño, AI and software projects",
    description:
      locale === "es"
        ? "Página de contacto para colaboraciones en consultoría, automatización y proyectos de IA y software con enfoque en resultados de negocio."
        : "Contact page for collaboration, consulting, and AI/software project opportunities focused on measurable business outcomes.",
    alternates: {
      canonical: `/${locale}/contact`,
    },
    openGraph: {
      url: `/${locale}/contact`,
      images: ["/profile.webp"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/profile.webp"],
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;

  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <h1 className="text-3xl font-bold">
        {locale === "es" ? "Contacto" : "Contact"}
      </h1>
      <p className="mt-6 text-base leading-7 text-neutral-600 dark:text-neutral-300">
        {locale === "es"
          ? "Si quieres colaborar en automatización, IA aplicada o ingeniería de datos, escríbeme por email y te respondo lo antes posible."
          : "If you want to collaborate on automation, applied AI, or data engineering, send me an email and I will reply as soon as possible."}
      </p>
      <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">
        {locale === "es"
          ? "Estoy disponible para iniciativas de discovery, implementación técnica y escalado de soluciones en producción."
          : "I am available for discovery initiatives, technical implementation, and production-scale solution delivery."}
      </p>
      <p className="mt-4 text-lg font-medium">
        <a
          href="mailto:ivanncaamano@gmail.com"
          className="underline underline-offset-4"
        >
          ivanncaamano@gmail.com
        </a>
      </p>
      <div className="mt-8 flex gap-4 text-sm">
        <Link href={`/${locale}`} className="underline underline-offset-4">
          {locale === "es" ? "Volver al inicio" : "Back to home"}
        </Link>
        <Link
          href={`/${locale}/privacy`}
          className="underline underline-offset-4"
        >
          {locale === "es" ? "Privacidad" : "Privacy"}
        </Link>
        <Link
          href={`/${locale}/about`}
          className="underline underline-offset-4"
        >
          {locale === "es" ? "Sobre mí" : "About"}
        </Link>
      </div>
    </main>
  );
}
