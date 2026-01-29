import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTranslations, type Locale } from "@/lib/i18n";

const skillGroups = [
  {
    title: { en: "Programming languages", es: "Lenguajes de programación" },
    items: [
      "Python",
      "SQL",
      "JavaScript",
      "Java",
      "R",
      "Scala",
      "Golang",
      "Solidity",
      "Rust",
      "Swift",
    ],
  },
  {
    title: { en: "Frameworks & libraries", es: "Frameworks y librerías" },
    items: ["PyTorch", "TensorFlow", "Keras", "LangChain", "MLflow", "Pandas"],
  },
  {
    title: { en: "AI & data focus", es: "Enfoque AI/Data" },
    items: [
      "Deep Learning",
      "Computer Vision",
      "Prompt Engineering",
      "RAG",
      "Data Engineering",
      "MCP",
    ],
  },
  {
    title: { en: "Cloud & software", es: "Cloud y software" },
    items: [
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Git",
      "Linux",
      "Databricks",
    ],
  },
  {
    title: { en: "Soft skills", es: "Habilidades blandas" },
    items: [
      "Leadership",
      "Communication",
      "Teamwork",
      "Problem solving",
    ],
  },
];

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            {t.about.title}
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {t.about.intro}
          </h1>
          {t.about.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-lg leading-relaxed text-slate-300"
            >
              {paragraph}
            </p>
          ))}

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="/cv_iacc.pdf" download>
                <Download className="mr-2 h-4 w-4" />
                {t.about.downloadCV}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={`/${lang}/contact`}>
                {t.actions.contact}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-slate-500">{t.about.contactCTA}</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {t.about.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800/30 bg-slate-950/60 p-5"
            >
              <p className="text-3xl font-semibold text-white">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            {t.about.timelineTitle}
          </h2>
          <div className="space-y-6">
            {t.about.timeline.map((item) => (
              <div
                key={`${item.role}-${item.period}`}
                className="rounded-2xl border border-slate-800/30 bg-slate-950/60 p-5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.logo}
                      alt={item.company}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {item.role}
                      </p>
                      <p className="text-sm text-slate-400">{item.company}</p>
                    </div>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.period}
                  </p>
                </div>
                <p className="mt-3 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            {t.about.expertiseTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {t.about.expertise.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800/30 bg-slate-950/60 p-5"
              >
                <p className="text-lg font-semibold text-white">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            {t.about.skillsTitle}
          </h2>
          <div className="space-y-6">
            {skillGroups.map((group) => (
              <div key={group.title.en}>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  {lang === "es" ? group.title.es : group.title.en}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-800/40 px-4 py-2 text-sm text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {t.about.educationTitle}
              </h2>
              <div className="mt-4 space-y-4">
                {t.about.education.map((item) => (
                  <div
                    key={`${item.school}-${item.period}`}
                    className="rounded-2xl border border-slate-800/30 bg-slate-950/60 p-5"
                  >
                    <p className="text-lg font-semibold text-white">
                      {item.degree}
                    </p>
                    <p className="text-sm text-slate-400">{item.school}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {item.period}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {t.about.languagesTitle}
                </h2>
                <ul className="mt-3 space-y-2 text-slate-300">
                  {t.about.languages.map((language) => (
                    <li key={language.label} className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {language.label}
                      </span>
                      <span className="text-sm text-slate-500">
                        {language.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {t.about.interestsTitle}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.about.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-slate-800/40 px-3 py-1 text-sm text-slate-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
