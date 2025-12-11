import type { Locale } from "@/lib/i18n";

export type Language = Locale;

export type SocialPlatform = "github" | "linkedin" | "twitter";

export interface SocialLink {
  label: string;
  url: string;
  platform: SocialPlatform;
}

export type ProjectIcon = "cloud" | "database" | "layers";

export interface ProjectItem {
  id: number;
  icon: ProjectIcon;
  title: string;
  desc: string;
  tags: string[];
}

export interface BlogEntry {
  id: number;
  date: string;
  title: string;
  summary: string;
  url?: string;
}

export interface LandingContent {
  nav: {
    home: string;
    about: string;
    projects: string;
    blog: string;
    contact: string;
  };
  hero: {
    role: string;
    greeting: string;
    headline: string;
    subheadline: string;
    cta: string;
    contact: string;
  };
  about: {
    title: string;
    summary: string;
    educationTitle: string;
    education1: string;
    education2: string;
  };
  stack: {
    title: string;
  };
  projects: {
    title: string;
    viewAll: string;
  };
  projectItems: ProjectItem[];
  blog: {
    title: string;
    description: string;
    viewAll: string;
    readMore: string;
    empty: string;
  };
  blogPosts: BlogEntry[];
  contact: {
    title: string;
    text: string;
    email: string;
    socials: SocialLink[];
  };
  footer: {
    copyright: string;
  };
}

export type SiteContent = Record<Language, LandingContent>;

