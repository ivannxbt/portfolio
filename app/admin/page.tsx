'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { LandingContent } from "@/content/site-content";

type LanguageOption = {
  value: "en" | "es";
  label: string;
};

const languages: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Espa?ol" },
];

type BlogFormEntry = {
  id: number;
  title: string;
  date: string;
  summary: string;
  url: string;
};

type EditableFields = {
  heroHeadline: string;
  heroSubheadline: string;
  aboutSummary: string;
  contactText: string;
  contactEmail: string;
  blogPosts: BlogFormEntry[];
};

const newBlogEntry = (): BlogFormEntry => ({
  id: Date.now(),
  title: "",
  date: new Date().getFullYear().toString(),
  summary: "",
  url: "",
});

const emptyFields: EditableFields = {
  heroHeadline: "",
  heroSubheadline: "",
  aboutSummary: "",
  contactText: "",
  contactEmail: "",
  blogPosts: [newBlogEntry()],
};

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [lang, setLang] = useState<"en" | "es">("en");
  const [fields, setFields] = useState<EditableFields>(emptyFields);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    const controller = new AbortController();
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      setMessage(null);
      try {
        const response = await fetch(`/api/content?lang=${lang}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to load content.");
        const payload = (await response.json()) as { data: LandingContent };
        const data = payload.data;
        setFields({
          heroHeadline: data.hero.headline ?? "",
          heroSubheadline: data.hero.subheadline ?? "",
          aboutSummary: data.about.summary ?? "",
          contactText: data.contact.text ?? "",
          contactEmail: data.contact.email ?? "",
          blogPosts:
            data.blogPosts?.map((post, index) => ({
              id: post.id ?? index + 1,
              title: post.title ?? "",
              date: post.date ?? "",
              summary: post.summary ?? "",
              url: post.url ?? "",
            })) ?? [newBlogEntry()],
        });
      } catch (err) {
        if (controller.signal.aborted || (err as DOMException)?.name === "AbortError") {
          return;
        }
        console.error("Admin load error", err);
        setError("Unable to load content.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadContent();
    return () => controller.abort();
  }, [lang, session]);

  const handleInputChange = (
    key: keyof EditableFields,
    value: string | BlogFormEntry[]
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlogChange = (
    index: number,
    field: keyof BlogFormEntry,
    value: string
  ) => {
    setFields((prev) => {
      const next = prev.blogPosts.slice();
      next[index] = { ...next[index], [field]: value };
      return { ...prev, blogPosts: next };
    });
  };

  const addBlogEntry = () => {
    setFields((prev) => ({
      ...prev,
      blogPosts: [...prev.blogPosts, newBlogEntry()],
    }));
  };

  const removeBlogEntry = (index: number) => {
    setFields((prev) => {
      const next = prev.blogPosts.slice();
      next.splice(index, 1);
      return { ...prev, blogPosts: next.length ? next : [newBlogEntry()] };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          content: {
            hero: {
              headline: fields.heroHeadline,
              subheadline: fields.heroSubheadline,
            },
            about: {
              summary: fields.aboutSummary,
            },
            contact: {
              text: fields.contactText,
              email: fields.contactEmail,
            },
            blogPosts: fields.blogPosts.map((post) => ({
              id: post.id,
              title: post.title,
              date: post.date,
              summary: post.summary,
              url: post.url,
            })),
          },
        }),
      });
      if (!response.ok) throw new Error("Failed to save content.");
      setMessage("Content updated successfully.");
    } catch (err) {
      console.error("Admin save error", err);
      setError("Saving failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <p className="text-sm text-zinc-400">Checking session?</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 text-center max-w-md space-y-4">
          <h1 className="text-2xl font-semibold">Admin login required</h1>
          <p className="text-sm text-zinc-400">
            Please sign in to manage the site content.
          </p>
          <button
            onClick={() => router.push("/admin/login")}
            className="w-full rounded-full bg-teal-500 py-3 text-sm font-semibold text-black transition hover:bg-teal-400"
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-12">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-400">Internal backend</p>
              <h1 className="mt-2 text-4xl font-semibold">Content Manager</h1>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="self-start rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/40"
            >
              Sign out
            </button>
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            Toggle a language, edit the fields, and press save to update what appears on the landing page.
          </p>
        </header>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-4">
          <p className="text-xs text-zinc-400">Language</p>
          <div className="mt-3 flex gap-3">
            {languages.map((option) => (
              <button
                key={option.value}
                onClick={() => setLang(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  lang === option.value
                    ? "bg-teal-500 text-black"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="rounded-2xl border border-white/5 p-6">
            <legend className="px-2 text-sm uppercase tracking-[0.2em] text-teal-400">Hero</legend>
            <label className="mt-4 block text-xs uppercase tracking-widest text-zinc-400">
              Headline
              <input
                type="text"
                value={fields.heroHeadline}
                onChange={(event) => handleInputChange("heroHeadline", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                disabled={loading}
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-widest text-zinc-400">
              Subheadline
              <textarea
                value={fields.heroSubheadline}
                onChange={(event) => handleInputChange("heroSubheadline", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                rows={3}
                disabled={loading}
              />
            </label>
          </fieldset>

          <fieldset className="rounded-2xl border border-white/5 p-6">
            <legend className="px-2 text-sm uppercase tracking-[0.2em] text-teal-400">About</legend>
            <label className="mt-4 block text-xs uppercase tracking-widest text-zinc-400">
              Summary
              <textarea
                value={fields.aboutSummary}
                onChange={(event) => handleInputChange("aboutSummary", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                rows={4}
                disabled={loading}
              />
            </label>
          </fieldset>

          <fieldset className="rounded-2xl border border-white/5 p-6">
            <legend className="px-2 text-sm uppercase tracking-[0.2em] text-teal-400">Contact</legend>
            <label className="mt-4 block text-xs uppercase tracking-widest text-zinc-400">
              Email
              <input
                type="email"
                value={fields.contactEmail}
                onChange={(event) => handleInputChange("contactEmail", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                disabled={loading}
              />
            </label>
            <label className="mt-4 block text-xs uppercase tracking-widest text-zinc-400">
              Body copy
              <textarea
                value={fields.contactText}
                onChange={(event) => handleInputChange("contactText", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                rows={3}
                disabled={loading}
              />
            </label>
          </fieldset>

          <fieldset className="rounded-2xl border border-white/5 p-6">
            <legend className="px-2 text-sm uppercase tracking-[0.2em] text-teal-400">Blog entries</legend>
            <p className="text-xs text-zinc-500">
              Update the list that surfaces on the home and blog pages. Add a URL if the article lives elsewhere.
            </p>

            <div className="mt-4 space-y-6">
              {fields.blogPosts.map((post, index) => (
                <div key={post.id} className="space-y-3 rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>Entry {index + 1}</span>
                    {fields.blogPosts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBlogEntry(index)}
                        className="text-red-400 hover:text-red-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400">
                    Title
                    <input
                      type="text"
                      value={post.title}
                      onChange={(event) => handleBlogChange(index, "title", event.target.value)}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                      disabled={loading}
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400">
                    Year / date label
                    <input
                      type="text"
                      value={post.date}
                      onChange={(event) => handleBlogChange(index, "date", event.target.value)}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                      disabled={loading}
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400">
                    Summary
                    <textarea
                      value={post.summary}
                      onChange={(event) => handleBlogChange(index, "summary", event.target.value)}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                      rows={3}
                      disabled={loading}
                    />
                  </label>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400">
                    Optional URL
                    <input
                      type="text"
                      value={post.url}
                      onChange={(event) => handleBlogChange(index, "url", event.target.value)}
                      placeholder="https://example.com/article"
                      className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-base text-white"
                      disabled={loading}
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addBlogEntry}
              className="mt-4 w-full rounded-xl border border-dashed border-white/20 py-3 text-sm text-zinc-300 hover:border-white/50"
              disabled={loading}
            >
              + Add blog entry
            </button>
          </fieldset>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={loading || saving}
            className="w-full rounded-full bg-teal-500 py-3 text-center text-sm font-semibold text-black transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving?" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
