"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeSelector } from "@/components/theme-selector";
import type { Theme, Language } from "@/lib/types";
import type { LandingContent } from "@/content/site-content";

function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getScrollSnapshot() {
  return window.scrollY > 50;
}

interface HeaderProps {
  t: LandingContent;
  lang: Language;
  theme: Theme;
}

export function Header({ t, lang, theme }: HeaderProps) {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    () => false,
  );
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? `${
                theme === "brutal"
                  ? "border-b-3 border-black bg-white"
                  : theme === "dark"
                    ? "border-neutral-900 bg-[#1a1a1a]/80"
                    : "border-gray-200 bg-white/80"
              } border-b py-3 backdrop-blur-md`
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <div
            className={`flex items-center gap-2 text-lg font-bold tracking-tight ${
              theme === "brutal"
                ? "font-black text-black"
                : theme === "dark"
                  ? "text-neutral-100"
                  : "text-neutral-900"
            }`}
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <Image
                src={t.branding.favicon || "/icons/ivan-orb.svg"}
                alt={t.branding.logoText || "Portfolio logo"}
                width={32}
                height={32}
                className="h-full w-full object-cover"
                sizes="32px"
              />
            </div>
            <span>{t.branding.logoText || "Portfolio"}</span>
          </div>

          <nav
            className={`hidden items-center gap-8 text-sm font-medium md:flex ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {Object.entries(t.nav).map(([key, value]) => (
              <a
                key={key}
                href={`#${key}`}
                className="capitalize transition-colors hover:text-teal-500"
              >
                {value}
              </a>
            ))}

            <div className="ml-4 flex items-center gap-3 border-l border-neutral-800/50 pl-4">
              <ThemeSelector />

              <Link
                href={lang === "en" ? "/es" : "/en"}
                className={`rounded border px-2 py-1 font-mono text-xs transition-all ${
                  theme === "dark"
                    ? "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white"
                    : theme === "brutal"
                      ? "border-black text-black hover:bg-[#ffdd00]"
                      : "border-gray-200 text-neutral-500 hover:border-gray-300 hover:text-black"
                }`}
              >
                {lang === "en" ? "ES" : "EN"}
              </Link>
            </div>
          </nav>

          <button
            className={`md:hidden ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
            onClick={() => setMobileMenu((prev) => !prev)}
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileMenu && (
        <div
          className={`fixed inset-0 z-40 px-6 pt-24 md:hidden ${
            theme === "brutal"
              ? "bg-white"
              : theme === "dark"
                ? "bg-[#1a1a1a]"
                : "bg-white"
          }`}
        >
          <nav
            className={`flex flex-col gap-6 text-xl font-medium ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {Object.entries(t.nav).map(([key, value]) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setMobileMenu(false)}
                className="hover:text-teal-500"
              >
                {value}
              </a>
            ))}
            <div className="mt-4 flex items-center gap-4">
              <Link
                href={lang === "en" ? "/es" : "/en"}
                className="text-base text-teal-500"
              >
                {lang === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
              </Link>
              <ThemeSelector />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
