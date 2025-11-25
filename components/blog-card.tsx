"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

import type { BlogEntry } from "@/lib/mdx";
import type { Locale } from "@/lib/i18n";

interface BlogCardProps {
  lang: Locale;
  post: BlogEntry;
  readMoreLabel: string;
  publishedLabel: string;
  index?: number;
}

export function BlogCard({
  lang,
  post,
  readMoreLabel,
  publishedLabel,
  index = 0,
}: BlogCardProps) {
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    lang === "es" ? "es-ES" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
        <CalendarDays className="h-4 w-4" />
        <span>{`${publishedLabel} · ${formattedDate}`}</span>
      </div>
      <Link href={`/${lang}/blog/${post.slug}`} className="mt-4">
        <h3 className="text-2xl font-semibold text-white">
          {post.frontmatter.title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">
          {post.frontmatter.summary}
        </p>
      </Link>

      {post.frontmatter.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs uppercase tracking-wider text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/${lang}/blog/${post.slug}`}
        className="mt-6 inline-flex items-center text-sm font-semibold text-teal-300 hover:text-white"
      >
        {readMoreLabel}
      </Link>
    </motion.article>
  );
}
