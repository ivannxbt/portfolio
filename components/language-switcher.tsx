"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type Locale, locales } from "@/lib/i18n";

interface LanguageSwitcherProps {
  currentLang: Locale;
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Get the path without the locale prefix
  const pathWithoutLocale = pathname.replace(/^\/(en|es)/, "") || "/";

  // Get the other language
  const otherLang = locales.find((l) => l !== currentLang) || "en";

  return (
    <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
      <Link href={`/${otherLang}${pathWithoutLocale}`}>
        <Globe className="h-4 w-4 mr-1" />
        {otherLang.toUpperCase()}
      </Link>
    </Button>
  );
}
