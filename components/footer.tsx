import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

import { getTranslations, type Locale } from "@/lib/i18n";

interface FooterProps {
  lang: Locale;
}

const socialLinks = {
  github: "https://github.com/ivancaamano",
  linkedin: "https://www.linkedin.com/in/ivancaamano",
  twitter: "https://twitter.com/ivannxbt",
  email: "mailto:ivanncaamano@gmail.com",
};

export function Footer({ lang }: FooterProps) {
  const t = getTranslations(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            {t.footer.tagline}
          </p>
          <p className="mt-2 text-zinc-400">
            © {currentYear} Iván Caamaño. {t.footer.rights}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={socialLinks.github}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href={socialLinks.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href={socialLinks.email}
            className="text-zinc-400 transition-colors hover:text-white"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
