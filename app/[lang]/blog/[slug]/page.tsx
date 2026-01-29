import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAllSlugs, getCompiledBlogPost } from "@/lib/mdx";
import { getTranslations, type Locale, locales } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs("blog");
  const params: { lang: Locale; slug: string }[] = [];

  for (const lang of locales) {
    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const post = await getCompiledBlogPost(slug, lang);

  if (!post) {
    notFound();
  }

  const t = getTranslations(lang);
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    lang === "es" ? "es-ES" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const coverImage = post.frontmatter.image?.trim();

  return (
    <article className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Button asChild variant="ghost" className="text-slate-400">
          <Link href={`/${lang}/blog`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lang === "es" ? "Volver al blog" : "Back to blog"}
          </Link>
        </Button>

        <header className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
            <CalendarDays className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {post.frontmatter.title}
          </h1>
          <p className="text-lg text-slate-300">{post.frontmatter.summary}</p>
          {post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-800/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {coverImage && (
          <div className="overflow-hidden rounded-3xl border border-slate-800/30 bg-slate-950/60">
            <div className="relative h-64 w-full sm:h-80">
              <Image
                src={coverImage}
                alt={`${post.frontmatter.title} cover`}
                fill
                sizes="(min-width: 640px) 768px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <div className="markdown-body space-y-6 text-base leading-relaxed text-slate-200">
          {post.content}
        </div>

        <div className="rounded-2xl border border-slate-800/30 bg-slate-950/60 p-6">
          <p className="text-sm text-slate-400">
            {lang === "es"
              ? "¿Listo para llevar algo similar a producción? Escríbeme."
              : "Ready to ship something similar? Let's collaborate."}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href={`/${lang}/contact`}>{t.actions.contact}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
