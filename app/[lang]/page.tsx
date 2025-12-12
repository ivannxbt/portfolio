import { PortfolioLanding } from "@/components/portfolio-landing";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;

  return <PortfolioLanding initialLang={locale} />;
}
