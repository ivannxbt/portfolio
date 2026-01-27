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

  // Load content and Substack posts on the server
  const [initialContent, substackPosts] = await Promise.all([
    getLandingContent(locale),
    getSubstackPosts(3),
  ]);

  return (
    <PortfolioLanding
      initialLang={locale}
      initialContent={initialContent}
      substackPosts={substackPosts}
    />
  );
}
