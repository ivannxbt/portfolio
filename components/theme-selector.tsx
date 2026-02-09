"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Zap } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { timing, ease } from "@/lib/animations";
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
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 transition-colors cursor-pointer"
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

  // Icon color based on current theme (no background, just icon color)
  const iconClasses =
    currentTheme === "brutal" ? "w-5 h-5 text-black" : "w-5 h-5 text-neutral-300";

  // Animation variants for each icon with unique rotation directions
  const iconVariants = {
    sun: {
      initial: { opacity: 0, rotate: -180 },
      animate: { opacity: 1, rotate: 0 },
      exit: { opacity: 0, rotate: 180 },
    },
    moon: {
      initial: { opacity: 0, rotate: 180 },
      animate: { opacity: 1, rotate: 0 },
      exit: { opacity: 0, rotate: -180 },
    },
    zap: {
      initial: { opacity: 0, rotate: -90 },
      animate: { opacity: 1, rotate: 0 },
      exit: { opacity: 0, rotate: 90 },
    },
  };

  // Transition configuration - instant for reduced motion, smooth otherwise
  const transition = prefersReducedMotion
    ? { duration: 0.01 }
    : { ...ease.inOut, duration: timing.normal };

  // Get current variant based on theme
  const currentVariant = iconVariants[currentTheme as keyof typeof iconVariants];

  return (
    <button
      onClick={cycleTheme}
      className="p-2 transition-colors cursor-pointer"
      aria-label={`Current theme: ${themeConfig[currentTheme].label}. Click to change.`}
      title={`Theme: ${themeConfig[currentTheme].label}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTheme}
          variants={currentVariant}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          <CurrentIcon className={iconClasses} />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
