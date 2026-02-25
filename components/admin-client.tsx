'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { API_ENDPOINTS } from "@/backend/contracts/endpoints";
import { buildApiUrl } from "@/lib/api-client";
import {
  defaultContent,
  type LandingContent,
  type ProjectItem,
  type ExperienceItem,
  type SocialLink,
  type BlogEntry,
  type ProjectIcon,
  type SocialPlatform,
  type StackSection,
  type StackIcon,
} from "@/content/site-content";
import {
  ChevronDown,
  ChevronUp,
  Save,
  LogOut,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image,
  Menu,
  Type,
  Sparkles,
  User,
  Briefcase,
  FolderKanban,
  FileText,
  Mail,
  Home
} from "lucide-react";

type LanguageOption = {
  value: "en" | "es";
  label: string;
};

const languages: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
];

const projectIconOptions: ProjectIcon[] = ["cloud", "database", "layers"];
const socialPlatformOptions: SocialPlatform[] = ["github", "linkedin", "twitter", "resume"];
const stackIconOptions: StackIcon[] = ["code", "layers", "brain"];

const fallbackTheme = defaultContent.en.theme ?? {
  bodyFont: "Space Grotesk, system-ui, sans-serif",
  headingFont: "Space Grotesk, system-ui, sans-serif",
  monoFont: "IBM Plex Mono, ui-monospace, monospace",
};

const cloneContent = (data: LandingContent): LandingContent =>
  JSON.parse(JSON.stringify(data)) as LandingContent;

const createBlogEntry = (): BlogEntry => ({
  id: Date.now(),
  title: "",
  date: new Date().getFullYear().toString(),
  summary: "",
  url: "",
  image: "/blog/default.svg",
});

const createProject = (): ProjectItem => ({
  id: Date.now(),
  icon: "cloud",
  title: "",
  desc: "",
  tags: [],
});

const createExperienceRole = (): ExperienceItem => ({
  role: "",
  company: "",
  period: "",
  location: "",
  summary: "",
  bullets: [""],
});

const createSocialLink = (): SocialLink => ({
  label: "",
  url: "",
  platform: "github",
});

const createStackSection = (): StackSection => ({
  title: "",
  description: "",
  icon: "code",
  items: [],
});

const parseStackItems = (input: string) => input.split(/\r?\n/).map((item) => item.trim());

const sanitizeStackSections = (sections: StackSection[]) =>
  sections.map((section) => ({
    ...section,
    items: section.items.map((item) => item.trim()).filter(Boolean),
  }));

const parseTagString = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

type MarkdownFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
  helperText?: string;
};

type LinkPromptState = {
  start: number;
  end: number;
  label: string;
};

