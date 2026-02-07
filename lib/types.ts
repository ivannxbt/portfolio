import type { Locale } from "@/lib/i18n";

export type Language = Locale;
export type Theme = "light" | "dark" | "brutal";
export const THEMES = ["light", "dark", "brutal"] as const;

export type Message = {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
};

export type FallbackProfile = {
  intro: string;
  skills: string;
  experience: string;
  education: string;
  location: string;
  contact: string;
  availability: string;
  defaultMessage: string;
};
