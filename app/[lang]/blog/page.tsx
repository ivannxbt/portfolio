import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations, type Locale } from "@/lib/i18n";
import { getAllContent } from "@/lib/mdx";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);
  const posts = getAllContent("blog", lang);

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{t.blog.title}</h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          {t.blog.description}
        </p>

        {posts.length === 0 ? (
          <p className="text-zinc-500">
            {lang === "es" ? "No hay artículos disponibles." : "No posts available."}
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card
                key={post.frontmatter.slug}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
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
                  <CardTitle className="text-white text-xl">
                    {post.frontmatter.title}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {post.frontmatter.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="p-0 h-auto">
                    <Link href={`/${lang}/blog/${post.frontmatter.slug}`}>
                      {t.blog.readMore}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
