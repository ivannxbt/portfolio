import { ProjectCard } from "@/components/project-card";
import { RichText } from "@/components/rich-text";
import { getProjects } from "@/lib/mdx";
import { getTranslations, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ProjectsPage({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);
  const projects = getProjects(lang);

  return (
    <section className="py-24 border-t border-neutral-200 bg-[#f8fafc] text-[#0f172a]">
      <div className="mx-auto max-w-6xl space-y-10 px-5 sm:px-6 lg:px-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-teal-400">
            <span>{t.nav.projects}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-teal-400/50 to-transparent" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              {t.projects.title}
            </h1>
            {t.projects.description && (
              <RichText
                text={t.projects.description}
                className="text-lg text-slate-700 max-w-3xl"
                linkClassName="text-teal-600 underline underline-offset-4 hover:text-teal-800"
              />
            )}
          </div>
        </header>

        {projects.length === 0 ? (
          <p className="text-center text-neutral-500">{t.projects.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  );
}
