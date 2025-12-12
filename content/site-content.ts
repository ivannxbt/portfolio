import type { Locale } from "@/lib/i18n";

export type Language = Locale;

export type SocialPlatform = "github" | "linkedin" | "twitter" | "resume";

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

export interface ExperienceItem {
  role: string;
  company?: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
}

export interface LandingContent {
  branding: {
    title: string;
    description: string;
    favicon: string;
  };
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
  experience: {
    title: string;
    subtitle: string;
    cta: string;
    roles: ExperienceItem[];
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
    branding: {
      title: "Iván Caamaño - AI & Software Engineer",
      description: "AI & Software Engineer building production-grade agents, ML systems, and scalable platforms.",
      favicon: "/icons/ivan-orb.svg",
    },
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
    experience: {
      title: "Work Experience",
      subtitle: "Recent roles pulled from my CV with the impact I delivered.",
      cta: "Download CV",
      roles: [
        {
          role: "AI & Data Analyst",
          company: "Avvale",
          period: "Mar 2025 - Present",
          location: "Madrid, Spain",
          summary:
            "Lead automation initiatives that blend AI agents, RAG systems, and computer vision for consulting engagements.",
          bullets: [
            "Designed and deployed an AWS document-generation agent automating four dynamic document types, reducing manual effort 95%.",
            "Engineered prompting and RAG flows for an Azure chatbot, cutting information retrieval latency 90%.",
            "Built an end-to-end deep learning pipeline to segment and analyze beef loin imagery, improving classification consistency 80%.",
          ],
        },
        {
          role: "Software Associate Consultant",
          company: "NFQ Advisory Services",
          period: "Jan 2025 - Mar 2025",
          location: "Madrid, Spain",
          summary:
            "Supported BBVA's Risk team delivering the Internal Model Method (IMM) platform with production-ready tooling.",
          bullets: [
            "Embedded inside BBVA's IMM development squad within the Risk organization.",
            "Analyzed, designed, and implemented software for four IMM processes using Python, Java, and Unix while coordinating with two cross-functional teams.",
            "Integrated and automated IMM batch executions, minimizing manual intervention and processing time via iterative improvements.",
          ],
        },
        {
          role: "Defense and Security Systems Intern",
          company: "Indra",
          period: "Sep 2021 - Jul 2022",
          location: "Madrid, Spain",
          summary:
            "Contributed ML and data-processing capabilities to modernize AESA radar programs tied to Eurofighter platforms.",
          bullets: [
            "Coordinated with a 10+ person team digitizing AESA radars for the Eurofighter initiative.",
            "Developed and tuned two ML models for radar data processing using TensorFlow and PyTorch, boosting efficiency 30%.",
            "Assisted integration of real-time radar data solutions that improved system performance 20%.",
          ],
        },
      ],
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
        "Personal essays on AI systems, Venezuela's trajectory, macroeconomics, and the kind of capitalism I navigate.",
      viewAll: "Read all articles",
      readMore: "Read article",
      empty: "No articles published yet.",
    },
    blogPosts: [
      {
        id: 1,
        date: "Apr 2025",
        title: "Operating AI Agents Responsibly",
        summary:
          "Thoughts on putting AI agents in production without breaking trust—guardrails, retrieval layers, and the human workflows that keep them useful.",
      },
      {
        id: 2,
        date: "Feb 2025",
        title: "Venezuela's Tech Diaspora and the Next Cycle",
        summary:
          "A personal read on how Venezuelan builders abroad can funnel capital, knowledge, and optimism back home despite fragile institutions.",
      },
      {
        id: 3,
        date: "Oct 2024",
        title: "Economics Notes: Inflation, Commodities, and LatAm Resilience",
        summary:
          "Field notes connecting energy markets, inflation expectations, and why Latin America keeps absorbing external shocks better than headlines suggest.",
      },
      {
        id: 4,
        date: "Jun 2024",
        title: "Capitalism With Constraints",
        summary:
          "A reflection on building companies that still respect human limits—ownership, accountability, and why efficiency must leave space for people.",
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
          label: "X/Twitter",
          url: "https://x.com/_ivvann",
        },
        {
          platform: "resume",
          label: "Resume",
          url: "/cv_iacc.pdf",
        },
      ],
    },
    footer: {
      copyright: "© 2025 Iván Caamaño.",
    },
  },
  es: {
    branding: {
      title: "Iván Caamaño - IA y Software",
      description: "Ingeniero de IA y Software que lleva agentes, ML y plataformas de datos a producción.",
      favicon: "/icons/ivan-orb.svg",
    },
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      projects: "Proyectos",
      blog: "Blog",
      contact: "Contacto",
    },
    hero: {
      role: "Ingeniero Telemático | IA y Datos",
      greeting: "Hola, soy",
      headline: "Transformando tecnología en resultados de impacto.",
      subheadline:
        "Ingeniero Telemático con experiencia en IA/ML, DevOps e Ingeniería de Datos. Enfocado en construir sistemas inteligentes escalables usando Python, arquitecturas en la nube e IA Generativa.",
      cta: "Ver proyectos",
      contact: "Contactar",
    },
    about: {
      title: "Sobre mí",
      summary:
        "Soy un profesional dedicado, impulsado por el objetivo de transformar la tecnología en impacto real. Con una sólida base en Telemática y aprendizaje continuo en tecnologías emergentes de IA, me especializo en conectar modelos de datos complejos con soluciones de software listas para producción.",
      educationTitle: "Educación",
      education1: "Máster en Ingeniería de Redes y Servicios Telemáticos (UPM)",
      education2:
        "Grado en Ingeniería de Tecnologías y Servicios de Telecomunicación (UPM)",
    },
    experience: {
      title: "Experiencia",
      subtitle: "Roles recientes de mi CV y el impacto que generé en cada uno.",
      cta: "Descargar CV",
      roles: [
        {
          role: "Analista de IA y Datos",
          company: "Avvale",
          period: "Mar 2025 - Presente",
          location: "Madrid, España",
          summary:
            "Lidero iniciativas de automatización que combinan agentes de IA, sistemas RAG y visión computacional para clientes de consultoría.",
          bullets: [
            "Diseñé y desplegué un agente en AWS que genera cuatro tipos de documentos dinámicos, reduciendo el esfuerzo manual un 95%.",
            "Diseñé prompts y flujos RAG en Azure para un chatbot especializado, reduciendo la latencia de consulta un 90%.",
            "Construí un pipeline de deep learning para segmentar y analizar imágenes de lomo vacuno, aumentando la consistencia en la clasificación un 80%.",
          ],
        },
        {
          role: "Consultor Asociado de Software",
          company: "NFQ Advisory Services",
          period: "Ene 2025 - Mar 2025",
          location: "Madrid, España",
          summary:
            "Apoyé al equipo de Riesgos de BBVA en la entrega del Internal Model Method (IMM) con herramientas listas para producción.",
          bullets: [
            "Me integré en el equipo de Riesgos encargado del desarrollo del IMM del banco.",
            "Analicé, diseñé e implementé software para cuatro procesos del IMM usando Python, Java y Unix, coordinándome con dos equipos transversales.",
            "Integré y automaticé la ejecución por lotes del IMM, reduciendo la intervención manual y el tiempo de proceso mediante iteración continua.",
          ],
        },
        {
          role: "Becario en Sistemas de Defensa y Seguridad",
          company: "Indra",
          period: "Sep 2021 - Jul 2022",
          location: "Madrid, España",
          summary:
            "Contribuí a modernizar plataformas de radares AESA mediante modelos de ML y pipelines de datos en tiempo real.",
          bullets: [
            "Coordiné con un equipo de más de 10 personas la digitalización de radares AESA para el programa Eurofighter.",
            "Desarrollé y optimicé dos modelos de ML para procesamiento de datos de radar con TensorFlow y PyTorch, mejorando la eficiencia un 30%.",
            "Apoyé la integración de soluciones de procesamiento en tiempo real, elevando el rendimiento del sistema un 20%.",
          ],
        },
      ],
    },
    stack: {
      title: "Competencias clave",
    },
    projects: {
      title: "Trabajos destacados",
      viewAll: "Ver CV completo",
    },
    projectItems: [
      {
        id: 1,
        icon: "cloud",
        title: "Agente Generador de Documentos IA",
        desc: "Diseño y despliegue de un agente en AWS que automatiza la producción de 4 tipos de documentos dinámicos, reduciendo el esfuerzo manual un 95%.",
        tags: ["AWS", "Python", "LLMs", "Automatización"],
      },
      {
        id: 2,
        icon: "database",
        title: "Chatbot RAG Empresarial",
        desc: "Ingeniería de prompts e implementación RAG en Azure, disminuyendo la latencia de recuperación de información un 90%.",
        tags: ["Azure", "RAG", "LangChain", "Python"],
      },
      {
        id: 3,
        icon: "layers",
        title: "Optimización ML para Radares",
        desc: "Desarrollo de modelos de ML para procesar datos de radar AESA (Eurofighter), mejorando la eficiencia un 30% con TensorFlow.",
        tags: ["PyTorch", "TensorFlow", "Procesamiento de Señal", "Python"],
      },
    ],
    blog: {
      title: "Últimas ideas",
      description:
        "Ensayos personales sobre IA, la trayectoria de Venezuela, macroeconomía y el tipo de capitalismo que navego.",
      viewAll: "Leer todo",
      readMore: "Leer artículo",
      empty: "Aún no hay artículos publicados.",
    },
    blogPosts: [
      {
        id: 1,
        date: "Abr 2025",
        title: "Operar Agentes de IA con Responsabilidad",
        summary:
          "Ideas sobre cómo lanzar agentes en producción sin perder confianza: guardrails, capas de recuperación y los flujos humanos que los mantienen útiles.",
      },
      {
        id: 2,
        date: "Feb 2025",
        title: "La Diáspora Tech Venezolana y el Próximo Ciclo",
        summary:
          "Lectura personal sobre cómo los creadores venezolanos en el exterior pueden canalizar capital, conocimiento y optimismo al país pese a las instituciones frágiles.",
      },
      {
        id: 3,
        date: "Oct 2024",
        title: "Notas de Economía: Inflación, Commodities y Resiliencia LatAm",
        summary:
          "Apuntes que conectan energía, expectativas inflacionarias y por qué América Latina absorbe mejor los shocks de lo que cuentan los titulares.",
      },
      {
        id: 4,
        date: "Jun 2024",
        title: "Capitalismo con Restricciones",
        summary:
          "Reflexión sobre construir compañías que respeten límites humanos: propiedad, accountability y por qué la eficiencia debe dejar espacio a la gente.",
      },
    ],
    contact: {
      title: "Conectemos",
      text: "Basado en Madrid. Abierto a colaboraciones en proyectos de IA, Ingeniería de Datos y Blockchain.",
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
          label: "X/Twitter",
          url: "https://x.com/_ivvann",
        },
        {
          platform: "resume",
          label: "Resume",
          url: "/cv_iacc.pdf",
        },
      ],
    },
    footer: {
      copyright: "© 2025 Iván Caamaño.",
    },
  },
};
