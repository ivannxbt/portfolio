"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BrainCircuit,
  Loader2,
  Search,
  Send,
  X,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

type Language = Locale;
type Theme = "light" | "dark";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
};

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

const getFallbackResponse = (prompt: string, lang: Language): string => {
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
}): Promise<string> => {
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
      const errorData = await response.json().catch(() => ({}));
      console.error("Chat API error:", response.status, errorData);
      throw new Error(errorData.error || "Chat API error");
    }

    const data = (await response.json()) as { reply?: string; error?: string; warning?: string };

    if (data.error) {
      console.error("API returned error:", data.error);
      return fallback?.() ?? "Unable to generate a response.";
    }

    const reply = data.reply?.trim();

    if (!reply || reply === "No response generated.") {
      if (data.warning) {
        console.warn("API warning:", data.warning);
      }
      return fallback?.() ?? "Unable to generate a response.";
    }

    return reply;
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return fallback?.() ?? "Unable to reach the chat service.";
  }
};

type ChatWidgetProps = {
  lang: Language;
  theme: Theme;
  variant?: "floating" | "inline";
};

export const ChatWidget = React.memo<ChatWidgetProps>(
  ({ lang, theme, variant = "floating" }) => {
    const isInline = variant === "inline";
    const assistantGreeting =
      lang === "en"
        ? "Hi! I'm Ivan's AI Assistant. Ask me anything about his experience or skills."
        : "¡Hola! Soy el asistente IA de Iván. Pregúntame lo que quieras sobre su experiencia o habilidades.";

    const [isOpen, setIsOpen] = useState(isInline);
    const [messages, setMessages] = useState<Message[]>(() =>
      isInline
        ? []
        : [
            {
              id: crypto.randomUUID(),
              role: "model",
              text: assistantGreeting,
              timestamp: Date.now(),
            },
          ]
    );
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const getBubbleClasses = useCallback((role: "user" | "model") => {
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
    }, [theme]);

    useEffect(() => {
      if (isInline) return;
      scrollToBottom();
    }, [messages, isOpen, isInline, scrollToBottom]);

    const handleSend = useCallback(async () => {
      if (!input.trim()) return;

      const userMsg = input;
      setInput("");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          text: userMsg,
          timestamp: Date.now(),
        },
      ]);
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

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: reply,
          timestamp: Date.now(),
        },
      ]);
      setIsLoading(false);
    }, [input, lang]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSend();
      }
    }, [handleSend]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    }, []);

    if (isInline) {
      const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "model");
      return (
        <div className="space-y-4">
          <div
            className={`group flex items-center gap-3 rounded-[32px] border px-5 py-4 backdrop-blur-2xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-br from-black/60 via-neutral-900/50 to-black/60 border-white/10 shadow-[0_25px_65px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_75px_rgba(0,0,0,0.6)] hover:border-white/20"
                : "bg-gradient-to-br from-white/95 via-white/90 to-white/95 border-neutral-200/80 shadow-[0_25px_65px_rgba(15,23,42,0.15)] hover:shadow-[0_30px_80px_rgba(15,23,42,0.2)] hover:border-neutral-300"
            }`}
          >
            <div className={`flex-1 flex items-center gap-3 ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
              <div className={`flex-shrink-0 ${theme === "dark" ? "text-teal-400/60" : "text-teal-600/60"} group-focus-within:text-teal-500 transition-colors`}>
                <Search size={20} strokeWidth={2} />
              </div>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={lang === "en" ? "Ask anything about me..." : "Pregunta sobre mis skills..."}
                className={`flex-1 bg-transparent text-sm font-medium focus:ring-0 focus:outline-none placeholder:font-normal ${
                  theme === "dark"
                    ? "text-white placeholder:text-neutral-500/70"
                    : "text-neutral-900 placeholder:text-neutral-400/80"
                }`}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`group/btn relative flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 transform active:scale-95 ${
                theme === "dark"
                  ? isLoading || !input.trim()
                    ? "bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 text-black shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] hover:scale-105 hover:from-teal-400 hover:via-emerald-400 hover:to-teal-400"
                  : isLoading || !input.trim()
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white shadow-[0_8px_25px_rgba(15,23,42,0.3)] hover:shadow-[0_12px_35px_rgba(15,23,42,0.4)] hover:scale-105 hover:from-neutral-800 hover:via-neutral-700 hover:to-neutral-800"
              }`}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span className="mr-1.5">{lang === "en" ? "Send" : "Enviar"}</span>
                  <Send size={16} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
          <div className="min-h-[40px] text-sm transition-all duration-300">
            {isLoading && (
              <div className={`inline-flex items-center gap-2.5 rounded-2xl px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-teal-500/20 via-emerald-500/15 to-teal-500/20 border border-teal-500/30 text-teal-300 shadow-[0_8px_25px_rgba(16,185,129,0.2)]"
                  : "bg-gradient-to-r from-teal-50 via-emerald-50/50 to-teal-50 border border-teal-200/50 text-teal-700 shadow-[0_8px_25px_rgba(16,185,129,0.15)]"
              }`}>
                <Loader2 size={16} className="animate-spin" />
                <span className="font-medium">{lang === "en" ? "Thinking..." : "Pensando..."}</span>
              </div>
            )}
            {!isLoading && lastAssistantMessage && (
              <div className={`inline-block max-w-[85%] rounded-2xl px-5 py-3.5 backdrop-blur-xl transition-all duration-300 ${
                lastAssistantMessage.text === "No response generated." || lastAssistantMessage.text.toLowerCase().includes("unable")
                  ? theme === "dark"
                    ? "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/20 text-amber-200 shadow-[0_12px_35px_rgba(245,158,11,0.15)]"
                    : "bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-50 border border-amber-200/50 text-amber-800 shadow-[0_12px_35px_rgba(245,158,11,0.1)]"
                  : theme === "dark"
                    ? "bg-gradient-to-br from-neutral-800/90 via-neutral-800/80 to-neutral-900/90 border border-white/10 text-neutral-100 shadow-[0_12px_35px_rgba(0,0,0,0.4)]"
                    : "bg-gradient-to-br from-white via-neutral-50/90 to-white border border-neutral-200/80 text-neutral-900 shadow-[0_12px_35px_rgba(15,23,42,0.15)]"
              }`}>
                <div className="flex items-start gap-2.5">
                  <div className={`flex-shrink-0 mt-0.5 ${
                    lastAssistantMessage.text === "No response generated." || lastAssistantMessage.text.toLowerCase().includes("unable")
                      ? theme === "dark" ? "text-amber-400" : "text-amber-600"
                      : theme === "dark" ? "text-teal-400" : "text-teal-600"
                  }`}>
                    <BrainCircuit size={16} strokeWidth={2} />
                  </div>
                  <p className="leading-relaxed">
                    {lastAssistantMessage.text === "No response generated."
                      ? (lang === "en"
                          ? "I'm having trouble generating a response right now. Please try rephrasing your question or ask about my experience, skills, or projects."
                          : "Tengo problemas para generar una respuesta ahora mismo. Por favor, intenta reformular tu pregunta o pregunta sobre mi experiencia, habilidades o proyectos.")
                      : lastAssistantMessage.text.toLowerCase().includes("unable")
                      ? (lang === "en"
                          ? "I'm currently unable to process your request. Please try again in a moment or ask about my background, skills, or projects."
                          : "No puedo procesar tu solicitud en este momento. Por favor, intenta de nuevo en un momento o pregunta sobre mi experiencia, habilidades o proyectos.")
                      : lastAssistantMessage.text}
                  </p>
                </div>
              </div>
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
              className={`relative z-10 p-4 border-b flex justify-between items-center backdrop-blur-xl ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neutral-900/80 via-neutral-900/60 to-neutral-900/80 border-neutral-800/50"
                  : "bg-gradient-to-r from-white/95 via-white/90 to-white/95 border-neutral-200/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`relative flex-shrink-0 ${theme === "dark" ? "text-teal-400" : "text-teal-600"}`}>
                  <BrainCircuit size={20} strokeWidth={2} />
                  <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse ${theme === "dark" ? "ring-2 ring-teal-500/50" : "ring-2 ring-teal-500/30"}`} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-sm ${
                        theme === "dark" ? "text-neutral-100" : "text-neutral-900"
                      }`}
                    >
                      Iván.AI Assistant
                    </span>
                  </div>
                  <span
                    className={`text-[10px] tracking-[0.3em] uppercase font-medium ${
                      theme === "dark" ? "text-neutral-500" : "text-neutral-400"
                    }`}
                  >
                    Powered by Grok 2
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
                  theme === "dark"
                    ? "text-neutral-500 hover:text-white hover:bg-neutral-800/50"
                    : "text-neutral-400 hover:text-black hover:bg-neutral-100/80"
                }`}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "model" && (
                    <div className={`flex-shrink-0 mb-1 ${theme === "dark" ? "text-teal-400/80" : "text-teal-600/80"}`}>
                      <BrainCircuit size={16} strokeWidth={2} />
                    </div>
                  )}
                  <div className={`${getBubbleClasses(msg.role)} ${msg.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"} transition-all duration-300`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className={`flex-shrink-0 mb-1 ${theme === "dark" ? "text-neutral-500" : "text-neutral-400"}`}>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-xs font-bold text-neutral-900">
                        I
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center gap-2">
                  <div className={`flex-shrink-0 ${theme === "dark" ? "text-teal-400/80" : "text-teal-600/80"}`}>
                    <BrainCircuit size={16} strokeWidth={2} />
                  </div>
                  <div className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 backdrop-blur-xl transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gradient-to-r from-teal-500/20 via-emerald-500/15 to-teal-500/20 border border-teal-500/30 text-teal-300 shadow-[0_8px_25px_rgba(16,185,129,0.2)]"
                      : "bg-gradient-to-r from-teal-50 via-emerald-50/50 to-teal-50 border border-teal-200/50 text-teal-700 shadow-[0_8px_25px_rgba(16,185,129,0.15)]"
                  }`}>
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs font-medium uppercase tracking-wider">{lang === "en" ? "Thinking" : "Pensando"}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              className={`relative z-10 p-4 border-t flex gap-3 ${
                theme === "dark"
                  ? "border-neutral-800/50 bg-gradient-to-t from-neutral-900/60 to-transparent"
                  : "border-neutral-200/80 bg-gradient-to-t from-neutral-50/80 to-transparent"
              }`}
            >
              <div className="flex-1 flex items-center gap-3">
                <div className={`flex-shrink-0 ${theme === "dark" ? "text-teal-400/60" : "text-teal-600/60"}`}>
                  <Search size={18} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === "en" ? "Ask anything about me..." : "Pregunta sobre mis skills..."}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all border ${
                    theme === "dark"
                      ? "bg-neutral-950/80 border-neutral-800 text-white placeholder:text-neutral-500/70 focus:border-teal-500/50"
                      : "bg-white/90 border-neutral-200 text-neutral-900 placeholder:text-neutral-400/80 focus:border-teal-500/50"
                  }`}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className={`group/btn relative flex items-center justify-center p-2.5 rounded-full transition-all duration-300 transform active:scale-95 ${
                  isLoading || !input.trim()
                    ? theme === "dark"
                      ? "bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : theme === "dark"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-black shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.5)] hover:scale-110 hover:from-teal-400 hover:to-emerald-400"
                      : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.4)] hover:scale-110 hover:from-teal-500 hover:to-emerald-500"
                }`}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChatWidget.displayName = "ChatWidget";
