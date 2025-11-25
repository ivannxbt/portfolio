import { getTranslations, type Locale } from "@/lib/i18n";
import { ContactForm } from "@/components/contact-form";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{t.contact.title}</h1>
        <p className="text-zinc-400 text-lg mb-12">{t.contact.description}</p>

        <ContactForm translations={t.contact} lang={lang} />
      </div>
    </div>
  );
}