const MarkdownField = ({
  label,
  value,
  onChange,
  rows = 3,
  disabled = false,
  helperText = "Select text then use the buttons to wrap it in Markdown.",
}: MarkdownFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [linkPrompt, setLinkPrompt] = useState<LinkPromptState | null>(null);
  const [linkUrl, setLinkUrl] = useState("https://");
  const linkInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (linkPrompt && linkInputRef.current) {
      linkInputRef.current.focus();
      linkInputRef.current.select();
    }
  }, [linkPrompt]);

  const wrapSelection = (before: string, after = before, placeholder = "") => {
    if (disabled) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const normalizedValue = value ?? "";
    const hasSelection = start !== end;
    const selectionText = hasSelection ? normalizedValue.slice(start, end) : placeholder;
    const nextValue =
      normalizedValue.slice(0, start) +
      before +
      selectionText +
      after +
      normalizedValue.slice(end);
    onChange(nextValue);
    window.requestAnimationFrame(() => {
      textarea.focus();
      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + selectionText.length;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const insertLink = () => {
    if (disabled) return;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const normalizedValue = value ?? "";
    const linkLabel = normalizedValue.slice(start, end) || "link text";
    setLinkUrl("https://");
    setLinkPrompt({ start, end, label: linkLabel });
  };

  const submitLink = () => {
    const prompt = linkPrompt;
    if (!prompt) return;
    const url = linkUrl.trim();
    if (!url) return;
    const normalizedValue = value ?? "";
    const markdown = `[${prompt.label}](${url})`;
    const nextValue =
      normalizedValue.slice(0, prompt.start) +
      markdown +
      normalizedValue.slice(prompt.end);
    onChange(nextValue);
    setLinkPrompt(null);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      const selectionStart = prompt.start + 1;
      const selectionEnd = selectionStart + prompt.label.length;
      textareaRef.current?.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const handleLinkCancel = () => {
    setLinkPrompt(null);
  };

  const handleLinkInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    submitLink();
  };

  const buttonClass =
    "rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <label className="block text-xs uppercase tracking-widest text-gray-600">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>{label}</span>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={buttonClass} onClick={() => wrapSelection("**", "**", "bold text")} disabled={disabled} aria-label="Bold">
            B
          </button>
          <button type="button" className={buttonClass} onClick={() => wrapSelection("*", "*", "italic text")} disabled={disabled} aria-label="Italic">
            I
          </button>
          <button type="button" className={buttonClass} onClick={insertLink} disabled={disabled} aria-label="Insert link">
            Link
          </button>
        </div>
      </div>
      <p className="mt-1 text-[10px] text-gray-500">{helperText}</p>
      {linkPrompt && (
        <div
          className="mt-2 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Insert link"
        >
          <input
            ref={linkInputRef}
            type="url"
            name="link-url"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 md:w-auto"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={handleLinkInputKeyDown}
            placeholder="https://example.com"
            required
          />
          <button
            type="button"
            className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            onClick={submitLink}
          >
            Insert
          </button>
          <button
            type="button"
            className="rounded-full border border-transparent bg-gray-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            onClick={handleLinkCancel}
          >
            Cancel
          </button>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        rows={rows}
        disabled={disabled}
      />
    </label>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CollapsibleSection = {
  id: string;
  isOpen: boolean;
};

type AdminClientProps = {
  initialContent: LandingContent;
};

export function AdminClient({ initialContent }: AdminClientProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [lang, setLang] = useState<"en" | "es">("en");
  const [content, setContent] = useState<LandingContent | null>(initialContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const dirtyRef = useRef(false);
  const isInitialMount = useRef(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    branding: true,
    navigation: false,
    theme: false,
    hero: true,
    about: false,
    experience: false,
    projects: false,
    blog: false,
    contact: false,
    footer: false,
  });
  const handleLangChange = (value: "en" | "es") => {
    setLang(value);
    dirtyRef.current = false;
    setIsDirty(false);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  useEffect(() => {
    if (!session) return;

    // Skip fetching on initial mount for English (we have initialContent)
    if (isInitialMount.current && lang === "en") {
      isInitialMount.current = false;
      return;
    }
    isInitialMount.current = false;

    const controller = new AbortController();
    const loadContent = async () => {
      if (dirtyRef.current) {
        return;
      }
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const response = await fetch(`${buildApiUrl(API_ENDPOINTS.content)}?lang=${lang}`, {
          signal: controller.signal,
          next: { revalidate: 60 }, // Cache for 1 minute
        });
        if (!response.ok) {
          throw new Error("Failed to load content.");
        }
        const payload = (await response.json()) as { data: LandingContent };
        const data = payload.data ?? defaultContent[lang];
        setContent(cloneContent(data));
        dirtyRef.current = false;
        setIsDirty(false);
      } catch (err) {
        if (controller.signal.aborted || (err as DOMException)?.name === "AbortError") {
          return;
        }
        console.error("Admin load error", err);
        setError("Unable to load content. Showing defaults.");
        setContent(cloneContent(defaultContent[lang]));
        dirtyRef.current = false;
        setIsDirty(false);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadContent();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, session?.user?.email]); // Use primitive dependency instead of session object

  const updateContent = (updater: (current: LandingContent) => LandingContent) => {
    setContent((prev) => {
      if (!prev) {
        return prev;
      }
      const next = updater(prev);
      if (!dirtyRef.current) {
        dirtyRef.current = true;
        setIsDirty(true);
      }
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content) return;

    const sanitizedContent: LandingContent = {
      ...content,
      stack: {
        ...content.stack,
        sections: sanitizeStackSections(content.stack.sections ?? []),
      },
    };
    setContent(cloneContent(sanitizedContent));

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.content), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, content: sanitizedContent }),
      });
      if (!response.ok) {
        throw new Error("Failed to save content.");
      }
      const payload = (await response.json()) as { data: LandingContent };
      if (payload.data) {
        setContent(cloneContent(payload.data));
      }
      setMessage("Content updated successfully.");
      dirtyRef.current = false;
      setIsDirty(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      console.error("Admin save error", err);
      setError("Saving failed. Please try again.");
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <p className="text-sm text-gray-600">Checking session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center max-w-md space-y-4 shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-900">Admin login required</h1>
          <p className="text-sm text-gray-600">
            Please sign in to manage the site content.
          </p>
          <button
            onClick={() => router.push("/admin/login")}
            className="w-full rounded-full bg-teal-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center">
        <p className="text-sm text-gray-600">Loading content...</p>
      </div>
    );
  }

  const themeSettings = content.theme ?? fallbackTheme;

  const CollapsibleFieldset = ({
    id,
    title,
    description,
    icon: Icon,
    children,
  }: {
    id: string;
    title: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }) => {
    const isOpen = expandedSections[id] ?? false;
    return (
      <fieldset className="rounded-2xl border border-gray-200 bg-white p-0 overflow-hidden transition-colors hover:border-gray-300 shadow-sm">
        <button
          type="button"
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-5 h-5 text-teal-600 group-hover:text-teal-700 transition-colors" />}
            <div className="text-left">
              <legend className="text-base font-semibold text-gray-900">{title}</legend>
              {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
          )}
        </button>
        {isOpen && <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-6">{children}</div>}
      </fieldset>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600" />
                <p className="text-xs uppercase tracking-[0.3em] text-teal-600">Content Manager</p>
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              {isDirty && !saving && (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Unsaved changes
                </span>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* Language Selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Editing Language</p>
              <p className="text-xs text-gray-600 mt-1">Select which language version you&apos;re editing</p>
            </div>
            <div className="flex gap-3">
              {languages.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLangChange(option.value)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    lang === option.value
                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  disabled={loading || saving}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-sm text-emerald-700">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <CollapsibleFieldset
            id="branding"
            title="Branding & SEO"
            description="Page title, description, logo, and favicon settings"
            icon={Image}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Page title
              <input
                type="text"
                value={content.branding.title}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    branding: { ...prev.branding, title: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Description
              <textarea
                value={content.branding.description}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    branding: { ...prev.branding, description: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                rows={3}
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Logo text
              <input
                type="text"
                value={content.branding.logoText}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    branding: { ...prev.branding, logoText: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Favicon URL (PNG/SVG/ICO)
              <input
                type="text"
                value={content.branding.favicon}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    branding: { ...prev.branding, favicon: event.target.value },
                  }))
                }
                placeholder="/icons/ivan-orb.svg"
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="navigation"
            title="Navigation"
            description="Menu labels and navigation text"
            icon={Menu}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {(Object.keys(content.nav) as Array<keyof typeof content.nav>).map((key) => (
                <label key={key} className="block text-xs uppercase tracking-widest text-gray-600">
                  {key}
                  <input
                    type="text"
                    value={content.nav[key]}
                    onChange={(event) =>
                      updateContent((prev) => ({
                        ...prev,
                        nav: { ...prev.nav, [key]: event.target.value },
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    disabled={loading}
                  />
                </label>
              ))}
            </div>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="theme"
            title="Theme Fonts"
            description="Customize font families for body, headings, and code"
            icon={Type}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Body font stack
              <input
                type="text"
                value={themeSettings.bodyFont}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    theme: { ...(prev.theme ?? fallbackTheme), bodyFont: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Heading font stack
              <input
                type="text"
                value={themeSettings.headingFont}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    theme: { ...(prev.theme ?? fallbackTheme), headingFont: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Mono font stack
              <input
                type="text"
                value={themeSettings.monoFont ?? ""}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    theme: { ...(prev.theme ?? fallbackTheme), monoFont: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="hero"
            title="Hero Section"
            description="Main landing section with greeting, headline, and CTAs"
            icon={Sparkles}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Greeting
                <input
                  type="text"
                  value={content.hero.greeting}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, greeting: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Role
                <input
                  type="text"
                  value={content.hero.role}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, role: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
            </div>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Headline
              <input
                type="text"
                value={content.hero.headline}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <MarkdownField
              label="Subheadline"
              helperText="Markdown enabled—select text and click the buttons to format."
              value={content.hero.subheadline}
              onChange={(text) =>
                updateContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subheadline: text },
                }))
              }
              rows={4}
              disabled={loading}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Primary CTA label
                <input
                  type="text"
                  value={content.hero.cta}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, cta: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Contact CTA label
                <input
                  type="text"
                  value={content.hero.contact}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, contact: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
            </div>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="about"
            title="About Section"
            description="Personal summary and education information"
            icon={User}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Title
              <input
                type="text"
                value={content.about.title}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    about: { ...prev.about, title: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <MarkdownField
              label="Summary"
              helperText="Markdown enabled—select text and click the buttons to format."
              value={content.about.summary}
              onChange={(text) =>
                updateContent((prev) => ({
                  ...prev,
                  about: { ...prev.about, summary: text },
                }))
              }
              rows={4}
              disabled={loading}
            />
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Education section title
              <input
                type="text"
                value={content.about.educationTitle}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    about: { ...prev.about, educationTitle: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Education entry 1
                <input
                  type="text"
                  value={content.about.education1}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, education1: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Education entry 2
                <input
                  type="text"
                  value={content.about.education2}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, education2: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
            </div>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="experience"
            title="Experience & Stack"
            description="Work experience, roles, and technology stack"
            icon={Briefcase}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Section title
              <input
                type="text"
                value={content.experience.title}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    experience: { ...prev.experience, title: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Subtitle
                <textarea
                value={content.experience.subtitle}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    experience: { ...prev.experience, subtitle: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                rows={3}
                disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Roles label
                <input
                  type="text"
                  value={content.experience.rolesLabel ?? ""}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      experience: { ...prev.experience, rolesLabel: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Download CTA label
                <input
                type="text"
                value={content.experience.cta}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    experience: { ...prev.experience, cta: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Stack label
              <input
                type="text"
                value={content.stack.title}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    stack: { ...prev.stack, title: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-gray-600">Stack sections</p>
              {(content.stack.sections ?? []).map((section, sectionIndex) => (
                <div key={`${section.title}-${sectionIndex}`} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Section {sectionIndex + 1}</span>
                    {(content.stack.sections?.length ?? 0) > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => {
                            const sections = [...(prev.stack.sections ?? [])];
                            sections.splice(sectionIndex, 1);
                            return {
                              ...prev,
                              stack: { ...prev.stack, sections },
                            };
                          })
                        }
                        className="text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Title
                    <input
                      type="text"
                      value={section.title}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const sections = [...(prev.stack.sections ?? [])];
                          sections[sectionIndex] = {
                            ...sections[sectionIndex],
                            title: event.target.value,
                          };
                          return { ...prev, stack: { ...prev.stack, sections } };
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Description
                    <textarea
                      value={section.description}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const sections = [...(prev.stack.sections ?? [])];
                          sections[sectionIndex] = {
                            ...sections[sectionIndex],
                            description: event.target.value,
                          };
                          return { ...prev, stack: { ...prev.stack, sections } };
                        })
                      }
                      rows={2}
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Icon
                    <select
                      value={section.icon}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const sections = [...(prev.stack.sections ?? [])];
                          sections[sectionIndex] = {
                            ...sections[sectionIndex],
                            icon: event.target.value as StackIcon,
                          };
                          return { ...prev, stack: { ...prev.stack, sections } };
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    >
                      {stackIconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Items (newline separated)
                    <textarea
                      value={section.items.join("\n")}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const sections = [...(prev.stack.sections ?? [])];
                          sections[sectionIndex] = {
                            ...sections[sectionIndex],
                            items: parseStackItems(event.target.value),
                          };
                          return { ...prev, stack: { ...prev.stack, sections } };
                        })
                      }
                      rows={3}
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateContent((prev) => ({
                    ...prev,
                    stack: {
                      ...prev.stack,
                      sections: [...(prev.stack.sections ?? []), createStackSection()],
                    },
                  }))
                }
                className="text-sm text-teal-600 hover:text-teal-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                disabled={loading}
              >
                Add stack section
              </button>
          </div>

          <MarkdownField
            label="Description"
            helperText="Markdown enabled—select text and click the buttons to format."
            value={content.projects.description}
            onChange={(text) =>
              updateContent((prev) => ({
                ...prev,
                projects: { ...prev.projects, description: text },
              }))
            }
            rows={3}
            disabled={loading}
          />

          <div className="space-y-4">
              {content.experience.roles.map((role, index) => (
                <div key={`${role.role}-${index}`} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Role {index + 1}</span>
                    {content.experience.roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => {
                            const roles = prev.experience.roles.slice();
                            roles.splice(index, 1);
                            return {
                              ...prev,
                              experience: { ...prev.experience, roles: roles.length ? roles : [createExperienceRole()] },
                            };
                          })
                        }
                        className="text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Role
                      <input
                        type="text"
                        value={role.role}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const roles = prev.experience.roles.slice();
                            roles[index] = { ...roles[index], role: event.target.value };
                            return { ...prev, experience: { ...prev.experience, roles } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Company
                      <input
                        type="text"
                        value={role.company ?? ""}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const roles = prev.experience.roles.slice();
                            roles[index] = { ...roles[index], company: event.target.value };
                            return { ...prev, experience: { ...prev.experience, roles } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Company logo URL
                      <input
                        type="text"
                        value={role.companyLogo ?? ""}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const roles = prev.experience.roles.slice();
                            roles[index] = { ...roles[index], companyLogo: event.target.value };
                            return { ...prev, experience: { ...prev.experience, roles } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Logo alt text
                      <input
                        type="text"
                        value={role.companyLogoAlt ?? ""}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const roles = prev.experience.roles.slice();
                            roles[index] = { ...roles[index], companyLogoAlt: event.target.value };
                            return { ...prev, experience: { ...prev.experience, roles } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Period
                      <input
                        type="text"
                        value={role.period}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const roles = prev.experience.roles.slice();
                            roles[index] = { ...roles[index], period: event.target.value };
                            return { ...prev, experience: { ...prev.experience, roles } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Location
                      <input
                        type="text"
                        value={role.location}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const roles = prev.experience.roles.slice();
                            roles[index] = { ...roles[index], location: event.target.value };
                            return { ...prev, experience: { ...prev.experience, roles } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Summary
                    <textarea
                      value={role.summary}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const roles = prev.experience.roles.slice();
                          roles[index] = { ...roles[index], summary: event.target.value };
                          return { ...prev, experience: { ...prev.experience, roles } };
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      rows={3}
                      disabled={loading}
                    />
                  </label>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-gray-600">Highlights</p>
                    {role.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(event) =>
                            updateContent((prev) => {
                              const roles = prev.experience.roles.slice();
                              const bullets = roles[index].bullets.slice();
                              bullets[bulletIndex] = event.target.value;
                              roles[index] = { ...roles[index], bullets };
                              return { ...prev, experience: { ...prev.experience, roles } };
                            })
                          }
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                          disabled={loading}
                        />
                        {role.bullets.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              updateContent((prev) => {
                                const roles = prev.experience.roles.slice();
                                const bullets = roles[index].bullets.slice();
                                bullets.splice(bulletIndex, 1);
                                roles[index] = { ...roles[index], bullets: bullets.length ? bullets : [""] };
                                return { ...prev, experience: { ...prev.experience, roles } };
                              })
                            }
                            className="rounded-lg border border-gray-300 px-3 text-sm text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((prev) => {
                          const roles = prev.experience.roles.slice();
                          roles[index] = { ...roles[index], bullets: [...roles[index].bullets, ""] };
                          return { ...prev, experience: { ...prev.experience, roles } };
                        })
                      }
                      className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-xs text-gray-700 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    >
                      + Add bullet
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                updateContent((prev) => ({
                  ...prev,
                  experience: { ...prev.experience, roles: [...prev.experience.roles, createExperienceRole()] },
                }))
              }
              className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm text-gray-700 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              disabled={loading}
            >
              + Add role
            </button>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="projects"
            title="Projects"
            description="Portfolio projects and case studies"
            icon={FolderKanban}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                Section title
                <input
                  type="text"
                  value={content.projects.title}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      projects: { ...prev.projects, title: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                View all label
                <input
                  type="text"
                  value={content.projects.viewAll}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      projects: { ...prev.projects, viewAll: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                View more label
                <input
                  type="text"
                  value={content.projects.viewMore}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      projects: { ...prev.projects, viewMore: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                View less label
                <input
                  type="text"
                  value={content.projects.viewLess}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      projects: { ...prev.projects, viewLess: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
            </div>

            <div className="space-y-4">
              {content.projectItems.map((project, index) => (
                <div key={project.id} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Project {index + 1}</span>
                    {content.projectItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => {
                            const projectItems = prev.projectItems.slice();
                            projectItems.splice(index, 1);
                            return { ...prev, projectItems: projectItems.length ? projectItems : [createProject()] };
                          })
                        }
                        className="text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      ID
                      <input
                        type="number"
                        value={project.id}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const projectItems = prev.projectItems.slice();
                            projectItems[index] = { ...projectItems[index], id: Number(event.target.value) };
                            return { ...prev, projectItems };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-widest text-gray-600 md:col-span-2">
                      Title
                      <input
                        type="text"
                        value={project.title}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const projectItems = prev.projectItems.slice();
                            projectItems[index] = { ...projectItems[index], title: event.target.value };
                            return { ...prev, projectItems };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <MarkdownField
                    label="Description"
                    helperText="Markdown enabled—select text and click the buttons to format."
                    value={project.desc}
                    onChange={(text) =>
                      updateContent((prev) => {
                        const projectItems = prev.projectItems.slice();
                        projectItems[index] = { ...projectItems[index], desc: text };
                        return { ...prev, projectItems };
                      })
                    }
                    rows={3}
                    disabled={loading}
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Icon
                      <select
                        value={project.icon}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const projectItems = prev.projectItems.slice();
                            projectItems[index] = { ...projectItems[index], icon: event.target.value as ProjectIcon };
                            return { ...prev, projectItems };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      >
                        {projectIconOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Tags (comma separated)
                      <input
                        type="text"
                        key={`project-tags-${project.id}-${project.tags.join(",")}`}
                        defaultValue={project.tags.join(", ")}
                        onBlur={(event) =>
                          updateContent((prev) => {
                            const projectItems = prev.projectItems.slice();
                            projectItems[index] = {
                              ...projectItems[index],
                              tags: parseTagString(event.target.value),
                            };
                            return { ...prev, projectItems };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                updateContent((prev) => ({
                  ...prev,
                  projectItems: [...prev.projectItems, createProject()],
                }))
              }
              className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm text-gray-700 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              disabled={loading}
            >
              + Add project
            </button>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="blog"
            title="Blog"
            description="Blog posts and articles"
            icon={FileText}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Section title
              <input
                type="text"
                value={content.blog.title}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    blog: { ...prev.blog, title: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <MarkdownField
              label="Description"
              helperText="Markdown enabled—select text and click the buttons to format."
              value={content.blog.description}
              onChange={(text) =>
                updateContent((prev) => ({
                  ...prev,
                  blog: { ...prev.blog, description: text },
                }))
              }
              rows={3}
              disabled={loading}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                View all label
                <input
                  type="text"
                  value={content.blog.viewAll}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      blog: { ...prev.blog, viewAll: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                View more label
                <input
                  type="text"
                  value={content.blog.viewMore}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      blog: { ...prev.blog, viewMore: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
              <label className="block text-xs uppercase tracking-widest text-gray-600">
                View less label
                <input
                  type="text"
                  value={content.blog.viewLess}
                  onChange={(event) =>
                    updateContent((prev) => ({
                      ...prev,
                      blog: { ...prev.blog, viewLess: event.target.value },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  disabled={loading}
                />
              </label>
            </div>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Read more label
              <input
                type="text"
                value={content.blog.readMore}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    blog: { ...prev.blog, readMore: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Empty state copy
              <input
                type="text"
                value={content.blog.empty}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    blog: { ...prev.blog, empty: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>

            <div className="space-y-4">
              {(content.blogPosts || []).map((post, index) => (
                <div key={post.id} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Entry {index + 1}</span>
                    {(content.blogPosts?.length ?? 0) > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => {
                            const blogPosts = (prev.blogPosts || []).slice();
                            blogPosts.splice(index, 1);
                            return { ...prev, blogPosts: blogPosts.length ? blogPosts : [createBlogEntry()] };
                          })
                        }
                        className="text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      ID
                      <input
                        type="number"
                        value={post.id}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const blogPosts = (prev.blogPosts || []).slice();
                            blogPosts[index] = { ...blogPosts[index], id: Number(event.target.value) };
                            return { ...prev, blogPosts };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Date label
                      <input
                        type="text"
                        value={post.date}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const blogPosts = (prev.blogPosts || []).slice();
                            blogPosts[index] = { ...blogPosts[index], date: event.target.value };
                            return { ...prev, blogPosts };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                  </div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Title
                    <input
                      type="text"
                      value={post.title}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const blogPosts = (prev.blogPosts || []).slice();
                          blogPosts[index] = { ...blogPosts[index], title: event.target.value };
                          return { ...prev, blogPosts };
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    />
                  </label>
                  <MarkdownField
                    label="Summary"
                    helperText="Markdown enabled—select text and click the buttons to format."
                    value={post.summary}
                    onChange={(text) =>
                      updateContent((prev) => {
                        const blogPosts = (prev.blogPosts || []).slice();
                        blogPosts[index] = { ...blogPosts[index], summary: text };
                        return { ...prev, blogPosts };
                      })
                    }
                    rows={3}
                    disabled={loading}
                  />
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Cover image (URL or /public path)
                    <input
                      type="text"
                      value={post.image ?? ""}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const blogPosts = (prev.blogPosts || []).slice();
                          blogPosts[index] = { ...blogPosts[index], image: event.target.value };
                          return { ...prev, blogPosts };
                        })
                      }
                      placeholder="/blog/default.svg"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    Optional URL
                    <input
                      type="text"
                      value={post.url ?? ""}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const blogPosts = (prev.blogPosts || []).slice();
                          blogPosts[index] = { ...blogPosts[index], url: event.target.value };
                          return { ...prev, blogPosts };
                        })
                      }
                      placeholder="https://example.com/article"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                updateContent((prev) => ({
                  ...prev,
                  blogPosts: [...(prev.blogPosts || []), createBlogEntry()],
                }))
              }
              className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm text-gray-700 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              disabled={loading}
            >
              + Add blog entry
            </button>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="contact"
            title="Contact"
            description="Contact information and social links"
            icon={Mail}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Section title
              <input
                type="text"
                value={content.contact.title}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, title: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Email
              <input
                type="email"
                value={content.contact.email}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, email: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
            <MarkdownField
              label="Body copy"
              helperText="Markdown enabled—select text and click the buttons to format."
              value={content.contact.text}
              onChange={(text) =>
                updateContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, text },
                }))
              }
              rows={3}
              disabled={loading}
            />

            <div className="space-y-4">
              {content.contact.socials.map((social, index) => (
                <div key={`${social.platform}-${index}`} className="rounded-xl border border-gray-200 bg-white p-4 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Social {index + 1}</span>
                    {content.contact.socials.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => {
                            const socials = prev.contact.socials.slice();
                            socials.splice(index, 1);
                            return {
                              ...prev,
                              contact: { ...prev.contact, socials: socials.length ? socials : [createSocialLink()] },
                            };
                          })
                        }
                        className="text-red-600 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Label
                      <input
                        type="text"
                        value={social.label}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const socials = prev.contact.socials.slice();
                            socials[index] = { ...socials[index], label: event.target.value };
                            return { ...prev, contact: { ...prev.contact, socials } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      />
                    </label>
                    <label className="block text-xs uppercase tracking-widest text-gray-600">
                      Platform
                      <select
                        value={social.platform}
                        onChange={(event) =>
                          updateContent((prev) => {
                            const socials = prev.contact.socials.slice();
                            socials[index] = { ...socials[index], platform: event.target.value as SocialPlatform };
                            return { ...prev, contact: { ...prev.contact, socials } };
                          })
                        }
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        disabled={loading}
                      >
                        {socialPlatformOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="block text-xs uppercase tracking-widest text-gray-600">
                    URL
                    <input
                      type="text"
                      value={social.url}
                      onChange={(event) =>
                        updateContent((prev) => {
                          const socials = prev.contact.socials.slice();
                          socials[index] = { ...socials[index], url: event.target.value };
                          return { ...prev, contact: { ...prev.contact, socials } };
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                      disabled={loading}
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                updateContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, socials: [...prev.contact.socials, createSocialLink()] },
                }))
              }
              className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm text-gray-700 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              disabled={loading}
            >
              + Add social link
            </button>
          </CollapsibleFieldset>

          <CollapsibleFieldset
            id="footer"
            title="Footer"
            description="Footer copyright and legal text"
            icon={Home}
          >
            <label className="block text-xs uppercase tracking-widest text-gray-600">
              Copyright line
              <input
                type="text"
                value={content.footer.copyright}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, copyright: event.target.value },
                  }))
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                disabled={loading}
              />
            </label>
          </CollapsibleFieldset>

          {/* Sticky Save Button */}
          <div className="sticky bottom-0 pb-6 pt-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 mt-8">
              <button
                type="submit"
                disabled={loading || saving || !isDirty}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-teal-500 py-4 text-center text-base font-semibold text-black transition-colors hover:bg-teal-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-teal-500 shadow-lg shadow-teal-500/20"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save all changes
                  </>
                )}
              </button>
              {isDirty && !saving && (
                <p className="text-xs text-amber-600 text-center mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  You have unsaved changes
                </p>
              )}
          </div>
        </form>
      </div>
    </div>
  );
}
