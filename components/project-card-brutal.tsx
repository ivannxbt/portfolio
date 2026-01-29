"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { refinedElevate, tagStagger, tagItem } from "@/lib/animations";
import { RichText } from "@/components/portfolio/rich-text";
import type { ProjectItem } from "@/content/site-content";

interface ProjectCardBrutalProps {
  project: ProjectItem;
  theme: "light" | "dark";
  index: number;
}

export const ProjectCardBrutal = React.memo(
  ({ project, theme, index }: ProjectCardBrutalProps) => {
    const projectNumber = String(project.id).padStart(2, "0");

    return (
      <motion.article
        className={`relative overflow-hidden rounded-xl flex flex-col h-full border ${theme === "dark"
          ? "bg-[#0a0a0a] border-neutral-800"
          : "bg-white border-neutral-200"
          }`}
        initial="rest"
        whileHover="hover"
        variants={refinedElevate}
      >
        <div className="p-6 flex flex-col flex-grow">
          {/* Header: Number + Tags */}
          <div className="flex items-start justify-between mb-6">
            <span
              className={`font-mono text-sm ${theme === "dark" ? "text-neutral-600" : "text-neutral-400"
                }`}
            >
              #{projectNumber}
            </span>
            <motion.div
              className="flex flex-wrap gap-2 justify-end"
              variants={tagStagger}
              initial="hidden"
              animate="visible"
            >
              {project.tags.slice(0, 3).map((tag) => (
                <motion.span
                  key={tag}
                  variants={tagItem}
                  className={`text-[10px] uppercase tracking-[0.15em] font-medium ${theme === "dark" ? "text-neutral-500" : "text-neutral-500"
                    }`}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Title */}
          <h3
            className={`text-2xl font-bold tracking-tight mb-4 leading-[1.1] ${theme === "dark" ? "text-white" : "text-neutral-900"
              }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <RichText
            text={project.desc}
            className={`text-sm leading-relaxed mb-6 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}
            linkClassName={
              theme === "dark"
                ? "text-teal-400 underline underline-offset-4 hover:text-white"
                : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
            }
          />

          {/* Spacer to push footer down */}
          <div className="flex-grow" />

          {/* Footer: Year + Links */}
          <div
            className={`flex items-center justify-between pt-4 border-t mb-4 ${theme === "dark" ? "border-neutral-800" : "border-neutral-200"
              }`}
          >
            <span
              className={`text-xs font-mono ${theme === "dark" ? "text-neutral-600" : "text-neutral-400"
                }`}
            >
              2024-2025
            </span>
            <div className="flex gap-3">
              <motion.a
                href={project.githubUrl ?? `https://github.com/ivannxbt/${project.title.toLowerCase().replace(/\s+/g, "-")}`}
                target="_blank"
                rel="noreferrer"
                className={`${theme === "dark"
                  ? "text-neutral-500 hover:text-white"
                  : "text-neutral-400 hover:text-neutral-900"
                  }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View on GitHub"
              >
                <Github size={16} />
              </motion.a>
              {project.liveUrl ? (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${theme === "dark"
                    ? "text-neutral-500 hover:text-white"
                    : "text-neutral-400 hover:text-neutral-900"
                    }`}
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  aria-label="View demo"
                >
                  <ExternalLink size={16} />
                </motion.a>
              ) : (
                <motion.span
                  className={`${theme === "dark"
                    ? "text-neutral-500 hover:text-white"
                    : "text-neutral-400 hover:text-neutral-900"
                    }`}
                  whileHover={{ scale: 1.1, rotate: -15 }}
                  aria-label="View demo"
                >
                  <ExternalLink size={16} />
                </motion.span>
              )}
            </div>
          </div>
        </div>

        {/* Project Image - At the bottom */}
        {project.image && (
          <div className={`relative w-full h-48 border-t ${theme === "dark" ? "border-neutral-800" : "border-neutral-200"
            }`}>
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
      </motion.article>
    );
  }
);

ProjectCardBrutal.displayName = "ProjectCardBrutal";
