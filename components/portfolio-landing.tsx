// @ts-nocheck
'use client';
import React, {
  useState,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Menu,
  X,
  ArrowUpRight,
  Code2,
  BrainCircuit,
  Layers,
  Database,
  Cloud,
  MessageSquare,
  Send,
  Sparkles,
  Loader2,
  Sun,
  Moon,
  Twitter,
  FileText,
  Briefcase,
  MapPin,
  Clock3,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import {
  defaultContent,
  type LandingContent,
  type ProjectItem,
  type BlogEntry,
  type SocialPlatform,
  type ProjectIcon,
} from "@/content/site-content";
import { GithubContributions } from "@/components/github-contributions";

type Language = Locale;
type Theme = "dark" | "light";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const projectIconMap: Record<ProjectIcon, LucideIcon> = {
  cloud: Cloud,
  database: Database,
  layers: Layers,
};

const socialIconMap: Record<SocialPlatform, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  resume: FileText,
};

const renderWithBold = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const isBold = part.startsWith("**") && part.endsWith("**");
    return isBold ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={index}>{part}</span>
    );
  });

const githubUsername = "ivannxbt";

type ContactPreview = {
  title: string;
  subtitle: string;
  description: string;
  highlights?: string[];
  avatar?: string;
};

const contactPreviewContent: Record<string, ContactPreview> = {
  github: {
    title: "GitHub / ivannxbt",
    subtitle: "AI & Data Engineer",
    description: "Latest experiments with RAG, LangChain, and ML infra. Frequent commits across Python + cloud stacks.",
    highlights: ["Python", "AWS", "RAG"],
    avatar: "/profile.jpeg",
  },
  linkedin: {
    title: "LinkedIn",
    subtitle: "Network with engineering leaders",
    description: "Career snapshots, speaking gigs, and the playbooks I use to deliver AI initiatives at enterprise scale.",
    highlights: ["Case studies", "Hiring", "Open to talk"],
    avatar: "/profile.jpeg",
  },
  twitter: {
    title: "X / @_ivvann",
    subtitle: "Build in public",
    description: "Daily notes on agents, LLM stacks, and lessons from consulting. Expect candid takes and prototypes.",
    highlights: ["Threads", "Prototypes", "AMA"],
    avatar: "/profile.jpeg",
  },
  resume: {
    title: "Resume",
    subtitle: "Download CV (PDF)",
    description: "One-page overview with projects, impact metrics, and tech stack highlights.",
    highlights: ["PDF", "Up to date", "1 page"],
    avatar: "/icons/ivan-orb.svg",
  },
  email: {
    title: "Email",
    subtitle: "ivanncaamano@gmail.com",
    description: "Drops straight into my inbox. Ideal for projects, advisory, or collaborations in AI & software.",
    highlights: ["Fast reply", "Madrid", "Remote"],
    avatar: "/profile.jpeg",
  },
  default: {
    title: "Let’s connect",
    subtitle: "Say hi",
    description: "Reach out for collaborations, speaking, or to jam on AI systems.",
    highlights: ["AI", "Data", "Consulting"],
    avatar: "/profile.jpeg",
  },
};

const callGemini = async (prompt: string, systemInstruction?: string) => {
  if (!apiKey) {
    return "AI key not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to use this feature.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
        }),
      }
    );

    if (!response.ok) throw new Error("API Error");

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No insight available right now."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please try again later.";
  }
};

const TechIcon = ({ label, theme }: { label: string; theme: Theme }) => (
  <span
    className={`text-xs font-mono px-2 py-1 rounded transition-colors cursor-default border ${
      theme === "dark"
        ? "text-neutral-400 bg-neutral-900 border-neutral-800 hover:border-neutral-600"
        : "text-neutral-600 bg-white border-neutral-200 hover:border-neutral-400"
    }`}
  >
    {label}
  </span>
);

