"use client";

import { ArrowUpRight, Download } from "lucide-react";

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
    <section className="relative overflow-hidden rounded-3xl border border-slate-800/30 bg-gradient-to-b from-slate-900/70 to-slate-950 p-8 sm:p-12">
      <div className="max-w-3xl animate-fade-in-up">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          {copy.greeting}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
          {copy.name}
        </h1>
        <p className="mt-4 text-lg text-slate-400 sm:text-xl">{copy.role}</p>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">
          {copy.description}
        </p>
        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-teal-300">
          {copy.availability}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a
              href="/CV.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              <Download aria-hidden className="h-4 w-4" />
              <span>{actions.downloadCV}</span>
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#projects">{actions.viewProjects}</a>
          </Button>
        </div>

        <a
          href="#contact"
          className="mt-6 inline-flex items-center text-sm font-medium text-slate-300 hover:text-white"
        >
          {actions.contact}
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </a>
      </div>

      <div
        className="mt-12 grid gap-4 sm:grid-cols-3 animate-fade-in-up"
        style={{ animationDelay: '150ms' }}
      >
        {copy.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-slate-800/40 bg-slate-900/60 px-4 py-5"
          >
            <p className="text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
