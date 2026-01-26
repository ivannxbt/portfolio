import { BlogList } from "@/components/blog-list";
import { defaultLocale, getTranslations, isValidLocale, type Locale } from "@/lib/i18n";
import { getSubstackPosts } from "@/lib/substack";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;
  const locale: Locale = isValidLocale(lang) ? (lang as Locale) : defaultLocale;
  const t = getTranslations(locale);

  const initialPosts = await getSubstackPosts(3);

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
