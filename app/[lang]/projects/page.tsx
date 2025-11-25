import { ProjectCard } from "@/components/project-card";
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
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {t.projects.title}
          </h1>
          <p className="text-lg text-zinc-400">{t.projects.description}</p>
        </header>

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
      </div>
    </div>
  );
}
