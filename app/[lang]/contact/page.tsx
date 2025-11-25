import Link from "next/link";

import { getTranslations, type Locale } from "@/lib/i18n";
import { ContactForm } from "@/components/contact-form";

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {t.contact.title}
          </h1>
          <p className="text-lg text-zinc-400">{t.contact.description}</p>
          <p className="text-zinc-400">{t.contact.callout}</p>
        </header>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {t.contact.details?.map((detail) => (
              <div key={detail.label} className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {detail.label}
                </p>
                {detail.href ? (
                  <Link
                    href={detail.href}
                    className="text-base font-semibold text-white hover:text-teal-300"
                  >
                    {detail.value}
                  </Link>
                ) : (
                  <p className="text-base font-semibold text-white">
                    {detail.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <ContactForm translations={t.contact} lang={lang} />
      </div>
    </div>
  );
}
