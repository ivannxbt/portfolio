"use client";

import React, { useState, useRef, useCallback } from "react";
import { Send, Sparkles, Loader2, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
};

type AIAssistantProps = {
  lang: Locale;
  theme?: "light" | "dark";
  placeholder?: string;
  systemPrompt?: string;
};

const DEFAULT_PROMPTS = {
  en: {
    placeholder: "Ask me anything about my work, skills, or experience...",
    thinking: "Thinking...",
    send: "Send",
    error: "Unable to process your request. Please try again.",
  },
  es: {
    placeholder: "Pregúntame sobre mi trabajo, habilidades o experiencia...",
    thinking: "Pensando...",
    send: "Enviar",
    error: "No se pudo procesar tu solicitud. Por favor intenta de nuevo.",
  },
};

const DEFAULT_SYSTEM_PROMPT = {
  en: `You are an AI assistant for a professional portfolio website.
Answer questions about the person's background, skills, experience, and projects.
Be concise (2-4 sentences), professional, and enthusiastic.
If asked about unrelated topics, politely decline and suggest relevant questions.`,
  es: `Eres un asistente de IA para un portafolio profesional.
Responde preguntas sobre la experiencia, habilidades y proyectos de la persona.
Sé conciso (2-4 oraciones), profesional y entusiasta.
Si te preguntan sobre temas no relacionados, declina educadamente y sugiere preguntas relevantes.`,
};

async function streamChat(params: {
  message: string;
  systemInstruction: string;
  onChunk: (text: string) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: params.message,
        systemInstruction: params.systemInstruction,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response stream");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      params.onChunk(chunk);
    }

    params.onComplete();
  } catch (error) {
    console.error("Chat error:", error);
    params.onError(
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

export function AIAssistant({
  lang = "en",
  theme = "dark",
  placeholder,
  systemPrompt,
}: AIAssistantProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const texts = DEFAULT_PROMPTS[lang];
  const systemInstruction = systemPrompt || DEFAULT_SYSTEM_PROMPT[lang];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsExpanded(true);

    const assistantMessageId = crypto.randomUUID();
    let assistantText = "";

    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        text: "",
        timestamp: Date.now(),
      },
    ]);

    await streamChat({
      message: userMessage.text,
      systemInstruction,
      onChunk: (chunk) => {
        assistantText += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: assistantText }
              : msg
          )
        );
        scrollToBottom();
      },
      onComplete: () => {
        setIsLoading(false);
        scrollToBottom();
      },
      onError: (error) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, text: texts.error }
              : msg
          )
        );
        setIsLoading(false);
      },
    });
  }, [input, isLoading, systemInstruction, texts.error, scrollToBottom]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setIsExpanded(false);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Conversation History */}
      {isExpanded && messages.length > 0 && (
        <div
          className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
            theme === "dark"
              ? "bg-zinc-950/50 border-zinc-800"
              : "bg-white/90 border-zinc-200"
          }`}
        >
          <div
            className={`flex items-center justify-between px-4 py-3 border-b ${
              theme === "dark" ? "border-zinc-800" : "border-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles
                size={16}
                className={
                  theme === "dark" ? "text-teal-400" : "text-teal-600"
                }
              />
              <span
                className={`text-sm font-medium ${
                  theme === "dark" ? "text-zinc-300" : "text-zinc-700"
                }`}
              >
                Conversation
              </span>
            </div>
            <button
              onClick={clearConversation}
              className={`p-1 rounded-md transition-colors ${
                theme === "dark"
                  ? "hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
                  : "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
              }`}
              aria-label="Clear conversation"
            >
              <X size={16} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? theme === "dark"
                        ? "bg-teal-500/90 text-zinc-950"
                        : "bg-zinc-900 text-white"
                      : theme === "dark"
                        ? "bg-zinc-800/80 text-zinc-100"
                        : "bg-zinc-100 text-zinc-900"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div
        className={`relative rounded-full border backdrop-blur-md transition-all duration-300 ${
          theme === "dark"
            ? "bg-zinc-950/80 border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            : "bg-white/95 border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
        } ${isExpanded ? "shadow-2xl" : "hover:shadow-xl"}`}
      >
        <div className="flex items-center gap-3 px-5 py-3.5">
          <div
            className={`flex-shrink-0 ${
              theme === "dark" ? "text-teal-400/60" : "text-teal-600/60"
            }`}
          >
            <Sparkles size={20} strokeWidth={2} />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => messages.length > 0 && setIsExpanded(true)}
            placeholder={placeholder || texts.placeholder}
            disabled={isLoading}
            className={`flex-1 bg-transparent text-sm font-medium placeholder:font-normal focus:outline-none ${
              theme === "dark"
                ? "text-zinc-100 placeholder:text-zinc-500"
                : "text-zinc-900 placeholder:text-zinc-400"
            }`}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`flex-shrink-0 flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 transform active:scale-95 ${
              !input.trim() || isLoading
                ? theme === "dark"
                  ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : theme === "dark"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-zinc-950 shadow-[0_4px_16px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] hover:scale-105"
                  : "bg-gradient-to-r from-zinc-900 to-zinc-800 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:scale-105"
            }`}
            aria-label={texts.send}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">{texts.thinking}</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{texts.send}</span>
                <Send size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Powered by indicator */}
      <div className="text-center">
        <span
          className={`text-[10px] tracking-wider uppercase font-medium ${
            theme === "dark" ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          {process.env.NEXT_PUBLIC_AI_PROVIDER === "claude"
            ? "Powered by Claude"
            : "Powered by Grok 2"}
        </span>
      </div>
    </div>
  );
}
