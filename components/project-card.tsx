"use client";

import Link from "next/link";
import { ArrowUpRight, Cloud, Database, Github, Layers } from "lucide-react";
import { motion } from "framer-motion";

import type { ProjectEntry } from "@/lib/mdx";
import type { Locale } from "@/lib/i18n";

type ProjectIconKey = "cloud" | "database" | "layers";

const iconMatchers: Array<{ key: ProjectIconKey; test: RegExp }> = [
  { key: "cloud", test: /(aws|azure|bedrock|lambda|serverless|cloud)/i },
  { key: "database", test: /(data|database|sql|db|postgres|mysql|redis)/i },
];

const resolveProjectIcon = (stack: string[]): ProjectIconKey => {
  const normalized = stack.map((item) => item.toLowerCase());
  for (const entry of iconMatchers) {
    if (normalized.some((value) => entry.test.test(value))) {
      return entry.key;
    }
  }
  return "layers";
};

interface ProjectIconProps {
  stack: string[];
}

function ProjectIcon({ stack }: ProjectIconProps) {
  const iconKey = resolveProjectIcon(stack);
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-900 bg-neutral-900 text-teal-400 transition-colors duration-200 group-hover:border-teal-500/70 group-hover:bg-neutral-800">
      {iconKey === "cloud" ? (
        <Cloud size={24} strokeWidth={1.5} />
      ) : iconKey === "database" ? (
        <Database size={24} strokeWidth={1.5} />
      ) : (
        <Layers size={24} strokeWidth={1.5} />
      )}
    </div>
  );
}

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
      transition={{ delay: index * 0.06 }}
      className="group relative flex h-full flex-col gap-4 rounded-2xl border border-neutral-900 bg-[#0a0a0a] p-6 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] transition-all duration-200 hover:border-teal-500/70 hover:shadow-[0_40px_120px_-40px_rgba(16,185,129,0.55)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ProjectIcon stack={frontmatter.stack} />
          <div>
            <h3 className="text-lg font-semibold text-white">{frontmatter.title}</h3>
            {frontmatter.highlight && (
              <p className="text-[10px] uppercase tracking-[0.4em] text-teal-400 opacity-80">
                {highlightLabel}
              </p>
            )}
          </div>
        </div>
        <time className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">
          {formattedDate}
        </time>
      </div>

      {frontmatter.highlight && (
        <p className="text-sm text-teal-300">{frontmatter.highlight}</p>
      )}

      <p className="text-sm leading-relaxed text-neutral-400">{frontmatter.summary}</p>

      {frontmatter.stack.length > 0 && (
        <div className="mt-1 border-t border-white/10 pt-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">{stackLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {frontmatter.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-neutral-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400 transition-colors duration-200 hover:border-teal-500/60 hover:text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-900/70 px-3 py-1 text-xs font-semibold text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-3 pt-4 border-t border-white/10">
        {frontmatter.demo && (
          <Link
            href={frontmatter.demo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/60 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.3em] text-teal-300 transition hover:border-teal-500 hover:text-white"
          >
            <ArrowUpRight size={14} />
            {viewProjectLabel}
          </Link>
        )}
        {frontmatter.repo && (
          <Link
            href={frontmatter.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-900 px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.3em] text-neutral-400 transition hover:border-teal-500 hover:text-white"
          >
            <Github size={14} />
            {viewCodeLabel}
          </Link>
        )}
      </div>
    </motion.article>
  );
}
