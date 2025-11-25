import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations, type Locale } from "@/lib/i18n";
import { getAllContent } from "@/lib/mdx";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);
  const projects = getAllContent("projects", lang);

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">{t.projects.title}</h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          {t.projects.description}
        </p>

        {projects.length === 0 ? (
          <p className="text-zinc-500">
            {lang === "es" ? "No hay proyectos disponibles." : "No projects available."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.frontmatter.slug}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-white">
                    {project.frontmatter.title}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {project.frontmatter.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {project.frontmatter.tags && (
                    <div className="flex flex-wrap gap-2">
                      {project.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="gap-2">
                  {project.frontmatter.demo && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={project.frontmatter.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-1 h-3 w-3" />
                        {t.projects.viewProject}
                      </Link>
                    </Button>
                  )}
                  {project.frontmatter.github && (
                    <Button asChild variant="ghost" size="sm">
                      <Link
                        href={project.frontmatter.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-1 h-3 w-3" />
                        {t.projects.viewCode}
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
