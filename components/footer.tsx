import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

import { getTranslations, type Locale } from "@/lib/i18n";

interface FooterProps {
  lang: Locale;
}

export function Footer({ lang }: FooterProps) {
  const t = getTranslations(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-400">
            © {currentYear} Portfolio. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href={`/${lang}/contact`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
