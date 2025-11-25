import { getTranslations, type Locale } from "@/lib/i18n";

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "PostgreSQL",
  "MongoDB",
  "Git",
  "Docker",
  "AWS",
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">{t.about.title}</h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-2xl">
          {t.about.description}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {t.about.skills}
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">
            {t.about.experience}
          </h2>
          <div className="space-y-8">
            <div className="border-l-2 border-zinc-700 pl-6">
              <h3 className="text-xl font-medium text-white">
                Senior Full Stack Developer
              </h3>
              <p className="text-zinc-500 mb-2">
                Company Name • 2022 - Present
              </p>
              <p className="text-zinc-400">
                {lang === "es"
                  ? "Desarrollo de aplicaciones web escalables utilizando React, Next.js y Node.js. Liderazgo técnico y mentoría de desarrolladores junior."
                  : "Building scalable web applications using React, Next.js, and Node.js. Technical leadership and mentoring junior developers."}
              </p>
            </div>
            <div className="border-l-2 border-zinc-700 pl-6">
              <h3 className="text-xl font-medium text-white">
                Full Stack Developer
              </h3>
              <p className="text-zinc-500 mb-2">
                Another Company • 2020 - 2022
              </p>
              <p className="text-zinc-400">
                {lang === "es"
                  ? "Desarrollo de APIs RESTful y frontend con React. Implementación de CI/CD y prácticas de DevOps."
                  : "Developing RESTful APIs and React frontends. Implementing CI/CD pipelines and DevOps practices."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
