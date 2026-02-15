'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeSelector } from "@/components/theme-selector";
import type { Theme, Language } from "@/lib/types";
import type { LandingContent } from "@/content/site-content";

interface HeaderProps {
  t: LandingContent;
  lang: Language;
  theme: Theme;
}

export function Header({ t, lang, theme }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrolledRef = useRef(false);

  useEffect(() => {
    // Initialize state based on current scroll position
    const initialScrolled = window.scrollY > 50;
    setScrolled(initialScrolled);
    lastScrolledRef.current = initialScrolled;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newScrolled = window.scrollY > 50;
          // Only update state if the value actually changed
          if (newScrolled !== lastScrolledRef.current) {
            lastScrolledRef.current = newScrolled;
            setScrolled(newScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? `${theme === "brutal"
            ? "bg-white border-black border-b-3"
            : theme === "dark"
              ? "bg-[#1a1a1a]/80 border-neutral-900"
              : "bg-white/80 border-gray-200"
            } backdrop-blur-md border-b py-3`
          : "py-6 bg-transparent"
          }`}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div
            className={`font-bold text-lg tracking-tight flex items-center gap-2 ${theme === "brutal" ? "text-black font-black" : theme === "dark" ? "text-neutral-100" : "text-neutral-900"
              }`}
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <Image
                src={t.branding.favicon || "/icons/ivan-orb.svg"}
                alt={t.branding.logoText || "Portfolio logo"}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span>{t.branding.logoText || "Portfolio"}</span>
          </div>

          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}
          >
            {Object.entries(t.nav).map(([key, value]) => (
              <a key={key} href={`#${key}`} className="hover:text-teal-500 transition-colors capitalize">
                {value}
              </a>
            ))}

            <div className="flex items-center gap-3 ml-4 border-l pl-4 border-neutral-800/50">
              <ThemeSelector />

              <Link
                href={lang === "en" ? "/es" : "/en"}
                className={`px-2 py-1 text-xs font-mono border rounded transition-all ${theme === "dark"
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
          className={`fixed inset-0 z-40 pt-24 px-6 md:hidden ${theme === "brutal" ? "bg-white" : theme === "dark" ? "bg-[#1a1a1a]" : "bg-white"
            }`}
        >
          <nav
            className={`flex flex-col gap-6 text-xl font-medium ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"
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
            <div className="flex items-center gap-4 mt-4">
              <Link
                href={lang === "en" ? "/es" : "/en"}
                className="text-teal-500 text-base"
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
