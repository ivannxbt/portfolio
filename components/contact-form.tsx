"use client";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  translations: {
    name: string;
    email: string;
    message: string;
    send: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
  };
  lang: string;
}

export function ContactForm({ translations: t, lang }: ContactFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(lang === "es" ? "¡Mensaje enviado!" : "Message sent!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          {t.name}
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder={t.namePlaceholder}
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          {t.email}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder={t.emailPlaceholder}
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-zinc-300 mb-2"
        >
          {t.message}
        </label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <Button type="submit" size="lg" className="w-full">
        <Send className="mr-2 h-4 w-4" />
        {t.send}
      </Button>
    </form>
  );
}
