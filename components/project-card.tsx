"use client";

import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { ProjectEntry } from "@/lib/mdx";
import type { Locale } from "@/lib/i18n";

interface ProjectCardProps {
  project: ProjectEntry;
  locale: Locale;
  highlightLabel: string;
  stackLabel: string;
  viewProjectLabel: string;
  viewCodeLabel: string;
  index?: number;
}

export function ProjectCard({
  project,
  locale,
  highlightLabel,
  stackLabel,
  viewProjectLabel,
  viewCodeLabel,
  index = 0,
}: ProjectCardProps) {
  const { frontmatter } = project;
  const formattedDate = new Date(frontmatter.date).toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex h-full flex-col rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
        <span>{formattedDate}</span>
        <span>{highlightLabel}</span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold text-white">
        {frontmatter.title}
      </h3>
      <p className="mt-2 text-sm text-teal-300">{frontmatter.highlight}</p>
      <p className="mt-4 flex-1 text-base leading-relaxed text-zinc-300">
        {frontmatter.summary}
      </p>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          {stackLabel}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {frontmatter.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-zinc-700/70 px-3 py-1 text-xs text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {frontmatter.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-900 px-3 py-1 text-xs uppercase tracking-wider text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {frontmatter.demo && (
          <Button asChild size="sm">
            <Link href={frontmatter.demo} target="_blank" rel="noreferrer">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              {viewProjectLabel}
            </Link>
          </Button>
        )}
        {frontmatter.repo && (
          <Button asChild size="sm" variant="outline">
            <Link href={frontmatter.repo} target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {viewCodeLabel}
            </Link>
          </Button>
        )}
      </div>
    </motion.article>
  );
}
