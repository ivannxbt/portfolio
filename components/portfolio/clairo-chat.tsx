"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, X, Trash2, Sparkles } from "lucide-react";
import Image from "next/image";
import { spring } from "@/lib/animations";
import { Portal } from "@/components/portal";
import { AnimatedBorderContainer } from "@/components/portfolio/animated-border-container";
import type { Language, Theme, Message } from "@/lib/types";
import {
  getFallbackResponse,
  callAIAssistant,
} from "@/lib/chat-fallbacks";

type ClairoProps = {
  lang: Language;
  theme: Theme;
};

// Session storage key for message persistence across re-mounts
const MESSAGES_STORAGE_KEY = "clairo-chat-messages";

// Helper to safely read from sessionStorage (client-only)
const loadMessages = (): Message[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to safely write to sessionStorage
const saveMessages = (messages: Message[]) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage quota exceeded or disabled - gracefully fail
  }
};

// Helper to clear chat history (useful for debugging)
export const clearChatHistory = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(MESSAGES_STORAGE_KEY);
  }
};

export const ClairoChat = React.memo<ClairoProps>(({ lang, theme }) => {

  // Component state - initialize from sessionStorage to prevent duplicates on re-mount
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // New state for behavior
  const [hasInteracted, setHasInteracted] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Persist messages to sessionStorage (Strict Mode safe - idempotent)
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Auto-scroll effect (Strict Mode safe - no side effects)
  useEffect(() => {
    if (sidebarOpen) {
      scrollToBottom();
    }
  }, [messages, sidebarOpen, scrollToBottom]);

  // Handle message send
  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    // CRITICAL: Open sidebar ONLY when user sends first message
    if (!hasInteracted) {
      setHasInteracted(true);
      setSidebarOpen(true);
    }

    // Add user message
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

    // Call API with language parameter
    const reply = await callAIAssistant({
      prompt: userMsg,
      language: lang,
      fallback: () => getFallbackResponse(userMsg, lang),
    });

    // Add AI response
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
  }, [input, lang, hasInteracted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const clearMessages = useCallback(() => {
    setMessages([]);
    setHasInteracted(false);
    clearChatHistory();
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // If no interaction yet, show the floating pill
  const showFloatingPill = !hasInteracted && !sidebarOpen;

  return (
    <Portal>
      {/* 1. Floating Pill (Initial State) */}
      <AnimatePresence>
        {showFloatingPill && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-2xl group"
          >
            <AnimatedBorderContainer
              className="rounded-3xl shadow-2xl overflow-hidden"
              borderWidth={1}
            >
              <div
                className={`relative flex items-center gap-3 px-6 py-4 transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-[#0a0a0a]/90 hover:bg-[#0a0a0a]/95"
                    : "bg-white/90 hover:bg-white/95"
                } backdrop-blur-xl`}
              >
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`absolute inset-0 rounded-full blur-md opacity-40 ${
                    theme === "dark" ? "bg-teal-500" : "bg-teal-400"
                  }`} />
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border ${
                    theme === "dark"
                      ? "bg-neutral-900 border-neutral-700 text-teal-400"
                      : "bg-white border-neutral-200 text-teal-600"
                  }`}>
                    <Sparkles size={18} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Input Area */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      lang === "en"
                        ? "Ask Clairo anything about my work..."
                        : "Pregúntale a Clairo sobre mi trabajo..."
                    }
                    className={`w-full bg-transparent border-none outline-none text-base font-medium placeholder:font-normal transition-colors ${
                      theme === "dark"
                        ? "text-white placeholder:text-neutral-500"
                        : "text-neutral-900 placeholder:text-neutral-400"
                    }`}
                  />
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`p-2 rounded-full transition-all duration-300 transform ${
                    input.trim()
                      ? theme === "dark"
                        ? "bg-teal-500 text-neutral-900 shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95"
                        : "bg-neutral-900 text-white shadow-lg hover:scale-105 active:scale-95"
                      : "bg-transparent text-neutral-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </AnimatedBorderContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Chat Sidebar (Expanded State) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 right-0 z-[70] w-full md:w-[450px] shadow-2xl border-l backdrop-blur-xl ${
              theme === "dark"
                ? "bg-[#0a0a0a]/95 border-neutral-800"
                : "bg-white/95 border-neutral-200"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div
                className={`flex items-center justify-between px-6 py-4 border-b ${
                  theme === "dark" ? "border-neutral-800" : "border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-sm opacity-50 ${
                      theme === "dark" ? "bg-teal-500" : "bg-teal-400"
                    }`} />
                    <Image
                      src="/icons/ivan-orb.svg"
                      alt="Clairo"
                      width={32}
                      height={32}
                      className="relative rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}>
                      Clairo AI
                    </h3>
                    <p className="text-xs text-teal-500 font-medium">
                      {lang === "en" ? "Online" : "En línea"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                {/* Clear Chat Button */}
                {messages.length > 0 && (
                  <motion.button
                    onClick={clearMessages}
                    aria-label={lang === "en" ? "Clear chat" : "Limpiar chat"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      theme === "dark"
                        ? "text-neutral-500 hover:text-red-400 hover:bg-neutral-800/60"
                        : "text-neutral-400 hover:text-red-600 hover:bg-neutral-100"
                    }`}
                    title={lang === "en" ? "Clear conversation" : "Limpiar conversación"}
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </motion.button>
                )}
                {/* Close Button */}
                <motion.button
                onClick={closeSidebar}
                aria-label={lang === "en" ? "Close chat" : "Cerrar chat"}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={spring.responsive}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                    : "text-neutral-400 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <X size={18} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Empty State */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center px-6"
                >
                  <Image
                    src="/icons/ivan-orb.svg"
                    alt="Clairo"
                    width={64}
                    height={64}
                    className="opacity-40 mb-4"
                  />
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {lang === "en"
                      ? "Send a message to start chatting"
                      : "Envía un mensaje para comenzar"}
                  </p>
                </motion.div>
              )}

              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start items-start"}`}
                  >
                    {/* AI Avatar */}
                    {msg.role === "model" && (
                      <div className="flex-shrink-0 mt-1">
                        <Image
                          src="/icons/ivan-orb.svg"
                          alt="Clairo"
                          width={20}
                          height={20}
                          className={theme === "dark" ? "opacity-80" : "opacity-70"}
                        />
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? theme === "dark"
                            ? "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/20"
                            : "bg-gradient-to-br from-neutral-800 to-neutral-900 text-white shadow-neutral-900/20"
                          : theme === "dark"
                            ? "bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 text-neutral-100"
                            : "bg-white/90 backdrop-blur-sm border border-neutral-200 text-neutral-900"
                      }`}
                    >
                      <p className="leading-relaxed text-sm font-normal">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex justify-start gap-3 items-start"
                  >
                    {/* AI Avatar for typing indicator */}
                    <div className="flex-shrink-0 mt-1">
                      <Image
                        src="/icons/ivan-orb.svg"
                        alt="Clairo"
                        width={20}
                        height={20}
                        className={theme === "dark" ? "opacity-80" : "opacity-70"}
                      />
                    </div>

                    {/* Typing bubble with animated dots */}
                    <div
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 shadow-md ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-teal-500/20 via-emerald-500/15 to-teal-500/20 border border-teal-500/30 text-teal-300 shadow-teal-500/10"
                          : "bg-gradient-to-r from-teal-50 via-emerald-50/50 to-teal-50 border border-teal-200/50 text-teal-700 shadow-teal-200/20"
                      }`}
                    >
                      {/* Animated dots */}
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              theme === "dark" ? "bg-teal-400" : "bg-teal-600"
                            }`}
                            animate={{
                              y: [0, -4, 0],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">
                        {lang === "en" ? "Thinking..." : "Pensando..."}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input at Bottom of Sidebar */}
            <div
              className={`p-4 border-t ${
                theme === "dark"
                  ? "border-neutral-800/50 bg-gradient-to-t from-neutral-900/60 to-transparent"
                  : "border-neutral-200/80 bg-gradient-to-t from-neutral-50/80 to-transparent"
              }`}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={lang === "en" ? "Ask anything..." : "Pregunta lo que quieras..."}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all border backdrop-blur-sm ${
                    theme === "dark"
                      ? "bg-[#1a1a1a]/90 border-neutral-800 text-white placeholder:text-neutral-500/70 focus:border-teal-500/50"
                      : "bg-white/95 border-neutral-200 text-neutral-900 placeholder:text-neutral-400/80 focus:border-teal-500/50"
                  }`}
                  aria-label={lang === "en" ? "Type a message" : "Escribe un mensaje"}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  aria-label={lang === "en" ? "Send message" : "Enviar mensaje"}
                  className={`flex items-center justify-center p-2.5 rounded-full transition-all duration-300 transform active:scale-95 ${
                    isLoading || !input.trim()
                      ? theme === "dark"
                        ? "text-neutral-600 cursor-not-allowed"
                        : "text-neutral-400 cursor-not-allowed"
                      : theme === "dark"
                        ? "text-teal-400 hover:text-teal-300 hover:scale-110"
                        : "text-neutral-700 hover:text-neutral-900 hover:scale-110"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
});

ClairoChat.displayName = "ClairoChat";
