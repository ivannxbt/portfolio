import { BlogCard } from "@/components/blog-card";
import { getBlogPosts } from "@/lib/mdx";
import { getTranslations, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const posts = getBlogPosts(lang);

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {t.blog.title}
          </h1>
          <p className="text-lg text-zinc-400">{t.blog.description}</p>
        </header>

        {posts.length === 0 ? (
          <p className="text-zinc-500">{t.blog.empty}</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <BlogCard
                key={post.slug}
                lang={lang}
                post={post}
                readMoreLabel={t.blog.readMore}
                publishedLabel={t.blog.published}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
