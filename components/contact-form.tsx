"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fade } from "@/lib/animations";

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

/** Form submission states */
type FormStatus = "idle" | "loading" | "success" | "error";

/** Field validation errors */
interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm({ translations: t, lang }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  /** Validate form fields */
  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = lang === "es" ? "El nombre es requerido" : "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = lang === "es" ? "El email es requerido" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === "es" ? "Email inválido" : "Invalid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = lang === "es" ? "El mensaje es requerido" : "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = lang === "es" ? "El mensaje debe tener al menos 10 caracteres" : "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Handle form submission */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setStatus("error");
      return;
    }

    // Clear errors and set loading state
    setErrors({});
    setStatus("loading");

    // Simulate API call (replace with actual form submission)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success
    setStatus("success");

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setStatus("idle");
    }, 3000);
  };

  /** Handle input changes */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial="visible"
      animate={status === "success" ? "exit" : "visible"}
      variants={fade}
    >
      {/* Name field */}
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
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          placeholder={t.namePlaceholder}
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email field */}
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
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          placeholder={t.emailPlaceholder}
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Message field */}
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
          value={formData.message}
          onChange={handleChange}
          error={!!errors.message}
          rows={5}
          placeholder={t.messagePlaceholder}
          className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-500 flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={status === "loading"}
        disabled={status === "loading" || status === "success"}
      >
        {status === "success" ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {lang === "es" ? "¡Enviado!" : "Sent!"}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t.send}
          </>
        )}
      </Button>

      {/* Success message */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm">
              {lang === "es"
                ? "¡Mensaje enviado exitosamente!"
                : "Message sent successfully!"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
