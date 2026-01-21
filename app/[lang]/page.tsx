import { PortfolioLanding } from "@/components/portfolio-landing";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";
import { getLandingContent } from "@/lib/content-store";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;
  
  // Load content from backend on the server
  const initialContent = await getLandingContent(locale);

  return <PortfolioLanding initialLang={locale} initialContent={initialContent} />;
}
