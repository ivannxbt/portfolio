import { PortfolioLanding } from "@/components/portfolio-landing";
import { defaultContent } from "@/content/site-content";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";
import { getLandingContentFromApi } from "@/lib/api-client";
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

  const enContent = enResult.status === "fulfilled" ? enResult.value : defaultContent.en;
  const esContent = esResult.status === "fulfilled" ? esResult.value : defaultContent.es;
  const substackPosts = substackResult.status === "fulfilled" ? substackResult.value : [];

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
