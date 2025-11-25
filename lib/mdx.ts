import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface MDXFrontmatter {
  title: string;
  description: string;
  date: string;
  slug: string;
  lang: string;
  image?: string;
  tags?: string[];
  github?: string;
  demo?: string;
}

export interface MDXContent {
  frontmatter: MDXFrontmatter;
  content: string;
}

export function getContentBySlug(
  type: "projects" | "blog",
  slug: string,
  lang: string
): MDXContent | null {
  try {
    const filePath = path.join(contentDirectory, type, `${slug}.${lang}.mdx`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      frontmatter: {
        ...data,
        slug,
        lang,
      } as MDXFrontmatter,
      content,
    };
  } catch {
    return null;
  }
}

export function getAllContent(
  type: "projects" | "blog",
  lang: string
): MDXContent[] {
  const contentPath = path.join(contentDirectory, type);

  if (!fs.existsSync(contentPath)) {
    return [];
  }

  const files = fs.readdirSync(contentPath);
  const langFiles = files.filter((file) => file.endsWith(`.${lang}.mdx`));

  const contents = langFiles
    .map((file) => {
      const slug = file.replace(`.${lang}.mdx`, "");
      return getContentBySlug(type, slug, lang);
    })
    .filter((content): content is MDXContent => content !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

  return contents;
}

export function getAllSlugs(type: "projects" | "blog"): string[] {
  const contentPath = path.join(contentDirectory, type);

  if (!fs.existsSync(contentPath)) {
    return [];
  }

  const files = fs.readdirSync(contentPath);
  const slugs = new Set<string>();

  files.forEach((file) => {
    const match = file.match(/^(.+)\.(en|es)\.mdx$/);
    if (match) {
      slugs.add(match[1]);
    }
  });

  return Array.from(slugs);
}
