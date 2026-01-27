import type { Language, FallbackProfile } from "@/lib/types";

export const fallbackChatProfile: Record<Language, FallbackProfile> = {
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

export const fallbackTopicMatchers: Array<{
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

export const getFallbackResponse = (prompt: string, lang: Language): string => {
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

export const callAIAssistant = async ({
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
