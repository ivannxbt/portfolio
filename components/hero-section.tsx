"use client";

import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

interface HeroCopy {
  greeting: string;
  name: string;
  role: string;
  description: string;
  availability: string;
  metrics: ReadonlyArray<{ label: string; value: string }>;
}

interface HeroSectionProps {
  lang: Locale;
  copy: HeroCopy;
  actions: {
    downloadCV: string;
    viewProjects: string;
    contact: string;
  };
}

export function HeroSection({ lang, copy, actions }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/70 to-zinc-950 p-8 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
          {copy.greeting}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
          {copy.name}
        </h1>
        <p className="mt-4 text-lg text-zinc-400 sm:text-xl">{copy.role}</p>
        <p className="mt-6 text-lg leading-relaxed text-zinc-300">
          {copy.description}
        </p>
        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-teal-300">
          {copy.availability}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a
              href="/cv_iacc.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              <Download aria-hidden className="h-4 w-4" />
              <span>{actions.downloadCV}</span>
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`/${lang}/projects`}>{actions.viewProjects}</Link>
          </Button>
        </div>

        <Link
          href={`/${lang}/contact`}
          className="mt-6 inline-flex items-center text-sm font-medium text-zinc-300 hover:text-white"
        >
          {actions.contact}
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-12 grid gap-4 sm:grid-cols-3"
      >
        {copy.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-4 py-5"
          >
            <p className="text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
              {metric.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