export const defaultContent: SiteContent = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
    },
    hero: {
      role: "Telematics Engineer | AI & Data",
      greeting: "Hi, I'm",
      headline: "Turning technology into impactful results.",
      subheadline:
        "Telematics Engineer with deep expertise in AI/ML, DevOps, and Data Engineering. Focused on building scalable intelligent systems using Python, Cloud architectures, and Generative AI.",
      cta: "View Case Studies",
      contact: "Get in touch",
    },
    about: {
      title: "About Me",
      summary:
        "I am a dedicated professional driven by the goal of transforming technology into real-world impact. With a strong foundation in Telematics and continuous learning in emerging AI technologies, I specialize in bridging the gap between complex data models and production-ready software solutions.",
      educationTitle: "Education",
      education1: "M.Eng. Network and Telematic Services (UPM)",
      education2: "B.Eng. Telecommunications Technologies (UPM)",
    },
    stack: {
      title: "Core Competencies",
    },
    projects: {
      title: "Featured Work",
      viewAll: "View Full CV",
    },
    projectItems: [
      {
        id: 1,
        icon: "cloud",
        title: "AI Doc Generation Agent",
        desc: "Designed and deployed an AWS-based agent automating production of 4 dynamic document types, reducing manual effort by 95%.",
        tags: ["AWS", "Python", "LLMs", "Automation"],
      },
      {
        id: 2,
        icon: "database",
        title: "Enterprise RAG Chatbot",
        desc: "Engineered prompting and RAG implementations in Azure, decreasing information retrieval latency by 90% for specialized queries.",
        tags: ["Azure", "RAG", "LangChain", "Python"],
      },
      {
        id: 3,
        icon: "layers",
        title: "Radar ML Optimization",
        desc: "Developed ML models for AESA radar data processing (Eurofighter), improving efficiency by 30% using TensorFlow and PyTorch.",
        tags: ["PyTorch", "TensorFlow", "Signal Proc", "Python"],
      },
    ],
    blog: {
      title: "Latest Insights",
      description:
        "Field notes on agents, data infrastructure, and the AI delivery patterns we deploy with enterprise teams.",
      viewAll: "Read all articles",
      readMore: "Read article",
      empty: "No articles published yet.",
    },
    blogPosts: [
      {
        id: 1,
        date: "2025",
        title: "Internal Model Method (IMM) Development Strategy",
        summary:
          "How we structured IMM delivery with reproducible pipelines, automated validation, and governance hooks for banking teams.",
        url: "https://www.linkedin.com/pulse/imm-delivery-notes-ivan-caaamano/",
      },
      {
        id: 2,
        date: "2024",
        title: "Optimizing Beef Loin Analysis with Deep Learning",
        summary:
          "Lessons learned from designing a CV pipeline that keeps consistency up across protein manufacturing lines.",
      },
      {
        id: 3,
        date: "2023",
        title: "Real-time Data Processing in Defense Systems",
        summary:
          "Telemetry ingestion, denoising, and alerting patterns powering AESA radar analytics for mission-critical ops.",
      },
    ],
    contact: {
      title: "Let's Connect",
      text: "Based in Madrid. Open to collaborations in AI, Data Engineering, and Blockchain projects.",
      email: "ivanncaamano@gmail.com",
      socials: [
        {
          platform: "github",
          label: "GitHub",
          url: "https://github.com/ivannxbt",
        },
        {
          platform: "linkedin",
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/ivancaamano/",
        },
        {
          platform: "twitter",
          label: "X",
          url: "https://x.com/_ivvann",
        },
      ],
    },
    footer: {
      copyright: "? 2025 Iv?n Caama?o. Built with Next.js.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre m?",
      projects: "Proyectos",
      blog: "Blog",
      contact: "Contacto",
    },
    hero: {
      role: "Ingeniero Telem?tico | IA y Datos",
      greeting: "Hola, soy",
      headline: "Transformando tecnolog?a en resultados de impacto.",
      subheadline:
        "Ingeniero Telem?tico con experiencia en IA/ML, DevOps e Ingenier?a de Datos. Enfocado en construir sistemas inteligentes escalables usando Python, arquitecturas Cloud e IA Generativa.",
      cta: "Ver Proyectos",
      contact: "Contactar",
    },
    about: {
      title: "Sobre m?",
      summary:
        "Soy un profesional dedicado, impulsado por el objetivo de transformar la tecnolog?a en impacto real. Con una s?lida base en Telem?tica y aprendizaje continuo en tecnolog?as emergentes de IA, me especializo en conectar modelos de datos complejos con soluciones de software listas para producci?n.",
      educationTitle: "Educaci?n",
      education1: "M?ster en Ingenier?a de Redes y Servicios Telem?ticos (UPM)",
      education2:
        "Grado en Ingenier?a de Tecnolog?as y Serv. de Telecomunicaci?n (UPM)",
    },
    stack: {
      title: "Competencias Clave",
    },
    projects: {
      title: "Trabajos Destacados",
      viewAll: "Ver CV Completo",
    },
    projectItems: [
      {
        id: 1,
        icon: "cloud",
        title: "Agente Generador de Docs IA",
        desc: "Dise?o y despliegue de un agente en AWS automatizando la producci?n de 4 tipos de documentos din?micos, reduciendo el esfuerzo manual un 95%.",
        tags: ["AWS", "Python", "LLMs", "Automatizaci?n"],
      },
      {
        id: 2,
        icon: "database",
        title: "Chatbot RAG Empresarial",
        desc: "Ingenier?a de prompts e implementaci?n RAG en Azure, disminuyendo la latencia de recuperaci?n de informaci?n un 90%.",
        tags: ["Azure", "RAG", "LangChain", "Python"],
      },
      {
        id: 3,
        icon: "layers",
        title: "Optimizaci?n ML para Radares",
        desc: "Desarrollo de modelos ML para procesamiento de datos de radar AESA (Eurofighter), mejorando la eficiencia un 30% con TensorFlow.",
        tags: ["PyTorch", "TensorFlow", "Procesamiento de Se?al", "Python"],
      },
    ],
    blog: {
      title: "?ltimas Publicaciones",
      description:
        "Notas sobre agentes, infraestructura de datos y patrones de entrega de IA que activamos con equipos empresariales.",
      viewAll: "Leer todo",
      readMore: "Leer art?culo",
      empty: "A?n no hay art?culos publicados.",
    },
    blogPosts: [
      {
        id: 1,
        date: "2025",
        title: "Estrategia de Desarrollo del Internal Model Method (IMM)",
        summary:
          "C?mo estructuramos la entrega de IMM con pipelines reproducibles, validaci?n automatizada y gobierno para banca.",
        url: "https://www.linkedin.com/pulse/imm-delivery-notes-ivan-caaamano/",
      },
      {
        id: 2,
        date: "2024",
        title: "Optimizando el An?lisis de Lomo de Vacuno con Deep Learning",
        summary:
          "Lecciones de dise?ar un pipeline de visi?n que mantiene la consistencia en manufactura c?rnica.",
      },
      {
        id: 3,
        date: "2023",
        title: "Procesamiento de Datos en Tiempo Real en Sistemas de Defensa",
        summary:
          "Ingesta, limpieza y alertado para anal?tica de radares AESA en operaciones cr?ticas.",
      },
    ],
    contact: {
      title: "Conectemos",
      text: "Basado en Madrid. Abierto a colaboraciones en proyectos de IA, Ingenier?a de Datos y Blockchain.",
      email: "ivanncaamano@gmail.com",
      socials: [
        {
          platform: "github",
          label: "GitHub",
          url: "https://github.com/ivannxbt",
        },
        {
          platform: "linkedin",
          label: "LinkedIn",
          url: "https://www.linkedin.com/in/ivancaamano/",
        },
        {
          platform: "twitter",
          label: "X",
          url: "https://x.com/_ivvann",
        },
      ],
    },
    footer: {
      copyright: "? 2025 Iv?n Caama?o. Creado con Next.js.",
    },
  },
};
