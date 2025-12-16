// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  BrainCircuit,
  Briefcase,
  Clock3,
  Cloud,
  Code2,
  Database,
  Download,
  FileText,
  Github,
  Layers,
  Linkedin,
  Loader2,
  MapPin,
  Menu,
  Moon,
  Send,
  Sun,
  Twitter,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  defaultContent,
  type LandingContent,
  type ProjectItem,
  type BlogEntry,
  type SocialPlatform,
  type SocialPreview,
  type ProjectIcon,
  type StackIcon,
} from "@/content/site-content";
import { GithubContributions } from "@/components/github-contributions";

const socialIconMap: Record<SocialPlatform, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  resume: FileText,
};

const socialPreviewImageMap: Record<SocialPlatform, string | undefined> = {
  github: "/github.png",
  linkedin: "/linkedin.png",
  twitter: "/x.png",
  resume: undefined,
};

type SocialPreviewOverlayProps = {
  platform: SocialPlatform;
  label: string;
  preview?: SocialPreview;
};

const SocialPreviewOverlay = ({ platform, label, preview }: SocialPreviewOverlayProps) => {
  const previewImage = socialPreviewImageMap[platform];
  const screenshotImage = preview?.previewImage ?? previewImage;
  if (!screenshotImage) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-full mt-2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 transition duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      <div className="relative h-[220px] w-[360px] overflow-hidden rounded-[28px] border border-white/20 bg-neutral-900 shadow-[0_35px_60px_rgba(0,0,0,0.5)] transition duration-200 group-focus-within:shadow-[0_38px_80px_rgba(0,0,0,0.45)] group-hover:shadow-[0_38px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Image
          src={screenshotImage}
          alt={`${label} screenshot`}
          width={360}
          height={220}
          className="h-full w-full object-cover"
          priority
          quality={100}
          unoptimized
          sizes="360px"
          style={{ imageRendering: "auto" }}
        />
      </div>
    </div>
  );
};

const projectIconMap: Record<ProjectIcon, LucideIcon> = {
  cloud: Cloud,
  database: Database,
  layers: Layers,
};

  type RichTextProps = {
  text?: string;
  className?: string;
  linkClassName?: string;
};

