import { PortfolioLanding } from "@/components/portfolio-landing";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";
import { getLandingContent } from "@/lib/content-store";
import { getSubstackPosts } from "@/lib/substack";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;

  // Pre-fetch BOTH language versions on the server for instant language switching
  // This eliminates the 1-3s client-side fetch delay
  const [enContent, esContent, substackPosts] = await Promise.all([
    getLandingContent('en'),
    getLandingContent('es'),
    getSubstackPosts(3),
  ]);

  return (
    <PortfolioLanding
      initialLang={locale}
      initialContent={locale === 'en' ? enContent : esContent}
      enContent={enContent}
      esContent={esContent}
      substackPosts={substackPosts}
    />
  );
}
