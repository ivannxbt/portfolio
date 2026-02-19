import type { Language, FallbackProfile } from "@/lib/types";

export const fallbackChatProfile: Record<Language, FallbackProfile> = {
  en: {
    intro:
      "I'm Iván, a Software and AI Engineer specializing in AI/ML, data engineering, and scalable software systems based in Madrid.",
    skills:
      "Core stack: Python, TypeScript, PyTorch, TensorFlow, LangChain, AWS, Azure, Databricks, Docker, Terraform, and modern DevOps practices.",
    experience:
      "Currently at Avvale leading AI automation initiatives. Recent work includes AWS-based document generation agents, Azure RAG chatbots, computer vision for beef loin analysis, IMM risk calculation systems for BBVA via NFQ, and ML optimization for Indra's radar division.",
    education:
      "Master's degree in Network & Telematic Services and Bachelor's in Telecommunications Engineering, both from Universidad Politécnica de Madrid (UPM).",
    location: "Based in Madrid, Spain. Open to remote collaboration on impactful projects.",
    contact:
      "Best reach me at ivanncaamano@gmail.com. Also on GitHub (@ivannxbt), X (@_ivvann), and LinkedIn.",
    availability:
      "Currently leading AI programs at Avvale while open to consulting or advisory opportunities on projects with real-world impact.",
    defaultMessage: "Feel free to ask about my technical skills, experience, projects, or availability.",
  },
  es: {
    intro:
      "Soy Iván, Ingeniero de Software e IA especializado en IA/ML, ingeniería de datos y sistemas de software escalables, con base en Madrid.",
    skills:
      "Stack principal: Python, TypeScript, PyTorch, TensorFlow, LangChain, AWS, Azure, Databricks, Docker, Terraform y prácticas modernas de DevOps.",
    experience:
      "Actualmente en Avvale liderando iniciativas de automatización con IA. Trabajo reciente incluye agentes de generación documental en AWS, chatbots RAG en Azure, visión computacional para análisis de lomos de res, sistemas de cálculo de riesgo IMM para BBVA vía NFQ, y optimización ML para la división de radares de Indra.",
    education:
      "Máster en Servicios de Red y Telemática y Grado en Ingeniería de Telecomunicación, ambos por la Universidad Politécnica de Madrid (UPM).",
    location: "Resido en Madrid, España. Abierto a colaboración remota en proyectos con impacto.",
    contact:
      "Mejor contacto: ivanncaamano@gmail.com. También en GitHub (@ivannxbt), X (@_ivvann) y LinkedIn.",
    availability:
      "Actualmente liderando programas de IA en Avvale, abierto a consultorías o colaboraciones en proyectos con impacto real.",
    defaultMessage: "Pregúntame sobre mis habilidades técnicas, experiencia, proyectos o disponibilidad.",
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

  // Use a more robust matching that respects word boundaries to avoid false positives
  // like "about your" matching "about you".
  const match = fallbackTopicMatchers.find(({ keywords }) =>
    keywords.some((keyword) => {
      // Escape special characters and check for word boundaries
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      return regex.test(normalized);
    })
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
      console.error("Chat API error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });

      // Provide more specific error messages
      const errorMessage =
        errorData.error ||
        (response.status === 500
          ? "The AI service is temporarily unavailable. Using fallback response."
          : response.status === 429
            ? "Too many requests. Please wait a moment."
            : "Chat service error");

      throw new Error(errorMessage);
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
