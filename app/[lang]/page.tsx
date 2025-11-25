import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTranslations, type Locale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-zinc-400 text-lg mb-2">{t.home.greeting}</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          {t.home.name}
        </h1>
        <h2 className="text-xl sm:text-2xl text-zinc-400 mb-6">
          {t.home.title}
        </h2>
        <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
          {t.home.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <a href="/CV.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              {t.home.downloadCV}
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${lang}/projects`}>
              {t.home.viewProjects}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
