import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n";

const contentDirectory = path.join(process.cwd(), "content");

type ContentType = "projects" | "blog";

interface BaseFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

export interface ProjectFrontmatter extends BaseFrontmatter {
  stack: string[];
  repo: string;
  demo: string;
  highlight: string;
}

export interface BlogFrontmatter extends BaseFrontmatter {
  image?: string;
}

export interface ProjectEntry {
  slug: string;
  lang: Locale;
  frontmatter: ProjectFrontmatter;
  content: string;
}

export interface BlogEntry {
  slug: string;
  lang: Locale;
  frontmatter: BlogFrontmatter;
  content: string;
}

export interface CompiledBlogPost {
  slug: string;
  lang: Locale;
  frontmatter: BlogFrontmatter;
  content: ReactNode;
}

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const resolvePath = (type: ContentType, slug: string, lang: Locale) =>
  path.join(contentDirectory, type, `${slug}.${lang}.mdx`);

const readDirectory = async (type: ContentType, lang: Locale) => {
  const dir = path.join(contentDirectory, type);

  try {
    await fs.access(dir);
  } catch {
    return [];
  }

  const files = await fs.readdir(dir);
  return files
    .filter((file) => file.endsWith(`.${lang}.mdx`))
    .map((file) => ({
      file,
      slug: file.replace(`.${lang}.mdx`, ""),
      fullPath: path.join(dir, file),
    }));
};

export async function getProjects(lang: Locale): Promise<ProjectEntry[]> {
  const directoryEntries = await readDirectory("projects", lang);

  const projects = await Promise.all(
    directoryEntries.map(async ({ slug, fullPath }) => {
      const rawFile = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(rawFile);

      const frontmatter: ProjectFrontmatter = {
        title: String(data.title ?? slug),
        date: String(data.date ?? new Date().toISOString()),
        summary: String(data.summary ?? ""),
        stack: toArray(data.stack),
        tags: toArray(data.tags),
        repo: String(data.repo ?? ""),
        demo: String(data.demo ?? ""),
        highlight: String(data.highlight ?? ""),
      };

      return {
        slug,
        lang,
        frontmatter,
        content,
      };
    })
  );

  return projects.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export async function getBlogPosts(lang: Locale): Promise<BlogEntry[]> {
  const directoryEntries = await readDirectory("blog", lang);

  const posts = await Promise.all(
    directoryEntries.map(async ({ slug, fullPath }) => {
      const rawFile = await fs.readFile(fullPath, "utf8");
      const { data, content } = matter(rawFile);

      const frontmatter: BlogFrontmatter = {
        title: String(data.title ?? slug),
        date: String(data.date ?? new Date().toISOString()),
        summary: String(data.summary ?? ""),
        tags: toArray(data.tags),
        image: data.image ? String(data.image) : undefined,
      };

      return {
        slug,
        lang,
        frontmatter,
        content,
      };
    })
  );

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export async function getCompiledBlogPost(
  slug: string,
  lang: Locale
): Promise<CompiledBlogPost | null> {
  const filePath = resolvePath("blog", slug, lang);

  try {
    await fs.access(filePath);
  } catch {
    return null;
  }

  const source = await fs.readFile(filePath, "utf8");
  const compiled = await compileMDX<BlogFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return {
    slug,
    lang,
    frontmatter: compiled.frontmatter,
    content: compiled.content,
  };
}

export async function getAllSlugs(type: ContentType): Promise<string[]> {
  const dir = path.join(contentDirectory, type);

  try {
    await fs.access(dir);
  } catch {
    return [];
  }

  const files = await fs.readdir(dir);
  const slugs = new Set<string>();

  files.forEach((file) => {
    const match = file.match(/^(.+)\.(en|es)\.mdx$/);
    if (match) {
      slugs.add(match[1]);
    }
  });

  return Array.from(slugs);
}
