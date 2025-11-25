import Link from "next/link";

import { HeroSection } from "@/components/hero-section";
import { ProjectCard } from "@/components/project-card";
import { BlogCard } from "@/components/blog-card";
import { getTranslations, type Locale } from "@/lib/i18n";
import { getProjects, getBlogPosts } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const projects = getProjects(lang).slice(0, 3);
  const posts = getBlogPosts(lang).slice(0, 2);

  return (
    <div className="space-y-16 px-4 py-10 sm:px-6 lg:px-8">
      <HeroSection lang={lang} copy={t.home.hero} actions={t.actions} />

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              {t.home.featuredProjects.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold text-white">
              {t.home.featuredProjects.title}
            </h2>
            <p className="mt-2 max-w-2xl text-zinc-400">
              {t.home.featuredProjects.description}
            </p>
          </div>
          <Link
            href={`/${lang}/projects`}
            className="text-sm font-medium text-teal-300"
          >
            {t.home.featuredProjects.viewAll}
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-zinc-500">{t.projects.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                locale={lang}
                highlightLabel={t.projects.highlightLabel}
                stackLabel={t.projects.stackLabel}
                viewProjectLabel={t.projects.viewProject}
                viewCodeLabel={t.projects.viewCode}
                index={index}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              {t.home.latestPosts.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold text-white">
              {t.home.latestPosts.title}
            </h2>
            <p className="mt-2 max-w-2xl text-zinc-400">
              {t.home.latestPosts.description}
            </p>
          </div>
          <Link
            href={`/${lang}/blog`}
            className="text-sm font-medium text-teal-300"
          >
            {t.home.latestPosts.viewAll}
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-zinc-500">{t.blog.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, index) => (
              <BlogCard
                key={post.slug}
                lang={lang}
                post={post}
                readMoreLabel={t.blog.readMore}
                publishedLabel={t.blog.published}
                index={index}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
