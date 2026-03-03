import { describe, it, expect } from "vitest";
import { generateSystemPrompt, generateFallbackPrompt } from "./chat-context";
import type { LandingContent } from "@/content/site-content";

/** Minimal content shape used by generateSystemPrompt */
const minimalContent: LandingContent = {
  branding: {
    title: "Brand",
    description: "Brand description",
    favicon: "/icon.svg",
    logoText: "Brand",
  },
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    blog: "Blog",
    contact: "Contact",
  },
  hero: {
    role: "Engineer",
    greeting: "Test",
    headline: "Test Headline",
    subheadline: "Test subheadline",
    cta: "CTA",
    contact: "Contact",
  },
  about: {
    title: "About",
    summary: "Summary text",
    educationTitle: "Education",
    education1: "E1",
    education2: "E2",
    interestsTitle: "",
    interests: [],
    languagesTitle: "",
    languages: [],
    favoriteAlbumTitle: "",
  },
  experience: {
    title: "Experience",
    subtitle: "Subtitle",
    rolesLabel: "Roles",
    roles: [
      {
        role: "Engineer",
        company: "Acme",
        period: "2020–2022",
        location: "Remote",
        summary: "Did things",
        bullets: ["Bullet"],
      },
    ],
    cta: "",
    stats: [],
  },
  stack: {
    title: "Stack",
    sections: [
      {
        title: "Backend",
        description: "",
        icon: "code",
        items: ["Python", "Node"],
      },
    ],
  },
  projectItems: [
    { id: 1, icon: "cloud", title: "Project A", desc: "Description", tags: [] },
  ],
  blogPosts: [
    { id: 1, date: "2024", title: "Post", summary: "Summary", url: "" },
  ],
  contact: {
    title: "Contact",
    text: "Get in touch",
    email: "test@example.com",
    socials: [],
  },
  projects: {
    title: "Projects",
    subtitle: "",
    eyebrow: "",
    viewAll: "View all",
    description: "",
    viewMore: "",
    viewLess: "",
  },
  activity: {
    eyebrow: "",
    title: "Activity",
    description: "",
    profileLabel: "",
    heatmapLabel: "",
    commitsLabel: "",
    loadingText: "",
    errorText: "",
    tooltipSuffix: "",
  },
  blog: {
    eyebrow: "",
    title: "Blog",
    description: "",
    viewMore: "",
    viewLess: "",
    readMore: "",
    empty: "",
    viewAll: "",
  },
  footer: { copyright: "" },
};

describe("chat-context", () => {
  describe("generateSystemPrompt", () => {
    it("returns a non-empty string", () => {
      const prompt = generateSystemPrompt(minimalContent, "en");
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(0);
    });

    it("includes hero headline and greeting", () => {
      const prompt = generateSystemPrompt(minimalContent, "en");
      expect(prompt).toContain("Test Headline");
      expect(prompt).toContain("Test");
    });

    it("includes language instruction for English", () => {
      const prompt = generateSystemPrompt(minimalContent, "en");
      expect(prompt).toContain("Always respond in English");
    });

    it("includes language instruction for Spanish", () => {
      const prompt = generateSystemPrompt(minimalContent, "es");
      expect(prompt).toContain("Siempre responde en español");
    });

    it("includes experience and project details when present", () => {
      const prompt = generateSystemPrompt(minimalContent, "en");
      expect(prompt).toContain("Engineer");
      expect(prompt).toContain("Acme");
      expect(prompt).toContain("Project A");
      expect(prompt).toContain("Python");
    });

    it("includes Clairo and portfolio context", () => {
      const prompt = generateSystemPrompt(minimalContent, "en");
      expect(prompt).toContain("Clairo");
      expect(prompt).toContain("portfolio");
    });
  });

  describe("generateFallbackPrompt", () => {
    it("returns non-empty string for en", () => {
      const prompt = generateFallbackPrompt("en");
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(0);
      expect(prompt).toContain("English");
    });

    it("returns non-empty string for es", () => {
      const prompt = generateFallbackPrompt("es");
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(0);
      expect(prompt).toContain("español");
    });
  });
});
