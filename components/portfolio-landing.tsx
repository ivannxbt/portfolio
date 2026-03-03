"use client";

import Image from "next/image";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useSyncExternalStore,
} from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  BrainCircuit,
  Briefcase,
  Clock3,
  Cloud,
  Code2,
  Database,
  Download,
  FileText,
  Github,
  Layers,
  Linkedin,
  MapPin,
  Rss,
  Send,
  Twitter,
  type LucideIcon,
} from "lucide-react";
import { Header } from "@/components/header";
import type { Theme, Language } from "@/lib/types";
import { ScrollReveal } from "./scroll-reveal";
import { GithubContributionsSkeleton } from "./ui/skeleton";
import {
  defaultContent,
  type LandingContent,
  type ProjectItem,
  type BlogEntry,
  type SocialPlatform,
  type ProjectIcon,
  type StackIcon,
} from "@/content/site-content";
import { ProjectCardBrutal } from "@/components/project-card-brutal";
import { RichText } from "@/components/portfolio/rich-text";

const GithubContributions = dynamic(
  () =>
    import("@/components/github-contributions").then(
      (mod) => mod.GithubContributions,
    ),
  {
    ssr: true,
    loading: () => <GithubContributionsSkeleton />,
  },
);

const ClairoChat = dynamic(
  () =>
    import("@/components/portfolio/clairo-chat").then((mod) => mod.ClairoChat),
  { ssr: false },
);
import {
  fadeInUp,
  fadeInLeft,
  scrollViewport,
  codeReveal,
  elevate,
  developerStagger,
  developerStaggerItem,
  pageTransition,
} from "@/lib/animations";

const downwardStaggerItem = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ease: [0, 0, 0.2, 1] as const,
      duration: 0.5,
    },
  },
};

const socialIconMap: Record<SocialPlatform, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  resume: FileText,
};

const projectIconMap: Record<ProjectIcon, LucideIcon> = {
  cloud: Cloud,
  database: Database,
  layers: Layers,
};

const githubUsername = "ivannxbt";
const BLOG_PREVIEW_COUNT = 3;
const PROJECT_PREVIEW_COUNT = 3;

const TechIcon = ({ label, theme }: { label: string; theme: Theme }) => (
  <span
    className={`cursor-default rounded border px-2 py-1 font-mono text-xs transition-colors ${
      theme === "dark"
        ? "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-600"
        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
    }`}
  >
    {label}
  </span>
);

const stackIconMap: Record<StackIcon, LucideIcon> = {
  code: Code2,
  layers: Layers,
  brain: BrainCircuit,
};