const RichText = ({ text, className = "", linkClassName = "" }: RichTextProps) => {
  if (!text?.trim()) {
    return null;
  }

  return (
    <div className={`${className} whitespace-pre-line`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            a: ({ href, children, ...props }) => {
            const external = !!href && /^https?:/i.test(href);
            return (
              <a
                href={href}
                className={linkClassName}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ children }) => (
            <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">{children}</code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-teal-500/50 pl-4 text-sm italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

const githubUsername = "ivannxbt";
const BLOG_PREVIEW_COUNT = 3;
const PROJECT_PREVIEW_COUNT = 3;

type FallbackProfile = {
  intro: string;
  skills: string;
  experience: string;
  education: string;
  location: string;
  contact: string;
  availability: string;
  defaultMessage: string;
};

const fallbackChatProfile: Record<Language, FallbackProfile> = {
  en: {
    intro:
      "I'm Iván Caamaño, a telematics engineer focused on AI, data, and software systems in Madrid.",
    skills:
      "Daily toolbox: Python, TypeScript, SQL, LangChain, PyTorch, TensorFlow, AWS, Azure, Databricks, Docker, Terraform, and CI/CD.",
    experience:
      "Recent deliveries include document-generation agents and RAG copilots at Avvale, IMM risk tooling for BBVA at NFQ, and ML optimization for Indra's defense division.",
    education:
      "I earned both a Master's in Network & Telematic Services and a Bachelor's in Telecommunications Engineering from Universidad Politécnica de Madrid.",
    location: "Based in Madrid, Spain, collaborating remotely when needed.",
    contact:
      "Best contact: ivanncaamano@gmail.com. You can also reach me as @ivannxbt on GitHub and @_ivvann on X/LinkedIn.",
    availability:
      "Currently at Avvale leading AI programs while open to consulting or advisory projects with tangible impact.",
    defaultMessage: "Feel free to ask about my skills, education, experience, or availability.",
  },
  es: {
    intro:
      "Soy Iván Caamaño, ingeniero en telemática especializado en IA, datos y software con base en Madrid.",
    skills:
      "Mi caja de herramientas diaria incluye Python, TypeScript, SQL, LangChain, PyTorch, TensorFlow, AWS, Azure, Databricks, Docker y Terraform.",
    experience:
      "He liderado agentes de generación documental y copilotos RAG en Avvale, construido software de riesgo IMM para BBVA desde NFQ y optimizado modelos ML en la división de defensa de Indra.",
    education:
      "Completé el Máster en Servicios de Red y Telemática y el Grado en Ingeniería de Telecomunicación en la Universidad Politécnica de Madrid.",
    location: "Resido en Madrid, España, y colaboro con equipos distribuidos.",
    contact:
      "Puedes escribirme a ivanncaamano@gmail.com o encontrarme como @ivannxbt en GitHub y @_ivvann en X/LinkedIn.",
    availability:
      "Actualmente trabajo en Avvale liderando iniciativas de IA y estoy abierto a colaboraciones o consultorías con buen encaje.",
    defaultMessage: "Pregunta lo que necesites sobre mis habilidades, formación, experiencia o disponibilidad.",
  },
};

const fallbackTopicMatchers: Array<{
  keywords: string[];
  getAnswer: (profile: FallbackProfile) => string;
}> = [
  {
    keywords: ["who", "quien", "quién", "about you", "sobre ti", "eres"],
    getAnswer: (profile) => `${profile.intro} ${profile.availability}`,
  },
  {
    keywords: [
      "skill",
      "skills",
      "stack",
      "technology",
      "technologies",
      "tech",
      "tool",
      "tools",
      "habilidad",
      "habilidades",
      "tecnologia",
      "tecnología",
      "tecnologias",
      "herramienta",
      "herramientas",
    ],
    getAnswer: (profile) => profile.skills,
  },
  {
    keywords: [
      "experience",
      "experiences",
      "project",
      "projects",
      "job",
      "jobs",
      "work",
      "role",
      "roles",
      "career",
      "exp",
      "proyecto",
      "proyectos",
      "trayectoria",
    ],
    getAnswer: (profile) => profile.experience,
  },
  {
    keywords: [
      "education",
      "degree",
      "school",
      "study",
      "studies",
      "master",
      "bachelor",
      "universidad",
      "formacion",
      "formación",
    ],
    getAnswer: (profile) => profile.education,
  },
  {
    keywords: [
      "where",
      "based",
      "location",
      "city",
      "ubicado",
      "ubicación",
      "ubicacion",
      "ciudad",
    ],
    getAnswer: (profile) => profile.location,
  },
  {
    keywords: [
      "availability",
      "available",
      "consulting",
      "open",
      "contratar",
      "disponible",
      "colaborar",
      "colaboración",
    ],
    getAnswer: (profile) => profile.availability,
  },
  {
    keywords: [
      "contact",
      "email",
      "reach",
      "correo",
      "escribirte",
      "contarte",
      "contacto",
    ],
    getAnswer: (profile) => profile.contact,
  },
];

const getFallbackResponse = (prompt: string, lang: Language) => {
  const profile = fallbackChatProfile[lang] ?? fallbackChatProfile.en;
  const normalized = prompt.toLowerCase();
  const match = fallbackTopicMatchers.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  if (match) {
    return match.getAnswer(profile);
  }

  return `${profile.intro} ${profile.defaultMessage}`;
};

const callGrokAssistant = async ({
  prompt,
  systemInstruction,
  fallback,
}: {
  prompt: string;
  systemInstruction?: string;
  fallback?: () => string;
}) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        ...(systemInstruction ? { systemInstruction } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error("Chat API error");
    }

    const data = (await response.json()) as { reply?: string };
    return data.reply?.trim() ?? fallback?.() ?? "Unable to generate a response.";
  } catch (error) {
    console.error("Chat API error:", error);
    return fallback?.() ?? "Unable to reach the chat service.";
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

const stackIconMap: Record<StackIcon, LucideIcon> = {
  code: Code2,
  layers: Layers,
  brain: BrainCircuit,
};

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
      icon: socialIconMap[social.platform] ?? Github,
      platform: social.platform,
      preview: social.preview,
    })),
    {
      key: "email",
      label: lang === "en" ? "Copy Email" : "Copiar email",
      value: contact.email,
      type: "copy" as const,
      icon: Send,
    },
  ];

  return (
    <div
      className={`relative mb-10 flex flex-wrap items-center gap-4 rounded-2xl border px-4 py-3 ${
        theme === "dark" ? "border-white/10 bg-white/5" : "border-neutral-200 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {items.map((item) => {
            const Icon = item.icon;

            if (item.type === "link") {
              return (
                <div key={item.key} className="relative group">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-sm font-medium tracking-wide transition-colors ${
                      theme === "dark"
                        ? "text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                        : "text-neutral-600 border-neutral-200 hover:text-neutral-900 hover:border-neutral-400"
                    }`}
                  >
                    <Icon aria-hidden size={16} className="shrink-0" />
                    <span>{item.label}</span>
                  </a>
                  <SocialPreviewOverlay
                    platform={item.platform ?? "github"}
                    label={item.label}
                    preview={item.preview}
                  />
                </div>
              );
            }

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => copyEmail(item.value, item.key)}
                className={`text-sm font-medium tracking-wide flex items-center gap-2 rounded-full border px-3 py-1.5 focus:outline-none transition-colors ${
                  theme === "dark"
                    ? "text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                    : "text-neutral-600 border-neutral-200 hover:text-neutral-900 hover:border-neutral-400"
                }`}
              >
                <Icon size={16} />
                {copiedKey === item.key
                  ? lang === "en"
                    ? "Copied!"
                    : "¡Copiado!"
                  : item.label}
              </button>
            );
          })}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, lang, theme }: { project: ProjectItem; lang: Language; theme: Theme }) => {
  const IconComponent = projectIconMap[project.icon] ?? Layers;

  return (
    <div
      className={`group relative border rounded-xl p-6 transition-all duration-300 flex flex-col h-full hover:shadow-lg ${
        theme === "dark"
          ? "bg-[#0a0a0a] border-neutral-900 hover:border-neutral-700 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]"
          : "bg-white border-neutral-200 hover:border-teal-500/30 hover:shadow-teal-900/5"
      }`}
    >
      <div className="mb-6">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
            theme === "dark"
              ? "border-teal-500/60 bg-neutral-900 text-neutral-300 group-hover:border-teal-400/80"
              : "border-teal-400/70 bg-teal-50 text-teal-700 group-hover:border-teal-400/90"
          }`}
        >
          <IconComponent size={24} strokeWidth={1.5} />
        </div>
      </div>

      <h3
        className={`text-lg font-semibold mb-2 ${
          theme === "dark"
            ? "text-neutral-200 group-hover:text-white"
            : "text-neutral-800 group-hover:text-teal-700"
        }`}
      >
        {project.title}
      </h3>
      <RichText
        text={project.desc}
        className={`text-sm leading-relaxed mb-6 flex-grow ${
          theme === "dark" ? "text-neutral-500" : "text-neutral-600"
        }`}
        linkClassName={
          theme === "dark"
            ? "text-teal-400 underline underline-offset-4 hover:text-white"
            : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
        }
      />

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
  readMoreLabel,
}: {
  post: BlogEntry;
  lang: Language;
  theme: Theme;
  readMoreLabel: string;
}) => {
  const link = post.url?.trim() ? post.url : `/${lang}/blog`;
  const external = Boolean(post.url && /^https?:/i.test(post.url));
  const coverImage = post.image?.trim() || "/blog/default.svg";
  return (
    <article
      className={`group flex gap-4 rounded-2xl px-3 py-3 transition-colors ${
        theme === "dark" ? "hover:bg-neutral-900/50" : "hover:bg-white"
      }`}
    >
      <div
        className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border ${
          theme === "dark" ? "border-neutral-800 bg-neutral-900/50" : "border-neutral-200 bg-white"
        }`}
      >
        <Image
          src={coverImage}
          alt={`${post.title} cover`}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-4">
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
        <RichText
          text={post.summary}
          className={`text-sm ${
            theme === "dark" ? "text-neutral-500" : "text-neutral-600"
          }`}
          linkClassName={
            theme === "dark"
              ? "text-teal-400 underline underline-offset-4 hover:text-white"
              : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
          }
        />
        <a
          href={link}
          className={`text-xs font-semibold uppercase tracking-[0.25em] ${
            theme === "dark" ? "text-teal-400" : "text-teal-600"
          }`}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {readMoreLabel} &rarr;
        </a>
      </div>
    </article>
  );
};

