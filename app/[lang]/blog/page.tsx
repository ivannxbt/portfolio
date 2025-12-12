import { BlogList } from "@/components/blog-list";
import { defaultContent } from "@/content/site-content";
import { defaultLocale, getTranslations, isValidLocale, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;
  const t = getTranslations(locale);
  const initial = defaultContent[locale];

  return (
    <BlogList
      locale={locale}
      copy={{
        title: t.blog.title,
        description: t.blog.description,
        empty: t.blog.empty,
        readMore: t.blog.readMore,
      }}
      initialPosts={initial.blogPosts}
    />
  );
}
