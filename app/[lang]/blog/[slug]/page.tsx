import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getContentBySlug, getAllSlugs } from "@/lib/mdx";
import { locales } from "@/lib/i18n";

export async function generateStaticParams() {
  const slugs = getAllSlugs("blog");
  const params: { lang: string; slug: string }[] = [];

  for (const lang of locales) {
    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = getContentBySlug("blog", slug, lang);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="ghost" className="mb-8">
          <Link href={`/${lang}/blog`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lang === "es" ? "Volver al blog" : "Back to blog"}
          </Link>
        </Button>

        <header className="mb-8">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.frontmatter.date}>
              {new Date(post.frontmatter.date).toLocaleDateString(
                lang === "es" ? "es-ES" : "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </time>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {post.frontmatter.title}
          </h1>
          <p className="text-zinc-400 text-lg">{post.frontmatter.description}</p>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none">
          {post.content.split("\n").map((paragraph, index) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-2xl font-semibold text-white mt-8 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.trim()) {
              return (
                <p key={index} className="text-zinc-300 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    </article>
  );
}