const ExperienceCard = ({
  item,
  theme,
}: {
  item: LandingContent["experience"]["roles"][number];
  theme: Theme;
}) => {
  const logoAlt = item.companyLogoAlt ?? item.company ?? "Company logo";
  const showCompanyLogo = Boolean(item.companyLogo);
  const logoContainerStyle =
    theme === "dark"
      ? "border-neutral-800 bg-neutral-900"
      : "border-neutral-200 bg-white";

  return (
    <div
      className={`border rounded-2xl p-6 transition-colors ${
        theme === "dark" ? "bg-[#0a0a0a] border-neutral-900" : "bg-white border-neutral-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {showCompanyLogo && (
            <div
              className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border p-2 ${
                logoContainerStyle
              }`}
            >
              <Image
                src={item.companyLogo!}
                alt={logoAlt}
                width={48}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
          )}
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
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
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
};

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
  const assistantGreeting =
    lang === "en"
      ? "Hi! I'm Ivan's AI Assistant. Ask me anything about his experience or skills."
      : "¡Hola! Soy el asistente IA de Iván. Pregúntame lo que quieras sobre su experiencia o habilidades.";
  const [isOpen, setIsOpen] = useState(isInline);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>(() =>
    isInline
      ? []
      : [
          {
            role: "model",
            text: assistantGreeting,
          },
        ]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getBubbleClasses = (role: "user" | "model") => {
    const base = "max-w-[80%] rounded-2xl px-4 py-2 text-sm transition-shadow duration-200 shadow-[0_20px_40px_rgba(0,0,0,0.25)]";
    if (role === "user") {
      return `${base} ${
        theme === "dark"
          ? "bg-gradient-to-br from-teal-500/80 to-teal-400/80 text-neutral-950 shadow-[0_20px_40px_rgba(16,185,129,0.4)]"
          : "bg-gradient-to-br from-neutral-900 to-teal-400 text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)]"
      }`;
    }
    return `${base} ${
      theme === "dark"
        ? "bg-neutral-900/90 border border-white/10 text-teal-100"
        : "bg-white border border-neutral-200 text-neutral-900"
    }`;
  };

  useEffect(() => {
    if (isInline) return;
    scrollToBottom();
  }, [messages, isOpen, isInline]);

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

    const reply = await callGrokAssistant({
      prompt: userMsg,
      systemInstruction: systemContext,
      fallback: () => getFallbackResponse(userMsg, lang),
    });

    setMessages((prev) => [...prev, { role: "model", text: reply }]);
    setIsLoading(false);
  };

  if (isInline) {
    const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "model");
    return (
      <div className="space-y-3">
        <div
          className={`flex gap-3 rounded-[28px] border px-4 py-3 backdrop-blur-2xl transition ${
            theme === "dark"
              ? "bg-black/40 border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.45)]"
              : "bg-white/90 border-neutral-200 shadow-[0_25px_65px_rgba(15,23,42,0.12)]"
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSend()}
            placeholder={lang === "en" ? "Ask anything about me" : "Pregunta sobre mis skills..."}
            className={`flex-1 bg-transparent text-sm focus:ring-0 focus:outline-none ${
              theme === "dark" ? "text-white placeholder:text-neutral-500" : "text-neutral-900 placeholder:text-neutral-400"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              theme === "dark"
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-black hover:from-teal-400 hover:to-emerald-400"
                : "bg-black text-white hover:bg-neutral-900 disabled:bg-neutral-300"
            } disabled:cursor-not-allowed`}
          >
            {lang === "en" ? "Send" : "Enviar"}
          </button>
        </div>
        <div className="min-h-[32px] text-sm">
          {isLoading && (
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-teal-400">
              <Loader2 size={16} className="animate-spin" />
              <span>{lang === "en" ? "Thinking..." : "Pensando..."}</span>
            </div>
          )}
          {!isLoading && lastAssistantMessage && (
            <div className={getBubbleClasses("model")}>{lastAssistantMessage.text}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isInline ? "w-full" : "fixed bottom-6 right-6 z-50 flex flex-col items-end"
      }
    >
      {isOpen && (
        <div
          className={`relative border rounded-[32px] overflow-hidden flex flex-col ${
            isInline ? "w-full h-[520px]" : "w-80 md:w-96 h-[400px] mb-4"
          } ${
            theme === "dark"
              ? "bg-gradient-to-b from-[#030712] via-[#090b17] to-[#020511] border-white/10 backdrop-blur-3xl text-neutral-100 shadow-[0_35px_90px_rgba(10,10,10,0.7)]"
              : "bg-white/95 border-neutral-200 text-neutral-900 shadow-[0_40px_80px_rgba(15,23,42,0.25)]"
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: theme === "dark"
                ? "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.4), transparent 45%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.35), transparent 55%)"
                : "radial-gradient(circle at 25% 0%, rgba(14,165,233,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(0,0,0,0.15), transparent 55%)",
            }}
          />
          <div
            className={`relative z-10 p-4 border-b flex justify-between items-center ${
              theme === "dark"
                ? "bg-neutral-900/60 border-neutral-800"
                : "bg-white/95 border-neutral-200"
            }`}
          >
            <div className="flex flex-col gap-0.5">
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
              <span
                className={`text-[10px] tracking-[0.3em] uppercase ${
                  theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                }`}
              >
                Powered by Grok 2
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

          <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`${getBubbleClasses(msg.role)} ${msg.role === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/10 px-3 py-2 shadow-[0_12px_30px_rgba(16,185,129,0.25)]">
                  <Loader2 size={16} className="animate-spin text-teal-400" />
                  <span className="text-xs uppercase tracking-[0.3em] text-teal-200">Thinking</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`relative z-10 p-3 border-t flex gap-2 ${
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
              placeholder={lang === "en" ? "Ask anything about me" : "Pregunta sobre mis skills..."}
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
  const [showAllProjects, setShowAllProjects] = useState(false);
  const t = contentMap[lang];
  const stackSections = t.stack.sections ?? [];
  const blogPostsToRender = t.blogPosts.slice(0, BLOG_PREVIEW_COUNT);
  const previewProjects = t.projectItems.slice(0, PROJECT_PREVIEW_COUNT);
  const projectsToRender = showAllProjects ? t.projectItems : previewProjects;
  const canToggleProjects = t.projectItems.length > previewProjects.length;
  const viewMoreProjectsLabel =
    t.projects.viewMore ?? (lang === "en" ? "View more projects" : "Ver más proyectos");
  const viewLessProjectsLabel =
    t.projects.viewLess ?? (lang === "en" ? "View fewer projects" : "Ver menos proyectos");

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  useEffect(() => {
    setShowAllProjects(false);
  }, [lang]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const nextTheme = {
      bodyFont: t.theme?.bodyFont ?? fallbackThemeSettings.bodyFont,
      headingFont: t.theme?.headingFont ?? fallbackThemeSettings.headingFont,
      monoFont: t.theme?.monoFont ?? fallbackThemeSettings.monoFont,
    };
    root.style.setProperty("--font-body", nextTheme.bodyFont);
    root.style.setProperty("--font-heading", nextTheme.headingFont);
    root.style.setProperty("--font-mono", nextTheme.monoFont);
  }, [t.theme]);

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

          <RichText
            text={t.hero.subheadline}
            className={`text-lg max-w-2xl mb-12 ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
            linkClassName={
              theme === "dark"
                ? "text-teal-400 underline underline-offset-4 hover:text-white"
                : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
            }
          />

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#projects"
              className={`px-8 py-4 font-semibold rounded-full transition-all flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {t.hero.cta}
            </a>
            <a
              href={`mailto:${t.contact.email}`}
              className={`px-8 py-4 font-medium transition-colors border-b border-transparent ${
                theme === "dark"
                  ? "text-neutral-400 hover:text-white hover:border-white"
                  : "text-neutral-600 hover:text-black hover:border-black"
              }`}
            >
              {t.hero.contact}
            </a>
          </div>

          <div className="mt-16">
            <ChatWidget lang={lang} theme={theme} variant="inline" />
          </div>
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
              <RichText
                text={t.about.summary}
                className={`text-xl mb-8 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
                linkClassName={
                  theme === "dark"
                    ? "text-teal-400 underline underline-offset-4 hover:text-white"
                    : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
                }
              />
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
                {t.activity.eyebrow}
              </p>
              <h2
                className={`text-3xl font-bold ${
                  theme === "dark" ? "text-white" : "text-neutral-900"
                }`}
              >
                {t.activity.title}
              </h2>
              <p
                className={`mt-3 max-w-2xl text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {t.activity.description}
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
              {t.activity.profileLabel}
            </a>
          </div>

          <div className="mt-8">
            <GithubContributions
              username={githubUsername}
              theme={theme}
              copy={{
                heatmapLabel: t.activity.heatmapLabel,
                commitsLabel: t.activity.commitsLabel,
                loadingText: t.activity.loadingText,
                errorText: t.activity.errorText,
                tooltipSuffix: t.activity.tooltipSuffix,
              }}
            />
          </div>
        </section>

        <section
          id="experience"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-400">
                Experience
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
            {t.experience.cta && (
              <a
                href="/cv_iacc.pdf"
                download
                className={`px-8 py-3 font-semibold rounded-full transition-all flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                <Download size={16} className="mr-2" />
                {t.experience.cta}
              </a>
            )}
          </div>
          {stackSections.length > 0 && (
            <>
              {t.stack.title && (
                <p className={`mt-6 text-xs tracking-[0.3em] uppercase ${theme === "dark" ? "text-neutral-500" : "text-neutral-500"}`}>
                  {t.stack.title}
                </p>
              )}
              <div className="grid gap-6 mt-8 md:grid-cols-3">
                {stackSections.map((section) => {
                  const Icon = stackIconMap[section.icon] ?? Code2;
                  return (
                    <div
                      key={section.title}
                      className={`rounded-2xl border p-5 ${
                        theme === "dark" ? "bg-[#0a0a0a] border-neutral-900" : "bg-white border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`p-2 rounded-full ${
                            theme === "dark" ? "bg-neutral-900 text-neutral-100" : "bg-teal-50 text-teal-700"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                            {section.title}
                          </p>
                          {section.description && (
                            <p className={`text-xs ${theme === "dark" ? "text-neutral-500" : "text-neutral-500"}`}>
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.items.map((item) => (
                          <TechIcon key={item} label={item} theme={theme} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {t.experience.rolesLabel && (
            <p
              className={`mt-10 mb-6 text-xs tracking-[0.3em] uppercase ${
                theme === "dark" ? "text-neutral-500" : "text-neutral-500"
              }`}
            >
              {t.experience.rolesLabel}
            </p>
          )}

          <div className="grid gap-6 mt-6">
            {t.experience.roles.map((role) => (
              <ExperienceCard key={`${role.role}-${role.period}`} item={role} theme={theme} />
            ))}
          </div>
        </section>

        <section
          id="projects"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                {t.projects.title}
              </h2>
            </div>
          </div>

          {t.projects.description && (
            <RichText
              text={t.projects.description}
              className={`text-sm mb-6 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
              linkClassName={
                theme === "dark"
                  ? "text-teal-400 underline underline-offset-4 hover:text-white"
                  : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
              }
            />
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {projectsToRender.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                theme={theme}
              />
            ))}
          </div>
          {canToggleProjects && (
            <div className="mt-8 text-left">
              <button
                type="button"
                onClick={() => setShowAllProjects((prev) => !prev)}
                aria-expanded={showAllProjects}
                className={`inline-flex items-center text-sm font-medium transition-colors ${
                  theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"
                }`}
              >
                {showAllProjects ? viewLessProjectsLabel : viewMoreProjectsLabel} &rarr;
              </button>
            </div>
          )}
        </section>

        <section
          id="blog"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="max-w-3xl">
            <h2 className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
              {t.blog.title}
            </h2>
            <RichText
              text={t.blog.description}
              className={`text-sm mb-6 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}
              linkClassName={
                theme === "dark"
                  ? "text-teal-400 underline underline-offset-4 hover:text-white"
                  : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
              }
            />
            <div className="flex flex-col">
              {blogPostsToRender.length ? (
                blogPostsToRender.map((post) => (
                  <BlogRow key={post.id} post={post} lang={lang} theme={theme} readMoreLabel={t.blog.readMore} />
                ))
              ) : (
                <p className={`text-sm ${theme === "dark" ? "text-neutral-600" : "text-neutral-500"}`}>{t.blog.empty}</p>
              )}
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
        </section>

        <section
          id="contact"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="max-w-3xl">
            <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
              {t.contact.title}
            </h2>
            <RichText
              text={t.contact.text}
              className={`mb-8 max-w-2xl ${
                theme === "dark" ? "text-neutral-400" : "text-neutral-600"
              }`}
              linkClassName={
                theme === "dark"
                  ? "text-teal-400 underline underline-offset-4 hover:text-white"
                  : "text-teal-600 underline underline-offset-4 hover:text-neutral-900"
              }
            />
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
            <div className="mt-12 flex flex-wrap gap-4">
              {t.contact.socials.map((social) => {
                const Icon = socialIconMap[social.platform] ?? Github;
                return (
                  <div key={social.url} className="relative group overflow-visible">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                        theme === "dark"
                          ? "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                      }`}
                    >
                      <Icon size={20} />
                    </a>
                    <SocialPreviewOverlay platform={social.platform} label={social.label} preview={social.preview} />
                  </div>
                );
              })}
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
      </footer>

    </div>
  );
}
