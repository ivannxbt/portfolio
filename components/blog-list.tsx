'use client';

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { BlogEntry, LandingContent } from "@/content/site-content";

interface BlogListProps {
  locale: Locale;
  copy: {
    title: string;
    description: string;
    empty: string;
    readMore: string;
  };
  initialPosts: BlogEntry[];
}

export function BlogList({ locale, copy, initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState<BlogEntry[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/content?lang=${locale}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch blog data.");
        }
        const payload = (await response.json()) as { data: LandingContent };
        if (!cancelled && payload.data) {
          setPosts(payload.data.blogPosts ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Blog content fetch error:", err);
          setError("Unable to refresh blog entries.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    refresh();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-400">
            Blog
          </p>
          <h1 className="text-4xl font-semibold">{copy.title}</h1>
          <p className="text-base text-zinc-400 whitespace-pre-line">
            {copy.description}
          </p>
        </header>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-3xl border border-white/5 bg-zinc-950/60 px-6 py-12 text-center text-sm text-zinc-400">
            Fetching latest entries…
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="rounded-3xl border border-white/5 bg-zinc-950/60 px-6 py-12 text-center text-sm text-zinc-400">
            {copy.empty}
          </p>
        )}

        <div className="grid gap-6">
          {posts.map((post) => {
            const link = post.url;
            const isExternal = Boolean(link);
            return (
              <article
                key={post.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-zinc-950/60 p-6"
              >
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
                  <CalendarDays className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p className="text-base leading-relaxed text-zinc-300 whitespace-pre-line">
                  {post.summary}
                </p>
                {link && (
                  <a
                    href={link}
                    {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300 hover:text-white"
                  >
                    {copy.readMore} <ArrowUpRight size={16} />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
