import { BlogList } from "@/components/blog-list";
import { defaultContent } from "@/content/site-content";
import { defaultLocale, getTranslations, isValidLocale, type Locale } from "@/lib/i18n";
import { getLandingContent } from "@/lib/content-store";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;
  const t = getTranslations(locale);
  
  // Load content from backend on the server
  const content = await getLandingContent(locale);
  const initialPosts = content.blogPosts ?? defaultContent[locale].blogPosts;

  return (
    <BlogList
      locale={locale}
      copy={{
        title: t.blog.title,
        description: t.blog.description,
        empty: t.blog.empty,
        readMore: t.blog.readMore,
      }}
      initialPosts={initialPosts}
    />
  );
}
