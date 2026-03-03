import { PortfolioLanding } from "@/components/portfolio-landing";
import { defaultContent } from "@/content/site-content";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";
import { getLandingContent } from "@/lib/content-store";
import { getSubstackPosts } from "@/lib/substack";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://ivan-caamano.me"
      : "http://127.0.0.1:3000");
  const localizedUrl = `${siteUrl}/${locale}`;

  // Pre-fetch BOTH language versions on the server for instant language switching
  // This eliminates the 1-3s client-side fetch delay
  const [enResult, esResult, substackResult] = await Promise.allSettled([
    getLandingContent("en"),
    getLandingContent("es"),
    getSubstackPosts(3),
  ]);

  const enContent =
    enResult.status === "fulfilled" ? enResult.value : defaultContent.en;
  const esContent =
    esResult.status === "fulfilled" ? esResult.value : defaultContent.es;
  const substackPosts =
    substackResult.status === "fulfilled" ? substackResult.value : [];
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Iván Caamaño",
    url: localizedUrl,
    image: `${siteUrl}/profile.webp`,
    jobTitle:
      locale === "es" ? "Ingeniero de IA y Software" : "AI & Software Engineer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    sameAs: [
      "https://github.com/ivannxbt",
      "https://www.linkedin.com/in/ivancaamano/",
      "https://x.com/_ivvann",
    ],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Iván Caamaño Portfolio",
    url: siteUrl,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/${locale}#projects`,
      "query-input": "required name=project",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <PortfolioLanding
        initialLang={locale}
        initialContent={locale === "en" ? enContent : esContent}
        enContent={enContent}
        esContent={esContent}
        substackPosts={substackPosts}
      />
    </>
  );
}
