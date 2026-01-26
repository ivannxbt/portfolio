"use client";

/**
 * AnimatedProjectsGrid Component
 *
 * Client component wrapper for the projects grid with stagger animations.
 * Separated from the server component to enable Framer Motion animations.
 */

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { staggerContainer, staggerItem, scrollViewport } from "@/lib/animations";
import type { ProjectEntry } from "@/lib/mdx";
import type { Locale } from "@/lib/i18n";

interface AnimatedProjectsGridProps {
  projects: ProjectEntry[];
  locale: Locale;
  highlightLabel: string;
  stackLabel: string;
  viewProjectLabel: string;
  viewCodeLabel: string;
}

export function AnimatedProjectsGrid({
  projects,
  locale,
  highlightLabel,
  stackLabel,
  viewProjectLabel,
  viewCodeLabel,
}: AnimatedProjectsGridProps) {
  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      variants={staggerContainer}
    >
      {projects.map((project, index) => (
        <motion.div key={project.slug} variants={staggerItem}>
          <ProjectCard
            project={project}
            locale={locale}
            highlightLabel={highlightLabel}
            stackLabel={stackLabel}
            viewProjectLabel={viewProjectLabel}
            viewCodeLabel={viewCodeLabel}
            index={index}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
