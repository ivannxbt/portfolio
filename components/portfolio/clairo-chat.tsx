"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Send, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { spring } from "@/lib/animations";
import { Portal } from "@/components/portal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Language, Theme, Message } from "@/lib/types";
import { getFallbackResponse, callAIAssistant } from "@/lib/chat-fallbacks";

type ClairoProps = {
  lang: Language;
  theme: Theme;
};

const MESSAGES_STORAGE_KEY = "clairo-chat-messages";

const loadMessages = (): Message[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveMessages = (messages: Message[]) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage quota exceeded or disabled.
  }
};

export const clearChatHistory = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(MESSAGES_STORAGE_KEY);
  }
};

export const ClairoChat = React.memo<ClairoProps>(({ lang, theme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (sidebarOpen) {
      scrollToBottom();
    }
  }, [messages, sidebarOpen, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    if (!hasInteracted) {
      setHasInteracted(true);
      setSidebarOpen(true);
    }

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

    const reply = await callAIAssistant({
      prompt: userMsg,
      language: lang,
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
  }, [input, hasInteracted, lang]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    },
    [handleSend, sidebarOpen],
  );

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    clearChatHistory();
  }, []);

  useEffect(() => {
    if (!sidebarOpen || !inputRef.current) return;
    const rafId = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(rafId);
  }, [sidebarOpen]);

  return (
    <Portal>
      <div className="z-modal safe-bottom safe-left safe-right fixed inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-2xl">
          <div
            className={`transition-colors duration-200 ${
              theme === "brutal"
                ? "border-3 border-black bg-white"
                : theme === "dark"
                  ? "rounded-3xl border border-white/10 bg-neutral-950/85 shadow-lg backdrop-blur-sm"
                  : "rounded-3xl border border-neutral-200/60 bg-white/95 shadow-lg backdrop-blur-sm"
            }`}
          >
            <motion.div
              animate={{ scale: isFocused ? 1.01 : 1 }}
              transition={spring.responsive}
              className="relative flex items-center gap-3 rounded-full px-6 py-4 transition-transform duration-200"
            >
              <motion.button
                type="button"
                className="flex-shrink-0 cursor-pointer border-0 bg-transparent p-0"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={spring.responsive}
                onClick={() => inputRef.current?.focus()}
                aria-label={
                  lang === "en" ? "Focus chat input" : "Enfocar campo de chat"
                }
              >
                <Image
                  src="/icons/ivan-orb.svg"
                  alt="Clairo"
                  width={24}
                  height={24}
                  className={theme === "dark" ? "opacity-90" : "opacity-80"}
                />
              </motion.button>

              <input
                ref={inputRef}
                type="text"
                name="clairo-message"
                autoComplete="off"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  lang === "en"
                    ? "> Ask me anything..."
                    : "> Pregúntame lo que sea..."
                }
                className={`flex-1 bg-transparent font-mono text-sm placeholder:font-mono focus:ring-0 focus:outline-none ${
                  theme === "dark"
                    ? "text-white placeholder:text-neutral-500/70"
                    : "text-neutral-900 placeholder:text-neutral-400/80"
                }`}
                aria-label={
                  lang === "en" ? "Chat with Clairo" : "Chatea con Clairo"
                }
              />

              <motion.button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label={lang === "en" ? "Send message" : "Enviar mensaje"}
                whileHover={!isLoading && input.trim() ? { scale: 1.1 } : {}}
                whileTap={!isLoading && input.trim() ? { scale: 0.95 } : {}}
                transition={spring.responsive}
                className={`flex items-center justify-center rounded-full p-2.5 transition-colors duration-200 ${
                  theme === "dark"
                    ? isLoading || !input.trim()
                      ? "cursor-not-allowed text-neutral-600"
                      : "text-teal-400 hover:text-teal-300"
                    : isLoading || !input.trim()
                      ? "cursor-not-allowed text-neutral-400"
                      : "text-neutral-700 hover:text-neutral-900"
                }`}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={2.5} />
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="z-toast safe-top safe-right safe-bottom fixed top-0 right-0 h-dvh w-full md:w-[40%] md:max-w-[600px] md:min-w-[400px]"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 },
            }}
          >
            <div
              className={`h-full ${
                theme === "dark"
                  ? "border-l border-white/10 bg-neutral-900/95 shadow-lg backdrop-blur-sm"
                  : "border-l border-neutral-200/80 bg-white/95 shadow-lg backdrop-blur-sm"
              }`}
            >
              <div
                className={`flex h-full flex-col ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}
              >
                <div
                  className={`flex items-center justify-between border-b p-6 transition-opacity duration-200 ${
                    theme === "dark"
                      ? "border-neutral-800/40 bg-neutral-900/50"
                      : "border-neutral-200/60 bg-white/50"
                  } ${isLoading ? "opacity-90" : ""}`}
                >
                  <div className="flex items-center gap-3.5">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={spring.responsive}
                    >
                      <Image
                        src="/icons/ivan-orb.svg"
                        alt="Clairo"
                        width={28}
                        height={28}
                        className={
                          theme === "dark" ? "opacity-90" : "opacity-80"
                        }
                      />
                    </motion.div>
                    <span
                      className={`text-base font-bold ${theme === "dark" ? "text-neutral-50" : "text-neutral-950"}`}
                    >
                      Clairo
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <motion.button
                            aria-label={
                              lang === "en" ? "Clear chat" : "Limpiar chat"
                            }
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`rounded-lg p-2 transition-colors duration-200 ${
                              theme === "dark"
                                ? "text-neutral-500 hover:bg-neutral-800/60 hover:text-red-400"
                                : "text-neutral-400 hover:bg-neutral-100 hover:text-red-600"
                            }`}
                            title={
                              lang === "en"
                                ? "Clear conversation"
                                : "Limpiar conversación"
                            }
                          >
                            <Trash2 size={16} strokeWidth={2.5} />
                          </motion.button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {lang === "en"
                                ? "Clear conversation?"
                                : "¿Limpiar conversación?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {lang === "en"
                                ? "This action removes your chat history from this session."
                                : "Esta acción elimina el historial del chat en esta sesión."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {lang === "en" ? "Cancel" : "Cancelar"}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={clearMessages}>
                              {lang === "en" ? "Clear" : "Limpiar"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    <motion.button
                      onClick={closeSidebar}
                      aria-label={lang === "en" ? "Close chat" : "Cerrar chat"}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      transition={spring.responsive}
                      className={`rounded-lg p-2 transition-colors duration-200 ${
                        theme === "dark"
                          ? "text-neutral-400 hover:bg-neutral-800/60 hover:text-white"
                          : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
                      }`}
                    >
                      <X size={18} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto p-6">
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex h-full flex-col items-center justify-center px-6 text-center"
                    >
                      <Image
                        src="/icons/ivan-orb.svg"
                        alt="Clairo"
                        width={64}
                        height={64}
                        className="mb-4 opacity-40"
                      />
                      <p
                        className={`text-sm text-pretty ${theme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}
                      >
                        {lang === "en"
                          ? "Send a message to start chatting"
                          : "Envía un mensaje para comenzar"}
                      </p>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.focus()}
                        className="mt-4 rounded-full border border-teal-500 px-4 py-2 text-xs font-medium text-teal-500 transition-colors duration-200 hover:bg-teal-500/10"
                      >
                        {lang === "en"
                          ? "Ask about projects"
                          : "Pregunta sobre proyectos"}
                      </button>
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
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "items-start justify-start"}`}
                      >
                        {msg.role === "model" && (
                          <div className="mt-1 flex-shrink-0">
                            <Image
                              src="/icons/ivan-orb.svg"
                              alt="Clairo"
                              width={20}
                              height={20}
                              className={
                                theme === "dark" ? "opacity-80" : "opacity-70"
                              }
                            />
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            msg.role === "user"
                              ? theme === "dark"
                                ? "bg-teal-600 text-white"
                                : "bg-neutral-900 text-white"
                              : theme === "dark"
                                ? "border border-neutral-700/50 bg-neutral-800 text-neutral-100"
                                : "border border-neutral-200 bg-white text-neutral-900"
                          }`}
                        >
                          <p className="text-sm leading-relaxed font-normal text-pretty">
                            {msg.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-start justify-start gap-3"
                    >
                      <div className="mt-1 flex-shrink-0">
                        <Image
                          src="/icons/ivan-orb.svg"
                          alt="Clairo"
                          width={20}
                          height={20}
                          className={
                            theme === "dark" ? "opacity-80" : "opacity-70"
                          }
                        />
                      </div>

                      <div
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                          theme === "dark"
                            ? "border border-teal-500/30 bg-neutral-900 text-teal-300"
                            : "border border-teal-200 bg-teal-50 text-teal-700"
                        }`}
                      >
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-xs font-medium">
                          {lang === "en" ? "Thinking..." : "Pensando..."}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div
                  className={`border-t p-4 ${
                    theme === "dark"
                      ? "border-neutral-800/50 bg-neutral-900/60"
                      : "border-neutral-200/80 bg-neutral-50/80"
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="clairo-sidebar-message"
                      autoComplete="off"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        lang === "en"
                          ? "Ask anything..."
                          : "Pregunta lo que quieras..."
                      }
                      className={`flex-1 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-teal-500/30 focus:outline-none ${
                        theme === "dark"
                          ? "border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-500/70 focus:border-teal-500/50"
                          : "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400/80 focus:border-teal-500/50"
                      }`}
                      aria-label={
                        lang === "en" ? "Type a message" : "Escribe un mensaje"
                      }
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      aria-label={
                        lang === "en" ? "Send message" : "Enviar mensaje"
                      }
                      className={`flex items-center justify-center rounded-full p-2.5 transition-transform duration-200 active:scale-95 ${
                        isLoading || !input.trim()
                          ? theme === "dark"
                            ? "cursor-not-allowed text-neutral-600"
                            : "cursor-not-allowed text-neutral-400"
                          : theme === "dark"
                            ? "text-teal-400 hover:scale-110 hover:text-teal-300"
                            : "text-neutral-700 hover:scale-110 hover:text-neutral-900"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
});

ClairoChat.displayName = "ClairoChat";
