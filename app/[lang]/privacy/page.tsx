import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isValidLocale, type Locale } from "@/lib/i18n";

interface PrivacyPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : "es";

  return {
    title:
      locale === "es"
        ? "Política de privacidad | Iván Caamaño"
        : "Privacy policy | Iván Caamaño",
    description:
      locale === "es"
        ? "Cómo se procesan los datos compartidos a través del sitio web de Iván Caamaño."
        : "How data shared through Iván Caamaño's website is processed.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: "/en/privacy",
        es: "/es/privacy",
        "x-default": "/es/privacy",
      },
    },
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const isSpanish = lang === "es";

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {isSpanish ? "Política de privacidad" : "Privacy policy"}
      </h1>
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        {isSpanish
          ? "Última actualización: 3 de marzo de 2026"
          : "Last updated: March 3, 2026"}
      </p>

      <section className="mt-8 space-y-4 text-neutral-700 dark:text-neutral-300">
        <p>
          {isSpanish
            ? "Este sitio recopila únicamente la información que compartes de forma voluntaria mediante enlaces de contacto, correo electrónico o formularios habilitados en el futuro."
            : "This website only collects information that you voluntarily share through contact links, email, or future enabled forms."}
        </p>
        <p>
          {isSpanish
            ? "No se venden datos personales a terceros. La analítica del sitio puede registrar métricas técnicas agregadas para mejorar rendimiento y experiencia de usuario."
            : "Personal data is not sold to third parties. Website analytics may record aggregated technical metrics to improve performance and user experience."}
        </p>
        <p>
          {isSpanish
            ? "Para solicitar acceso, rectificación o eliminación de datos que hayas compartido, escribe a ivanncaamano@gmail.com."
            : "To request access, correction, or deletion of data you have shared, contact ivanncaamano@gmail.com."}
        </p>
      </section>
    </main>
  );
}