const ContactShowcase = React.memo(
  ({
    contact,
    theme,
    lang,
  }: {
    contact: LandingContent["contact"];
    theme: Theme;
    lang: Language;
  }) => {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copyEmail = useCallback(async (value: string, key: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
      } catch (error) {
        console.error("Clipboard error:", error);
      }
    }, []);

    const items = useMemo(
      () => [
        ...contact.socials.map((social) => ({
          key: social.platform,
          label: social.label,
          href: social.url,
          type: "link" as const,
          icon: socialIconMap[social.platform] ?? Github,
          platform: social.platform,
          preview: social.preview,
        })),
        {
          key: "email",
          label: lang === "en" ? "Copy Email" : "Copiar email",
          value: contact.email,
          type: "copy" as const,
          icon: Send,
        },
      ],
      [contact.socials, contact.email, lang],
    );

    return (
      <div
        className={`relative mb-10 flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-3 ${
          theme === "dark"
            ? "border-white/10 bg-white/5"
            : "border-neutral-200 bg-white"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {items.map((item) => {
            const Icon = item.icon;

            if (item.type === "link") {
              return (
                <div key={item.key} className="group relative">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-sm font-medium tracking-wide transition-colors ${
                      theme === "dark"
                        ? "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                    }`}
                  >
                    <Icon aria-hidden size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </a>
                </div>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => copyEmail(item.value, item.key)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium tracking-wide transition-colors focus:outline-none ${
                  theme === "dark"
                    ? "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                }`}
              >
                <Icon size={16} />
                {copiedKey === item.key
                  ? lang === "en"
                    ? "Copied!"
                    : "¡Copiado!"
                  : item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

ContactShowcase.displayName = "ContactShowcase";

const ProjectCard = React.memo(
  ({ project, theme }: { project: ProjectItem; theme: Theme }) => {
    const IconComponent = projectIconMap[project.icon] ?? Layers;

    return (
      <motion.div
        className={`group relative flex h-full flex-col overflow-hidden rounded-xl border p-6 ${
          theme === "dark"
            ? "border-neutral-900 bg-[#242424]"
            : "border-neutral-200 bg-white"
        }`}
        initial="rest"
        whileHover="hover"
        variants={elevate}
      >
        <div className="mb-6">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
              theme === "dark"
                ? "border-teal-500/60 bg-neutral-900 text-neutral-300 group-hover:border-teal-400/80"
                : "border-teal-400/70 bg-teal-50 text-teal-700 group-hover:border-teal-400/90"
            }`}
          >
            <IconComponent size={24} strokeWidth={1.5} />
          </div>
        </div>

        <h3
          className={`mb-2 text-lg font-semibold ${
            theme === "dark"
              ? "text-neutral-200 group-hover:text-white"
              : "text-neutral-800 group-hover:text-teal-700"
          }`}
        >
          {project.title}
        </h3>
        <RichText
          text={project.desc}
          className={`mb-6 flex-grow text-sm leading-relaxed ${
            theme === "dark" ? "text-neutral-500" : "text-neutral-600"
          }`}
          linkClassName={
            theme === "dark"
              ? "text-teal-400 underline underline-offset-4 hover:text-white"
              : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
          }
        />

        <div
          className={`mt-auto flex flex-wrap gap-2 border-t pt-4 ${
            theme === "dark" ? "border-neutral-900/50" : "border-neutral-100"
          }`}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    );
  },
);

ProjectCard.displayName = "ProjectCard";

const BlogRow = React.memo(
  ({
    post,
    lang,
    theme,
    readMoreLabel,
  }: {
    post: BlogEntry;
    lang: Language;
    theme: Theme;
    readMoreLabel: string;
  }) => {
    const link = post.url?.trim() ? post.url : `/${lang}/blog`;
    const external = Boolean(post.url && /^https?:/i.test(post.url));
    const coverImage = post.image?.trim() || "/blog/default.svg";

    const cardClasses =
      theme === "brutal"
        ? "bg-white border-[3px] border-black rounded-none"
        : theme === "dark"
          ? "bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 rounded-xl"
          : "bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-lg rounded-xl";

    return (
      <a
        href={link}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`group block overflow-hidden transition-colors transition-shadow transition-transform duration-200 hover:-translate-y-1 ${cardClasses}`}
      >
        <div
          className={`relative aspect-[16/9] w-full overflow-hidden ${
            theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
          }`}
        >
          <Image
            src={coverImage}
            alt={`${post.title} cover`}
            width={1200}
            height={675}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-2 p-5">
          <span
            className={`font-mono text-xs tracking-wide uppercase ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`}
          >
            {post.date}
          </span>
          <h3
            className={`text-lg font-bold transition-colors ${
              theme === "dark"
                ? "text-neutral-100 group-hover:text-teal-400"
                : "text-neutral-900 group-hover:text-teal-600"
            }`}
          >
            {post.title}
          </h3>
          <RichText
            text={post.summary}
            className={`line-clamp-3 text-sm ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
            linkClassName={
              theme === "dark"
                ? "text-teal-400 underline underline-offset-4 hover:text-white"
                : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
            }
          />
          <span
            className={`mt-1 text-sm font-medium ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`}
          >
            {readMoreLabel} &rarr;
          </span>
        </div>
      </a>
    );
  },
);

BlogRow.displayName = "BlogRow";

const ExperienceCard = React.memo(
  ({
    item,
    theme,
  }: {
    item: LandingContent["experience"]["roles"][number];
    theme: Theme;
  }) => {
    const logoAlt = item.companyLogoAlt ?? item.company ?? "Company logo";
    const showCompanyLogo = Boolean(item.companyLogo);
    const logoContainerStyle =
      theme === "dark"
        ? "border-neutral-800 bg-neutral-900"
        : "border-neutral-200 bg-white";

    return (
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          theme === "dark"
            ? "border-neutral-900 bg-[#242424]"
            : "border-neutral-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {showCompanyLogo && (
              <div
                className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border p-2 ${
                  logoContainerStyle
                }`}
              >
                <Image
                  src={item.companyLogo!}
                  alt={logoAlt}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div className="space-y-1">
              <p
                className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
              >
                {item.role}
              </p>
              {item.company && (
                <p
                  className={`text-sm font-medium ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
                >
                  {item.company}
                </p>
              )}
            </div>
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              theme === "dark"
                ? "bg-neutral-900 text-neutral-300"
                : "bg-teal-50 text-teal-700"
            }`}
          >
            <Briefcase size={18} strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <span
            className={`flex items-center gap-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
          >
            <Clock3 size={14} />
            {item.period}
          </span>
          <span
            className={`flex items-center gap-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
          >
            <MapPin size={14} />
            {item.location}
          </span>
        </div>

        {item.tech && item.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tech.map((tech) => (
              <TechIcon key={tech} label={tech} theme={theme} />
            ))}
          </div>
        )}

        <p
          className={`mt-4 text-sm leading-relaxed ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
        >
          {item.summary}
        </p>

        <ul className="mt-4 space-y-2">
          {item.bullets.map((point) => (
            <li
              key={point}
              className={`flex gap-3 text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-700"}`}
            >
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

ExperienceCard.displayName = "ExperienceCard";

/** Hero section: contact strip, headline, subheadline, and primary CTAs */
const LandingHero = React.memo(function LandingHero({
  content,
  lang,
  theme,
  chatWidget,
}: {
  content: LandingContent;
  lang: Language;
  theme: Theme;
  chatWidget: React.ReactNode;
}) {
  const t = content;
  return (
    <section
      id="home"
      className="relative flex min-h-[80vh] flex-col justify-center pt-40 pb-32"
    >
      <div className="absolute top-20 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-teal-500/10 opacity-50 blur-[120px]" />
      <ContactShowcase contact={t.contact} theme={theme} lang={lang} />
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={codeReveal}
        className={`mb-8 text-5xl leading-[1.1] font-bold text-balance md:text-7xl ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
      >
        {t.hero.headline}
      </motion.h1>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={fadeInUp}
      >
        <RichText
          text={t.hero.subheadline}
          className={`mb-12 max-w-2xl text-lg text-pretty ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
          linkClassName={
            theme === "dark"
              ? "text-teal-400 underline underline-offset-4 hover:text-white"
              : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
          }
        />
      </motion.div>
      <motion.div
        className="flex flex-wrap items-center gap-6"
        initial="hidden"
        animate="visible"
        variants={developerStagger}
      >
        <motion.a
          href="#projects"
          className={`flex items-center gap-2 rounded-full px-8 py-4 font-semibold ${theme === "dark" ? "bg-white text-black" : "bg-neutral-900 text-white"}`}
          variants={developerStaggerItem}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {t.hero.cta}
        </motion.a>
        <motion.a
          href={`mailto:${t.contact.email}`}
          className={`border-b-2 px-8 py-4 font-medium ${theme === "dark" ? "border-neutral-800 text-neutral-400 hover:border-white hover:text-white" : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black"}`}
          variants={developerStaggerItem}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {t.hero.contact}
        </motion.a>
      </motion.div>
      {chatWidget}
    </section>
  );
});

/** Projects section: title, grid of project cards, and view more/less toggle */
const ProjectsSection = React.memo(function ProjectsSection({
  title,
  subtitle,
  eyebrow,
  projects,
  theme,
  showAll,
  onToggleShowAll,
  viewMoreLabel,
  viewLessLabel,
  canToggle,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  projects: ProjectItem[];
  theme: Theme;
  showAll: boolean;
  onToggleShowAll: () => void;
  viewMoreLabel: string;
  viewLessLabel: string;
  canToggle: boolean;
}) {
  return (
    <section
      id="projects"
      className={`border-t py-24 ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
    >
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && (
            <p className="text-sm tracking-[0.3em] text-teal-400 uppercase">
              {eyebrow}
            </p>
          )}
          <h2
            className={`text-3xl font-bold ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`mt-3 max-w-2xl text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <motion.div
        key={`projects-grid-${showAll ? "expanded" : "collapsed"}`}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={developerStagger}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            variants={downwardStaggerItem}
            className="h-full"
          >
            <ProjectCardBrutal project={project} theme={theme} index={index} />
          </motion.div>
        ))}
      </motion.div>
      {canToggle && (
        <div className="mt-8 text-left">
          <button
            type="button"
            onClick={onToggleShowAll}
            aria-expanded={showAll}
            className={`inline-flex items-center text-sm font-medium transition-colors ${theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"}`}
          >
            {showAll ? viewLessLabel : viewMoreLabel} &rarr;
          </button>
        </div>
      )}
    </section>
  );
});

/** Blog preview section: eyebrow, title, description, post cards, and view-all link */
const BlogPreviewSection = React.memo(function BlogPreviewSection({
  eyebrow,
  title,
  description,
  readMore,
  empty,
  viewAll,
  posts,
  lang,
  theme,
  substackHref,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  readMore: string;
  empty: string;
  viewAll: string;
  posts: BlogEntry[];
  lang: Language;
  theme: Theme;
  substackHref?: string;
}) {
  return (
    <section
      id="blog"
      className={`border-t py-24 ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
    >
      <div className="max-w-4xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            {eyebrow && (
              <p className="text-sm tracking-[0.3em] text-teal-400 uppercase">
                {eyebrow}
              </p>
            )}
            <h2
              className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
            >
              {title}
            </h2>
            {description && (
              <p
                className={`mt-3 max-w-2xl text-sm ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
              >
                {description}
              </p>
            )}
          </div>
          {substackHref && (
            <a
              href={substackHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${theme === "dark" ? "border-white/10 text-white hover:border-white/40" : "border-neutral-300 text-neutral-800 hover:border-neutral-500"}`}
              title="View on Substack"
            >
              <Rss size={16} />
              Substack
            </a>
          )}
        </div>
        <ScrollReveal
          animation="animate-fade-in-up"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.length ? (
            posts.map((post, idx) => (
              <div
                key={post.id}
                className={`animate-fade-in-up animate-delay-${idx * 100}`}
              >
                <BlogRow
                  post={post}
                  lang={lang}
                  theme={theme}
                  readMoreLabel={readMore}
                />
              </div>
            ))
          ) : (
            <p
              className={`text-sm ${theme === "dark" ? "text-neutral-600" : "text-neutral-500"}`}
            >
              {empty}
            </p>
          )}
        </ScrollReveal>
        {substackHref && (
          <a
            href={substackHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-10 inline-block text-sm font-medium transition-colors ${theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"}`}
          >
            {viewAll} &rarr;
          </a>
        )}
      </div>
    </section>
  );
});

interface PortfolioLandingProps {
  initialLang?: Language;
  /**
   * Optional pre-loaded content for the initial language.
   * IMPORTANT: If provided, this content MUST match the language specified in initialLang.
   * Providing mismatched content (e.g., Spanish content with initialLang="en") will cause
   * incorrect content to display until the client refetches the correct content.
   *
   * This prop is typically used for server-side rendering to improve initial page load performance.
   */
  initialContent?: LandingContent;
  /**
   * Pre-fetched English content (eliminates client-side fetch delay on language switch)
   */
  enContent?: LandingContent;
  /**
   * Pre-fetched Spanish content (eliminates client-side fetch delay on language switch)
   */
  esContent?: LandingContent;
  /**
   * Pre-fetched Substack blog posts to display in the blog section.
   * These replace any hardcoded blog posts in the content.
   */
  substackPosts?: BlogEntry[];
}

const fallbackThemeSettings = {
  bodyFont: '"Inter", system-ui, -apple-system, sans-serif',
  headingFont: '"JetBrains Mono", ui-monospace, monospace',
  monoFont: '"IBM Plex Mono", "SFMono-Regular", ui-monospace, monospace',
};

export function PortfolioLanding({
  initialLang = "es",
  initialContent,
  enContent,
  esContent,
  substackPosts,
}: PortfolioLandingProps) {
  const lang = initialLang;
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { theme: currentTheme } = useTheme();
  const theme = ((mounted ? currentTheme : "light") as Theme) || "light";

  // Use server-preloaded content to avoid client waterfalls on language switch.
  const contentMap = useMemo<Record<Language, LandingContent>>(() => {
    const map: Record<Language, LandingContent> = { ...defaultContent };
    if (enContent) map.en = enContent;
    if (esContent) map.es = esContent;
    if (initialContent) map[initialLang] = initialContent;
    return map;
  }, [enContent, esContent, initialContent, initialLang]);

  const [showAllProjects, setShowAllProjects] = useState(false);

  const t = contentMap[lang];
  const stackSections = t.stack.sections ?? [];
  const blogPostsToRender =
    substackPosts ?? (t.blogPosts ?? []).slice(0, BLOG_PREVIEW_COUNT);
  const previewProjects = (t.projectItems ?? []).slice(
    0,
    PROJECT_PREVIEW_COUNT,
  );
  const projectsToRender = showAllProjects
    ? (t.projectItems ?? [])
    : previewProjects;
  const canToggleProjects =
    (t.projectItems ?? []).length > previewProjects.length;
  const viewMoreProjectsLabel =
    t.projects.viewMore ??
    (lang === "en" ? "View more projects" : "Ver más proyectos");
  const viewLessProjectsLabel =
    t.projects.viewLess ??
    (lang === "en" ? "View fewer projects" : "Ver menos proyectos");

  // Generate dynamic system prompt for chatbot based on current content

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const nextTheme = {
      bodyFont: t.theme?.bodyFont ?? fallbackThemeSettings.bodyFont,
      headingFont: t.theme?.headingFont ?? fallbackThemeSettings.headingFont,
      monoFont: t.theme?.monoFont ?? fallbackThemeSettings.monoFont,
    };
    root.style.setProperty("--font-body", nextTheme.bodyFont);
    root.style.setProperty("--font-heading", nextTheme.headingFont);
    root.style.setProperty("--font-mono", nextTheme.monoFont);
  }, [t.theme]);

  // Client-side fetch removed - both languages now pre-loaded from server!
  // This eliminates the 1-3s delay on language switching.

  const getThemeClasses = () => {
    switch (theme) {
      case "brutal":
        return "bg-white text-black selection:bg-[#ffdd00] selection:text-black";
      case "light":
        return "bg-gray-50 text-neutral-800 selection:bg-teal-100 selection:text-teal-900";
      default:
        return "bg-[#1a1a1a] text-neutral-200 selection:bg-teal-900/30 selection:text-teal-50";
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={`min-h-dvh font-sans transition-colors duration-300 ${getThemeClasses()}`}
      suppressHydrationWarning
    >
      {theme !== "brutal" && (
        <div
          className="z-base pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${theme === "dark" ? "#ffffff" : "#000000"} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      )}

      <Header t={t} lang={lang} theme={theme} />

      <main
        id="main-content"
        className="z-content relative mx-auto max-w-5xl px-6"
      >
        <LandingHero
          content={t}
          lang={lang}
          theme={theme}
          chatWidget={<ClairoChat lang={lang} theme={theme} />}
        />

        <section
          id="about"
          className={`border-t py-24 ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <ScrollReveal
              animation="animate-fade-in-up"
              className="flex flex-col gap-6"
            >
              <div
                className={`self-center rounded-full p-[3px] shadow-xl md:self-start ${
                  theme === "dark"
                    ? "bg-gradient-to-tr from-teal-600 via-purple-600 to-blue-500"
                    : "bg-gradient-to-tr from-teal-400 via-fuchsia-400 to-blue-400"
                }`}
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full bg-neutral-900 md:h-40 md:w-40">
                  <Image
                    src="/profile.webp"
                    alt="Portrait of Iván Caamaño"
                    width={160}
                    height={160}
                    priority
                    className="h-full w-full object-cover"
                    sizes="(min-width: 768px) 10rem, 8rem"
                  />
                </div>
              </div>
              <div>
                <h2
                  className={`mb-6 text-3xl font-bold ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}
                >
                  {t.about.title}
                </h2>
                <div
                  className={`space-y-2 text-sm ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
                >
                  <p
                    className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
                  >
                    {t.about.educationTitle}
                  </p>
                  <p>{t.about.education1}</p>
                  <p>{t.about.education2}</p>
                </div>
                {t.about.interestsTitle &&
                  t.about.interests &&
                  t.about.interests.length > 0 && (
                    <div
                      className={`mt-6 space-y-2 text-sm ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
                    >
                      <p
                        className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
                      >
                        {t.about.interestsTitle}
                      </p>
                      <p>{t.about.interests.join(", ")}</p>
                    </div>
                  )}
                {t.about.languagesTitle &&
                  t.about.languages &&
                  t.about.languages.length > 0 && (
                    <div
                      className={`mt-6 space-y-2 text-sm ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
                    >
                      <p
                        className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
                      >
                        {t.about.languagesTitle}
                      </p>
                      <p>{t.about.languages.join(", ")}</p>
                    </div>
                  )}
                {t.about.favoriteAlbumTitle && t.about.favoriteAlbum && (
                  <div
                    className={`mt-6 space-y-2 text-sm ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
                  >
                    <p
                      className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
                    >
                      {t.about.favoriteAlbumTitle}
                    </p>
                    <div className="mt-3">
                      <iframe
                        loading="lazy"
                        src={`https://open.spotify.com/embed/album/${t.about.favoriteAlbum.spotifyId}`}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allowTransparency={true}
                        allow="encrypted-media"
                        className="rounded-lg"
                        title={`${t.about.favoriteAlbum.name} by ${t.about.favoriteAlbum.artist}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
            <ScrollReveal animation="animate-fade-in-up" delay={100}>
              <RichText
                text={t.about.summary}
                className={`mb-8 text-xl ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
                linkClassName={
                  theme === "dark"
                    ? "text-teal-400 underline underline-offset-4 hover:text-white"
                    : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
                }
              />
            </ScrollReveal>
          </div>
        </section>

        <section
          id="experience"
          className={`border-t py-24 ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm tracking-[0.3em] text-teal-400 uppercase">
                {lang === "es" ? "Experiencia" : "Experience"}
              </p>
              <h2
                className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
              >
                {t.experience.title}
              </h2>
              <p
                className={`mt-3 max-w-3xl text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {t.experience.subtitle}
              </p>
            </div>
            {t.experience.cta && (
              <a
                href="/CV.pdf"
                download
                className={`flex items-center justify-center rounded-full px-8 py-3 font-semibold transition-colors ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                <Download size={16} className="mr-2" />
                {t.experience.cta}
              </a>
            )}
          </div>

          {t.experience.stats && t.experience.stats.length > 0 && (
            <div
              className={`mb-10 flex flex-wrap items-center gap-3 text-sm md:gap-4 ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              {t.experience.stats.map((stat, index) => {
                // Extract number from the beginning of the label (e.g., "2+" or "4000+")
                const match = stat.label.match(/^(\d+\+?)\s*(.+)$/);
                const number = match ? match[1] : null;
                const rest = match ? match[2] : stat.label;

                return (
                  <React.Fragment key={index}>
                    <span>
                      {number && (
                        <span
                          className={`font-bold ${
                            theme === "dark" ? "text-teal-400" : "text-teal-600"
                          }`}
                        >
                          {number}{" "}
                        </span>
                      )}
                      {rest}
                    </span>
                    {index < t.experience.stats!.length - 1 && (
                      <span
                        className={`text-neutral-500 ${theme === "dark" ? "text-neutral-600" : "text-neutral-400"}`}
                      >
                        •
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {stackSections.length > 0 && (
            <>
              {t.stack.title && (
                <p
                  className={`mt-6 text-xs tracking-[0.3em] uppercase ${theme === "dark" ? "text-neutral-500" : "text-neutral-500"}`}
                >
                  {t.stack.title}
                </p>
              )}
              <motion.div
                className="mt-8 grid gap-6 md:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={scrollViewport}
                variants={developerStagger}
              >
                {stackSections.map((section) => {
                  const Icon = stackIconMap[section.icon] ?? Code2;
                  return (
                    <motion.div
                      key={section.title}
                      className={`rounded-2xl border p-5 ${
                        theme === "dark"
                          ? "border-neutral-900 bg-[#242424]"
                          : "border-neutral-200 bg-white"
                      }`}
                      variants={developerStaggerItem}
                      whileHover={{
                        y: -4,
                        boxShadow: "0 10px 25px rgba(0, 229, 255, 0.1)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            theme === "dark"
                              ? "bg-neutral-900 text-neutral-100"
                              : "bg-teal-50 text-teal-700"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}
                          >
                            {section.title}
                          </p>
                          {section.description && (
                            <p
                              className={`text-xs ${theme === "dark" ? "text-neutral-500" : "text-neutral-500"}`}
                            >
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.items.map((item) => (
                          <TechIcon key={item} label={item} theme={theme} />
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}

          {t.experience.rolesLabel && (
            <p
              className={`mt-10 mb-6 text-xs tracking-[0.3em] uppercase ${
                theme === "dark" ? "text-neutral-500" : "text-neutral-500"
              }`}
            >
              {t.experience.rolesLabel}
            </p>
          )}

          <motion.div
            className="mt-6 grid gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            variants={developerStagger}
          >
            {t.experience.roles.map((role) => (
              <motion.div
                key={`${role.role}-${role.period}`}
                variants={developerStaggerItem}
                whileHover={{
                  x: 4,
                  boxShadow: "0 10px 30px rgba(0, 229, 255, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <ExperienceCard item={role} theme={theme} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        <ProjectsSection
          title={t.projects.title}
          subtitle={t.projects.subtitle}
          eyebrow={t.projects.eyebrow}
          projects={projectsToRender}
          theme={theme}
          showAll={showAllProjects}
          onToggleShowAll={() => setShowAllProjects((prev) => !prev)}
          viewMoreLabel={viewMoreProjectsLabel}
          viewLessLabel={viewLessProjectsLabel}
          canToggle={canToggleProjects}
        />

        <motion.section
          id="activity"
          className={`border-t py-24 ${
            theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"
          }`}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={fadeInLeft}
        >
          <motion.div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm tracking-[0.3em] text-teal-400 uppercase">
                {t.activity.eyebrow}
              </p>
              <h2
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-neutral-900"
                }`}
              >
                {t.activity.title}
              </h2>
              <p
                className={`mt-3 max-w-2xl text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {t.activity.description}
              </p>
            </div>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                theme === "dark"
                  ? "border-white/10 text-white hover:border-white/40"
                  : "border-neutral-300 text-neutral-800 hover:border-neutral-500"
              }`}
            >
              <Github size={16} />
              {t.activity.profileLabel}
            </a>
          </motion.div>

          <motion.div
            className="mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            variants={fadeInUp}
          >
            <GithubContributions
              username={githubUsername}
              theme={theme}
              copy={{
                heatmapLabel: t.activity.heatmapLabel,
                commitsLabel: t.activity.commitsLabel,
                loadingText: t.activity.loadingText,
                errorText: t.activity.errorText,
                tooltipSuffix: t.activity.tooltipSuffix,
              }}
            />
          </motion.div>
        </motion.section>

        <BlogPreviewSection
          eyebrow={t.blog.eyebrow}
          title={t.blog.title}
          description={t.blog.description}
          readMore={t.blog.readMore}
          empty={t.blog.empty}
          viewAll={t.blog.viewAll}
          posts={blogPostsToRender}
          lang={lang}
          theme={theme}
          substackHref={
            substackPosts && substackPosts.length > 0
              ? (() => {
                  try {
                    return new URL(substackPosts[0]?.url ?? "").origin;
                  } catch {
                    return undefined;
                  }
                })()
              : undefined
          }
        />

        <section
          id="contact"
          className={`border-t py-24 ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="max-w-3xl">
            <h2
              className={`mb-6 text-2xl font-bold ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}
            >
              {t.contact.title}
            </h2>
            <RichText
              text={t.contact.text}
              className={`mb-8 max-w-2xl ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}
              linkClassName={
                theme === "dark"
                  ? "text-teal-400 underline underline-offset-4 hover:text-white"
                  : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
              }
            />
            <a
              href={`mailto:${t.contact.email}`}
              className={`border-b-2 pb-1 text-xl font-medium transition-colors md:text-2xl ${
                theme === "dark"
                  ? "border-neutral-800 text-white hover:border-teal-400 hover:text-teal-400"
                  : "border-neutral-200 text-neutral-900 hover:border-teal-600 hover:text-teal-600"
              }`}
            >
              {t.contact.email}
            </a>
            <motion.div
              className="mt-12 flex flex-wrap gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              variants={developerStagger}
            >
              {t.contact.socials.map((social) => {
                const Icon = socialIconMap[social.platform] ?? Github;
                return (
                  <motion.div
                    key={social.url}
                    className="group relative overflow-visible"
                    variants={developerStaggerItem}
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                        theme === "dark"
                          ? "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                      }`}
                    >
                      <Icon size={20} />
                    </a>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </main>

      <footer
        className={`mt-12 border-t py-12 text-center ${
          theme === "dark" ? "border-neutral-900" : "border-neutral-200"
        }`}
      >
        <p className="font-mono text-sm text-neutral-500">
          {t.footer.copyright}
        </p>
      </footer>
    </motion.div>
  );
}
