"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Zap } from "lucide-react";
import type { Theme } from "@/lib/types";

const themeConfig: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  brutal: { icon: Zap, label: "Brutal" },
};

const themeOrder: Theme[] = ["light", "dark", "brutal"];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700"
        aria-label="Theme selector loading"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  const currentTheme = (theme as Theme) || "dark";
  const CurrentIcon = themeConfig[currentTheme].icon;

  const cycleTheme = () => {
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const buttonClasses =
    currentTheme === "brutal"
      ? "p-2 bg-white border-3 border-black hover:bg-[#ffdd00] transition-colors"
      : "p-2 rounded-lg bg-neutral-800/50 border border-neutral-700 hover:bg-neutral-700/50 transition-colors";

  const iconClasses =
    currentTheme === "brutal" ? "w-5 h-5 text-black" : "w-5 h-5 text-neutral-300";

  return (
    <button
      onClick={cycleTheme}
      className={buttonClasses}
      aria-label={`Current theme: ${themeConfig[currentTheme].label}. Click to change.`}
      title={`Theme: ${themeConfig[currentTheme].label}`}
    >
      <CurrentIcon className={iconClasses} />
    </button>
  );
}
