"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ExternalLink,
  Globe,
  BrainCircuit,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { refinedElevate, tagStagger, tagItem } from "@/lib/animations";
import type { ProjectItem } from "@/content/site-content";

import type { Theme } from "@/lib/types";

interface ProjectCardBrutalProps {
  project: ProjectItem;
  theme: Theme;
  index: number;
}

const secondaryTypeConfig: Record<
  NonNullable<ProjectItem["secondaryTypes"]>[number],
  {
    icon: LucideIcon;
    darkClassName: string;
    lightClassName: string;
  }
> = {
  Mobile: {
    icon: Smartphone,
    darkClassName: "bg-orange-500/20 text-orange-300",
    lightClassName: "bg-orange-100 text-orange-700",
  },
};

export const ProjectCardBrutal = React.memo(
  ({ project, theme, index }: ProjectCardBrutalProps) => {
    const projectNumber = String(index + 1).padStart(2, "0");
    const projectImage = project.image?.trim() || "/blog/default.svg";
    const projectYearLabel = index < 2 ? "2025-2026" : "2025";

    return (
      <motion.article
        className={`relative flex h-full flex-col overflow-hidden border ${
          theme === "brutal"
            ? "rounded-none border-[3px] border-black bg-white"
            : theme === "dark"
              ? "rounded-xl border-neutral-800 bg-[#242424]"
              : "rounded-xl border-neutral-200 bg-white"
        }`}
        initial="rest"
        whileHover="hover"
        variants={refinedElevate}
      >
        <div className="flex flex-grow flex-col p-6">
          {/* Header: Number + Tags */}
          <div className="mb-6 flex items-start justify-between">
            <span
              className={`font-mono text-sm ${
                theme === "dark" ? "text-neutral-600" : "text-neutral-400"
              }`}
            >
              #{projectNumber}
            </span>
            <motion.div
              className="flex flex-wrap justify-end gap-2"
              variants={tagStagger}
              initial="hidden"
              animate="visible"
            >
              {project.tags.slice(0, 3).map((tag) => (
                <motion.span
                  key={tag}
                  variants={tagItem}
                  className={`text-[10px] font-medium tracking-[0.15em] uppercase ${
                    theme === "dark" ? "text-neutral-500" : "text-neutral-500"
                  }`}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Title */}
          <h3
            className={`mb-4 text-2xl leading-[1.1] tracking-tight ${
              theme === "brutal"
                ? "font-black text-black"
                : theme === "dark"
                  ? "font-bold text-white"
                  : "font-bold text-neutral-900"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className={`mb-6 line-clamp-4 text-sm leading-relaxed ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {project.desc}
          </p>

          {/* Labels: Project Type + Secondary Types */}
          <div className="mb-4 flex flex-wrap gap-2">
            {/* Project Type Badge */}
            {project.projectType && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider uppercase ${
                  project.projectType === "AI"
                    ? theme === "dark"
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-purple-100 text-purple-700"
                    : theme === "dark"
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-teal-100 text-teal-700"
                }`}
              >
                {project.projectType === "AI" ? (
                  <BrainCircuit size={12} />
                ) : (
                  <Globe size={12} />
                )}
                {project.projectType}
              </span>
            )}

            {/* Secondary Type Badges */}
            {project.secondaryTypes?.map((type) => {
              const config = secondaryTypeConfig[type];
              if (!config) {
                return null;
              }

              const Icon = config.icon;

              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold tracking-wider uppercase ${
                    theme === "dark"
                      ? config.darkClassName
                      : config.lightClassName
                  }`}
                >
                  <Icon size={12} />
                  {type}
                </span>
              );
            })}
          </div>

          {/* Spacer to push content below to bottom */}
          <div className="flex-grow" />

          {/* Project Image - Floating Island */}
          {projectImage && (
            <div
              className={`relative my-4 h-40 w-full overflow-hidden rounded-xl shadow-lg ${
                theme === "dark"
                  ? "ring-1 ring-white/10"
                  : "ring-1 ring-black/5"
              }`}
            >
              <Image
                src={projectImage}
                alt={`${project.title} preview`}
                width={1200}
                height={675}
                className="h-full w-full object-cover object-center"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Footer: Year + Links */}
          <div
            className={`flex items-center justify-between border-t pt-4 ${
              theme === "dark" ? "border-neutral-800" : "border-neutral-200"
            }`}
          >
            <span
              className={`font-mono text-xs ${
                theme === "dark" ? "text-neutral-600" : "text-neutral-400"
              }`}
            >
              {projectYearLabel}
            </span>
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  theme === "dark"
                    ? "text-neutral-500 hover:text-white"
                    : "text-neutral-400 hover:text-neutral-900"
                }`}
                whileHover={{ scale: 1.1, rotate: -15 }}
                aria-label="View live site"
              >
                <ExternalLink size={16} />
              </motion.a>
            )}
          </div>
        </div>
      </motion.article>
    );
  },
);

ProjectCardBrutal.displayName = "ProjectCardBrutal";
