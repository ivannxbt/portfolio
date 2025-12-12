'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Sun, Moon } from "lucide-react";

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
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  const isDark = theme === "dark";
  const pageBg = isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-neutral-900";
  const cardBg = isDark ? "bg-zinc-950/60 border-white/5" : "bg-white border-neutral-200 shadow-sm";
  const mutedText = isDark ? "text-zinc-400" : "text-neutral-500";

  return (
    <div className={`min-h-screen px-6 py-12 transition-colors duration-300 ${pageBg}`}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <p className={`text-sm uppercase tracking-[0.3em] ${isDark ? "text-teal-400" : "text-teal-600"}`}>
              Blog
            </p>
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                isDark
                  ? "border-white/10 text-neutral-300 hover:border-white/40"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-500"
              }`}
            >
              {isDark ? (
                <>
                  <Sun size={14} /> Light
                </>
              ) : (
                <>
                  <Moon size={14} /> Dark
                </>
              )}
            </button>
          </div>
          <h1 className="text-4xl font-semibold">{copy.title}</h1>
          <p className={`text-base whitespace-pre-line ${mutedText}`}>
            {copy.description}
          </p>
        </header>

        {error && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              isDark
                ? "border border-red-500/30 bg-red-500/5 text-red-200"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        {loading && (
          <div
            className={`rounded-3xl px-6 py-12 text-center text-sm ${
              isDark
                ? "border border-white/5 bg-zinc-950/60 text-zinc-400"
                : "border border-neutral-200 bg-white text-neutral-500"
            }`}
          >
            Fetching latest entries…
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p
            className={`rounded-3xl px-6 py-12 text-center text-sm ${
              isDark
                ? "border border-white/5 bg-zinc-950/60 text-zinc-400"
                : "border border-neutral-200 bg-white text-neutral-500"
            }`}
          >
            {copy.empty}
          </p>
        )}

        <div className="grid gap-6">
          {posts.map((post) => {
            const link = post.url;
            const isExternal = Boolean(link);
            const coverImage = post.image?.trim() || "/blog/default.svg";
            return (
              <article
                key={post.id}
                className={`flex flex-col gap-4 rounded-3xl p-6 transition-colors ${cardBg}`}
              >
                <div
                  className={`relative h-48 w-full overflow-hidden rounded-2xl border ${
                    isDark ? "border-white/5 bg-white/5" : "border-neutral-200 bg-neutral-100"
                  }`}
                >
                  <Image
                    src={coverImage}
                    alt={`${post.title} cover`}
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
                  <CalendarDays className={`h-4 w-4 ${isDark ? "" : "text-neutral-500"}`} />
                  <span className={isDark ? "" : "text-neutral-500"}>{post.date}</span>
                </div>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <p
                  className={`text-base leading-relaxed whitespace-pre-line ${
                    isDark ? "text-zinc-300" : "text-neutral-600"
                  }`}
                >
                  {post.summary}
                </p>
                {link && (
                  <a
                    href={link}
                    {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                    className={`inline-flex items-center gap-2 text-sm font-semibold ${
                      isDark ? "text-teal-300 hover:text-white" : "text-teal-600 hover:text-teal-900"
                    }`}
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