const ContactPreviewCard = ({
  preview,
  theme,
  active,
}: {
  preview: ContactPreview;
  theme: Theme;
} & { active: boolean }) => (
  <div
    className={`pointer-events-none absolute left-1/2 top-full z-20 mt-4 w-72 -translate-x-1/2 rounded-3xl border p-4 shadow-2xl transition-all duration-200 ${
      active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
    } ${theme === "dark" ? "bg-[#0f0f0f] border-white/5" : "bg-white border-black/5"}`}
    aria-hidden={!active}
  >
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
        <Image src={preview.avatar ?? "/profile.jpeg"} alt={preview.title} fill className="object-cover" sizes="48px" />
      </div>
      <div>
        <p className="text-sm font-semibold">{preview.title}</p>
        <p className="text-xs text-neutral-500">{preview.subtitle}</p>
      </div>
    </div>
    <p className={`mt-3 text-xs leading-relaxed ${theme === "dark" ? "text-neutral-300" : "text-neutral-600"}`}>
      {preview.description}
    </p>
    {preview.highlights && (
      <div className="mt-3 flex flex-wrap gap-2">
        {preview.highlights.map((item) => (
          <span
            key={item}
            className={`text-[10px] uppercase tracking-widest rounded-full px-3 py-1 ${
              theme === "dark" ? "bg-white/5 text-neutral-300" : "bg-neutral-900/5 text-neutral-600"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    )}
  </div>
);

const ContactShowcase = ({
  contact,
  theme,
  lang,
}: {
  contact: LandingContent["contact"];
  theme: Theme;
  lang: Language;
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyEmail = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error("Clipboard error:", error);
    }
  };

  const items = [
    ...contact.socials.map((social) => ({
      key: social.platform,
      label: social.label,
      href: social.url,
      type: "link" as const,
    })),
    {
      key: "email",
      label: lang === "en" ? "Copy Email" : "Copiar email",
      value: contact.email,
      type: "copy" as const,
    },
  ];

  return (
    <div
      className={`mb-10 flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-3 ${
        theme === "dark" ? "border-white/10 bg-white/5" : "border-neutral-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center gap-4">
        {items.map((item) =>
          item.type === "link" ? (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={`text-sm font-medium tracking-wide ${
                theme === "dark" ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </a>
          ) : (
            <button
              key={item.key}
              type="button"
              onClick={() => copyEmail(item.value, item.key)}
              className={`text-sm font-medium tracking-wide focus:outline-none ${
                theme === "dark" ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {copiedKey === item.key
                ? lang === "en"
                  ? "Copied!"
                  : "¡Copiado!"
                : item.label}
            </button>
          )
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({
  project,
  lang,
  theme,
  aiEnabled,
}: {
  project: ProjectItem;
  lang: Language;
  theme: Theme;
  aiEnabled: boolean;
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const IconComponent = projectIconMap[project.icon] ?? Layers;

  const handleGenerateInsight = async (e: ReactMouseEvent) => {
    e.preventDefault();
    if (insight || !aiEnabled) return;

    setLoading(true);
    const prompt = `Act as a senior software architect. Briefly analyze (max 40 words) why the tech stack [${project.tags.join(
      ", "
    )}] is a good choice for a project described as: "${project.desc}". Respond in ${
      lang === "en" ? "English" : "Spanish"
    }. Start directly with the reason.`;

    const result = await callGemini(prompt);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div
      className={`group relative border rounded-xl p-6 transition-all duration-300 flex flex-col h-full hover:shadow-lg ${
        theme === "dark"
          ? "bg-[#0a0a0a] border-neutral-900 hover:border-neutral-700 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]"
          : "bg-white border-neutral-200 hover:border-teal-500/30 hover:shadow-teal-900/5"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-lg transition-colors ${
            theme === "dark"
              ? "bg-neutral-900 text-neutral-300 group-hover:text-white"
              : "bg-teal-50 text-teal-700 group-hover:bg-teal-100"
          }`}
        >
          <IconComponent size={24} strokeWidth={1.5} />
        </div>
        <div className="flex gap-2">
          {aiEnabled ? (
            <button
              onClick={handleGenerateInsight}
              title="Generate AI Architecture Insight"
              disabled={loading}
              className={`p-2 rounded-full transition-all ${
                insight
                  ? theme === "dark"
                    ? "text-teal-400 bg-teal-900/20"
                    : "text-teal-600 bg-teal-100"
                  : theme === "dark"
                    ? "text-neutral-600 hover:text-teal-400 hover:bg-neutral-800"
                    : "text-neutral-400 hover:text-teal-600 hover:bg-neutral-100"
              }`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            </button>
          ) : (
            <div
              className={`p-2 rounded-full text-xs ${
                theme === "dark"
                  ? "text-neutral-600 bg-neutral-900"
                  : "text-neutral-400 bg-neutral-100"
              }`}
              title="AI insights disabled (no API key configured)"
            >
              <Sparkles size={18} />
            </div>
          )}
          <ArrowUpRight
            size={18}
            className={`mt-2 transition-colors ${
              theme === "dark"
                ? "text-neutral-600 group-hover:text-white"
                : "text-neutral-400 group-hover:text-neutral-900"
            }`}
          />
        </div>
      </div>

      <h3
        className={`text-lg font-semibold mb-2 ${
          theme === "dark"
            ? "text-neutral-200 group-hover:text-white"
            : "text-neutral-800 group-hover:text-teal-700"
        }`}
      >
        {lang === "en" ? project.title : project.titleEs}
      </h3>
      <p
        className={`text-sm leading-relaxed mb-6 flex-grow ${
          theme === "dark" ? "text-neutral-500" : "text-neutral-600"
        }`}
      >
        {lang === "en" ? project.desc : project.descEs}
      </p>

      {insight && (
        <div
          className={`mb-6 p-3 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-950/20 border-teal-900/30"
              : "bg-teal-50 border-teal-100"
          }`}
        >
          <p
            className={`text-xs leading-relaxed font-mono ${
              theme === "dark" ? "text-teal-200/80" : "text-teal-800/80"
            }`}
          >
            <span className="font-bold text-teal-500">AI Insight:</span> {insight}
          </p>
        </div>
      )}

      <div
        className={`flex flex-wrap gap-2 mt-auto pt-4 border-t ${
          theme === "dark" ? "border-neutral-900/50" : "border-neutral-100"
        }`}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
const BlogRow = ({
  post,
  lang,
  theme,
}: {
  post: BlogEntry;
  lang: Language;
  theme: Theme;
}) => {
  const link = post.url || `/${lang}/blog`;
  const external = Boolean(post.url);
  return (
    <a
      href={link}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group flex flex-col gap-1 rounded-xl px-3 py-3 transition-colors ${
        theme === "dark"
          ? "hover:bg-neutral-900/50"
          : "hover:bg-neutral-50"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-neutral-500">{post.date}</span>
        <h4
          className={`text-base font-medium transition-colors ${
            theme === "dark"
              ? "text-neutral-300 group-hover:text-teal-400"
              : "text-neutral-800 group-hover:text-teal-600"
          }`}
        >
          {post.title}
        </h4>
      </div>
      <p
        className={`text-sm whitespace-pre-line ${
          theme === "dark" ? "text-neutral-500" : "text-neutral-600"
        }`}
      >
        {post.summary}
      </p>
    </a>
  );
};

const ExperienceCard = ({
  item,
  theme,
}: {
  item: LandingContent["experience"]["roles"][number];
  theme: Theme;
}) => (
  <div
    className={`border rounded-2xl p-6 transition-colors ${
      theme === "dark" ? "bg-[#0a0a0a] border-neutral-900" : "bg-white border-neutral-200"
    }`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
          {item.role}
        </p>
        {item.company && (
          <p className={`text-sm font-medium ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
            {item.company}
          </p>
        )}
      </div>
      <div
        className={`p-3 rounded-full ${
          theme === "dark" ? "bg-neutral-900 text-neutral-300" : "bg-teal-50 text-teal-700"
        }`}
      >
        <Briefcase size={18} strokeWidth={1.5} />
      </div>
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
      <span
        className={`flex items-center gap-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
      >
        <Clock3 size={14} />
        {item.period}
      </span>
      <span
        className={`flex items-center gap-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
      >
        <MapPin size={14} />
        {item.location}
      </span>
    </div>

    <p className={`mt-4 text-sm leading-relaxed ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}>
      {item.summary}
    </p>

    <ul className="mt-4 space-y-2">
      {item.bullets.map((point) => (
        <li key={point} className={`flex gap-3 text-sm ${theme === "dark" ? "text-neutral-300" : "text-neutral-700"}`}>
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ChatWidget = ({
  lang,
  theme,
  variant = "floating",
}: {
  lang: Language;
  theme: Theme;
  variant?: "floating" | "inline";
}) => {
  const isInline = variant === "inline";
  const [isOpen, setIsOpen] = useState(isInline);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    {
      role: "model",
      text:
        lang === "en"
          ? "Hi! I'm Ivan's AI Assistant. Ask me anything about his experience or skills."
          : "¡Hola! Soy el asistente IA de Iván. Pregúntame lo que quieras sobre su experiencia o habilidades.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    const systemContext = `
      You are an AI assistant for Iván Caamaño's portfolio website. 
      Use the following context to answer questions:
      - Role: Telematics Engineer, AI/ML Specialist.
      - Education: Master in Network Services (UPM), Bachelor in Telecom (UPM).
      - Key Skills: Python, PyTorch, AWS, Azure, RAG, Generative AI.
      - Projects: AI Doc Generation (AWS), RAG Chatbot (Azure), Radar ML Optimization (Indra).
      - Tone: Professional, enthusiastic, concise.
      - Language: Respond in ${lang === "en" ? "English" : "Spanish"}.
    `;

    const reply = await callGemini(userMsg, systemContext);

    setMessages((prev) => [...prev, { role: "model", text: reply }]);
    setIsLoading(false);
  };

  return (
    <div
      className={
        isInline ? "w-full" : "fixed bottom-6 right-6 z-50 flex flex-col items-end"
      }
    >
      {isOpen && (
        <div
          className={`border rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
            isInline ? "w-full h-[520px]" : "w-80 md:w-96 h-[400px] mb-4"
          } ${
            theme === "dark"
              ? "bg-[#0f0f0f] border-neutral-800"
              : "bg-white border-neutral-200"
          }`}
        >
          <div
            className={`p-4 border-b flex justify-between items-center ${
              theme === "dark"
                ? "bg-neutral-900/50 border-neutral-800"
                : "bg-neutral-50/80 border-neutral-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                }`}
              >
                Iván.AI Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`hover:opacity-70 ${
                theme === "dark"
                  ? "text-neutral-500 hover:text-white"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? theme === "dark"
                        ? "bg-neutral-800 text-neutral-200 rounded-tr-none"
                        : "bg-neutral-200 text-neutral-800 rounded-tr-none"
                      : theme === "dark"
                        ? "bg-teal-900/20 text-teal-100 border border-teal-900/30 rounded-tl-none"
                        : "bg-teal-50 text-teal-900 border border-teal-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`p-2 rounded-xl rounded-tl-none ${
                    theme === "dark" ? "bg-teal-900/10" : "bg-teal-50"
                  }`}
                >
                  <Loader2 size={16} className="animate-spin text-teal-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`p-3 border-t flex gap-2 ${
              theme === "dark"
                ? "border-neutral-800 bg-neutral-900/30"
                : "border-neutral-100 bg-neutral-50"
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSend()}
              placeholder={lang === "en" ? "Ask about my skills..." : "Pregunta sobre mis skills..."}
              className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-500/50 transition-colors border ${
                theme === "dark"
                  ? "bg-neutral-950 border-neutral-800 text-white"
                  : "bg-white border-neutral-200 text-neutral-900"
              }`}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {!isInline && (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group flex items-center gap-3 bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-full shadow-lg shadow-teal-900/20 transition-all hover:scale-105 active:scale-95"
        >
          <span
            className={`max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium ${
              isOpen ? "hidden" : "block"
            }`}
          >
            {lang === "en" ? "Chat with AI" : "Hablar con IA"}
          </span>
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      )}
    </div>
  );
};
interface PortfolioLandingProps {
  initialLang?: Language;
}

export function PortfolioLanding({ initialLang = "es" }: PortfolioLandingProps) {
  const [lang, setLang] = useState<Language>(initialLang);
  const [theme, setTheme] = useState<Theme>("light");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [contentMap, setContentMap] =
    useState<Record<Language, LandingContent>>(defaultContent);
  const [contentLoading, setContentLoading] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const t = contentMap[lang];
  const aiEnabled = Boolean(apiKey);

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  useEffect(() => {
    let cancelled = false;

    const loadContent = async () => {
      setContentLoading(true);
      setContentError(null);
      try {
        const response = await fetch(`/api/content?lang=${lang}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch content.");
        }
        const payload = (await response.json()) as { data: LandingContent };
        if (!cancelled && payload.data) {
          setContentMap((prev) => ({ ...prev, [lang]: payload.data }));
        }
      } catch (error) {
        console.error("Failed to fetch content:", error);
        if (!cancelled) {
          setContentError("Using default content (unable to load latest data).");
        }
      } finally {
        if (!cancelled) {
          setContentLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#050505] text-neutral-200 selection:bg-teal-900/30 selection:text-teal-50"
          : "bg-gray-50 text-neutral-800 selection:bg-teal-100 selection:text-teal-900"
      }`}
    >
      <div
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${
          theme === "dark" ? "opacity-[0.03]" : "opacity-[0.03]"
        }`}
        style={{
          backgroundImage: `radial-gradient(${theme === "dark" ? "#ffffff" : "#000000"} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? `${
                theme === "dark" ? "bg-[#050505]/80 border-neutral-900" : "bg-white/80 border-gray-200"
              } backdrop-blur-md border-b py-3`
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div
            className={`font-bold text-lg tracking-tight flex items-center gap-2 ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-900"
            }`}
          >
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <Image src="/icons/ivan-orb.svg" alt="Iván Caamaño logo" fill className="object-cover" sizes="32px" />
            </div>
            <span>Iván Caamaño</span>
          </div>

          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {Object.entries(t.nav).map(([key, value]) => (
              <a key={key} href={`#${key}`} className="hover:text-teal-500 transition-colors capitalize">
                {value}
              </a>
            ))}

            <div className="flex items-center gap-3 ml-4 border-l pl-4 border-neutral-800/50">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-white hover:bg-neutral-900"
                    : "text-neutral-600 hover:text-black hover:bg-gray-100"
                }`}
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setLang((prev) => (prev === "en" ? "es" : "en"))}
                className={`px-2 py-1 text-xs font-mono border rounded transition-all ${
                  theme === "dark"
                    ? "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white"
                    : "border-gray-200 text-neutral-500 hover:border-gray-300 hover:text-black"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            </div>
          </nav>

          <button
            className={`md:hidden ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
            onClick={() => setMobileMenu((prev) => !prev)}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileMenu && (
        <div
          className={`fixed inset-0 z-40 pt-24 px-6 md:hidden ${
            theme === "dark" ? "bg-[#050505]" : "bg-white"
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
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setLang((prev) => (prev === "en" ? "es" : "en"));
                  setMobileMenu(false);
                }}
                className="text-teal-500 text-base"
              >
                {lang === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenu(false);
                }}
                className="text-teal-500 text-base flex items-center gap-2"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} Theme
              </button>
            </div>
          </nav>
        </div>
      )}

      <main className="relative z-10 max-w-5xl mx-auto px-6">
        {(contentLoading || contentError) && (
          <div className="pt-32 pb-4 text-xs font-mono text-neutral-500">
            {contentLoading && <p>Refreshing site details…</p>}
            {contentError && <p className="text-red-400">{contentError}</p>}
          </div>
        )}
        <section id="home" className="pt-40 pb-32 flex flex-col justify-center min-h-[80vh]">
          <div className="absolute top-20 right-0 -z-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] opacity-50" />
          <ContactShowcase contact={t.contact} theme={theme} lang={lang} />

          <h1
            className={`text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] ${
              theme === "dark" ? "text-white" : "text-neutral-900"
            }`}
          >
            {t.hero.headline}
          </h1>

          <p
            className={`text-lg max-w-2xl leading-relaxed whitespace-pre-line mb-12 ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {t.hero.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <button
              className={`px-8 py-4 font-semibold rounded-full transition-all flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {t.hero.cta}
            </button>
            <a
              href="mailto:ivanncaamano@gmail.com"
              className={`px-8 py-4 font-medium transition-colors border-b border-transparent ${
                theme === "dark"
                  ? "text-neutral-400 hover:text-white hover:border-white"
                  : "text-neutral-600 hover:text-black hover:border-black"
              }`}
            >
              {t.hero.contact}
            </a>
          </div>

          {aiEnabled && (
            <div
              className={`mt-16 p-6 md:p-8 rounded-3xl border ${
                theme === "dark"
                  ? "border-neutral-900/60 bg-neutral-900/40"
                  : "border-neutral-200 bg-white/70 backdrop-blur"
              }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.25em] text-teal-400">
                    {lang === "en" ? "Ask me anything" : "Pregúntame algo"}
                  </p>
                  <h3
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {lang === "en"
                      ? "Chat with my AI assistant"
                      : "Habla con mi asistente IA"}
                  </h3>
                  <p
                    className={`text-sm max-w-2xl ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {lang === "en"
                      ? "Get quick answers about my experience, projects, or availability."
                      : "Obtén respuestas rápidas sobre mi experiencia, proyectos o disponibilidad."}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <ChatWidget lang={lang} theme={theme} variant="inline" />
              </div>
            </div>
          )}
        </section>

        <section
          id="about"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <div className="flex flex-col gap-6">
              <div
                className={`self-center md:self-start rounded-full p-[3px] shadow-xl ${
                  theme === "dark"
                    ? "bg-gradient-to-tr from-teal-600 via-purple-600 to-blue-500"
                    : "bg-gradient-to-tr from-teal-400 via-fuchsia-400 to-blue-400"
                }`}
              >
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-neutral-900">
                  <Image
                    src="/profile.jpeg"
                    alt="Portrait of Iván Caamaño"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 10rem, 8rem"
                  />
                </div>
              </div>
              <div>
                <h2 className={`text-3xl font-bold mb-6 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                  {t.about.title}
                </h2>
                <div className={`text-sm space-y-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}>
                  <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                    {t.about.educationTitle}
                  </p>
                  <p>{t.about.education1}</p>
                  <p>{t.about.education2}</p>
                </div>
              </div>
            </div>
            <div>
              <p
                className={`text-xl leading-relaxed whitespace-pre-line mb-8 ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {renderWithBold(t.about.summary)}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4
                    className={`font-medium mb-2 flex items-center gap-2 ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    <Code2 size={16} /> Engineering
                  </h4>
                  <p className="text-sm text-neutral-500">
                    DevOps (Docker, K8s), Software Architecture, Cloud (AWS, Azure).
                  </p>
                </div>
                <div>
                  <h4
                    className={`font-medium mb-2 flex items-center gap-2 ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    <BrainCircuit size={16} /> AI & Data
                  </h4>
                  <p className="text-sm text-neutral-500">
                    RAG, LLMs, Deep Learning, Computer Vision, Data Pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="activity"
          className={`py-24 border-t ${
            theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-400">
                GitHub
              </p>
              <h2
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-neutral-900"
                }`}
              >
                Recent contributions
              </h2>
              <p
                className={`mt-3 max-w-2xl text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                Live snapshot of my commits pulled straight from GitHub using
                the community Contributions API.
              </p>
            </div>
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                theme === "dark"
                  ? "border-white/10 text-white hover:border-white/40"
                  : "border-neutral-300 text-neutral-800 hover:border-neutral-500"
              }`}
            >
              <Github size={16} />
              View profile
            </a>
          </div>

          <div className="mt-8">
            <GithubContributions username={githubUsername} theme={theme} />
          </div>
        </section>

        <section
          id="experience"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-400">
                Work
              </p>
              <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                {t.experience.title}
              </h2>
              <p
                className={`mt-3 max-w-3xl text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {t.experience.subtitle}
              </p>
            </div>
            <a
              href="/cv_iacc.pdf"
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                theme === "dark"
                  ? "border-white/10 text-white hover:border-white/40"
                  : "border-neutral-300 text-neutral-800 hover:border-neutral-500"
              }`}
            >
              <FileText size={16} />
              {t.experience.cta}
            </a>
          </div>

          <div className="grid gap-6">
            {t.experience.roles.map((role) => (
              <ExperienceCard key={`${role.role}-${role.period}`} item={role} theme={theme} />
            ))}
          </div>
        </section>

        <section
          id="projects"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="flex justify-between items-end mb-12">
            <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
              {t.projects.title}
            </h2>
            <a
              href="#"
              className={`hidden md:block text-sm font-medium transition-colors ${
                theme === "dark" ? "text-neutral-500 hover:text-teal-400" : "text-neutral-500 hover:text-teal-600"
              }`}
            >
              {t.projects.viewAll} &rarr;
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.projectItems.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                theme={theme}
                aiEnabled={aiEnabled}
              />
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <a
              href="#"
              className="text-sm font-medium text-neutral-500 hover:text-teal-500 transition-colors"
            >
              {t.projects.viewAll} &rarr;
            </a>
          </div>
        </section>

        <section
          id="blog"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                {t.blog.title}
              </h2>
              <div className="flex flex-col">
                {t.blogPosts.map((post) => (
                  <BlogRow key={post.id} post={post} lang={lang} theme={theme} />
                ))}
              </div>
              <a
                href={`/${lang}/blog`}
                className={`inline-block mt-8 text-sm transition-colors ${
                  theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"
                }`}
              >
                {t.blog.viewAll} &rarr;
              </a>
            </div>

            <div id="contact">
              <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                {t.contact.title}
              </h2>
              <p
                className={`mb-8 max-w-sm whitespace-pre-line ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {t.contact.text}
              </p>
              <a
                href={`mailto:${t.contact.email}`}
                className={`text-xl md:text-2xl font-medium transition-colors border-b-2 pb-1 ${
                  theme === "dark"
                    ? "text-white border-neutral-800 hover:text-teal-400 hover:border-teal-400"
                    : "text-neutral-900 border-neutral-200 hover:text-teal-600 hover:border-teal-600"
                }`}
              >
                {t.contact.email}
              </a>

              <div className="flex gap-6 mt-12">
                {t.contact.socials.map((social) => {
                  const Icon = socialIconMap[social.platform] ?? Github;
                  return (
                    <a
                      key={social.url}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`transition-colors ${
                        theme === "dark"
                          ? "text-neutral-500 hover:text-white"
                          : "text-neutral-400 hover:text-black"
                      }`}
                      aria-label={social.label}
                    >
                      <Icon size={22} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className={`py-12 text-center border-t mt-12 ${
          theme === "dark" ? "border-neutral-900" : "border-neutral-200"
        }`}
      >
        <p className="text-neutral-500 text-sm font-mono">{t.footer.copyright}</p>
        <div
          className={`mt-6 flex items-center justify-center gap-6 ${
            theme === "dark" ? "text-neutral-500" : "text-neutral-400"
          }`}
        >
          {t.contact.socials.map((social) => {
            const Icon = socialIconMap[social.platform] ?? Github;
            return (
              <a
                key={`footer-social-${social.url}`}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-teal-400"
                aria-label={social.label}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </footer>

      {aiEnabled && <ChatWidget lang={lang} theme={theme} />}
    </div>
  );
}
