export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
    },
    actions: {
      downloadCV: "Download CV",
      viewProjects: "See projects",
      contact: "Let's collaborate",
    },
    home: {
      hero: {
        greeting: "Hola, I'm",
        name: "Iván Alfredo Caamaño Castañeda",
        role: "AI Engineer & Data Analyst in Madrid",
        description:
          "Telecommunications engineer specialized in AI/ML, DevOps, and data systems. I design document agents, RAG copilots, and deep learning products that automate operations end-to-end on AWS and Azure.",
        availability:
          "Currently at Avvale leading agents, retrieval, and computer vision deployments for enterprise teams.",
        metrics: [
          { label: "Manual work removed", value: "95%" },
          { label: "Latency reduction", value: "90%" },
          { label: "Vision consistency", value: "+80%" },
        ],
      },
      featuredProjects: {
        eyebrow: "Featured delivery",
        title: "Operational AI with measurable lift",
        description:
          "From AWS agent pipelines to Azure RAG systems and CV workflows that boost consistency across manufacturing and finance.",
        viewAll: "Browse all projects",
      },
      latestPosts: {
        eyebrow: "Latest writing",
        title: "Field notes & systems thinking",
        description:
          "Deep dives on multi-agent orchestration, retrieval evaluation, and the data plumbing that keeps copilots trustworthy.",
        viewAll: "Visit the blog",
      },
    },
    about: {
      title: "About Iván",
      intro:
        "AI & Data Analyst blending software engineering, ML, and cloud automation. I build production-grade agents, retrieval stacks, and computer vision solutions that reduce cycle times and align with business KPIs.",
      paragraphs: [
        "My foundation in telematics and distributed systems lets me bridge AI research with DevOps and data engineering. I partner with product, risk, and operations teams to design workflows that remain observable and governable.",
        "I stay hands-on across AWS and Azure: orchestrating LangChain/LangGraph agents, optimizing RAG prompting, and deploying deep learning services that integrate with existing enterprise tooling.",
      ],
      highlights: [
        { label: "Primary focus", value: "Agents · RAG · CV" },
        { label: "Cloud stack", value: "AWS + Azure" },
        { label: "Base", value: "Madrid, Spain" },
      ],
      timelineTitle: "Professional experience",
      timeline: [
        {
          role: "AI & Data Analyst",
          company: "Avvale",
          period: "Mar 2025 – Present",
          description:
            "Designed a document-generation agent on AWS, optimized Azure RAG chatbots, and shipped a computer-vision pipeline for beef classification.",
          logo: "/icons/avvale.svg",
        },
        {
          role: "Software Associate Consultant",
          company: "NFQ Advisory Services",
          period: "Jan 2025 – Mar 2025",
          description:
            "Built IMM risk processes for BBVA using Python, Java, and Unix automation, reducing manual execution across four batch workflows.",
          logo: "/icons/nfq.svg",
        },
        {
          role: "Defense & Security Systems Intern",
          company: "Indra",
          period: "Sep 2021 – Jul 2022",
          description:
            "Collaborated on Eurofighter radar digitalization and developed ML models for AESA signal denoising and pattern detection.",
          logo: "/icons/indra.svg",
        },
      ],
      expertiseTitle: "Focus areas",
      expertise: [
        {
          title: "AI agents & automation",
          description:
            "RAG copilots, document agents, and multi-step workflows with LangChain, LangGraph, Bedrock, and Azure OpenAI.",
        },
        {
          title: "Computer vision & deep learning",
          description:
            "CNN-based segmentation, model evaluation, and MLOps practices that keep inference SLAs reliable.",
        },
        {
          title: "Data & cloud engineering",
          description:
            "Pipelines, DevOps, and observability over AWS, Azure, Kubernetes, and modern data stacks.",
        },
      ],
      skillsTitle: "Toolbox & stack",
      educationTitle: "Education",
      education: [
        {
          school: "Universidad Politécnica de Madrid",
          degree: "Master in Network & Telematic Services",
          period: "Sep 2023 – Jul 2024",
          details:
            "AI/ML, Big Data, Cloud Computing, Blockchain, Cybersecurity, IoT.",
        },
        {
          school:
            "UPM — Telecommunications Technologies and Services Engineering",
          degree: "Bachelor of Engineering (Telematics mention)",
          period: "Sep 2019 – Jul 2023",
          details:
            "ABET & EUR-ACE accredited. Coursework in software engineering, statistics, networks, and systems.",
        },
      ],
      languagesTitle: "Languages",
      languages: [
        { label: "Spanish", level: "Native" },
        { label: "English", level: "C2" },
        { label: "French", level: "B1" },
      ],
      interestsTitle: "Interests",
      interests: ["AI/ML", "Software", "Data", "Blockchain", "E-commerce"],
      downloadCV: "Download CV",
      contactCTA: "Need a fast consult? Let's schedule a call.",
    },
    projects: {
      title: "Projects",
      description:
        "Enterprise AI delivery across document agents, RAG copilots, risk automation, and defense-grade ML.",
      highlightLabel: "Impact",
      stackLabel: "Stack",
      empty: "No projects available.",
      viewProject: "Visit demo",
      viewCode: "View repo",
    },
    blog: {
      title: "Blog",
      description:
        "Technical notes about multi-agent orchestration, retrieval evaluation, and MLOps.",
      readMore: "Read article",
      empty: "No posts published yet.",
      published: "Published",
    },
    contact: {
      title: "Contact",
      description:
        "Tell me about the agent, RAG stack, or ML workflow you need to automate. I'm based in Madrid and reply within one business day.",
      directEmail: "Prefer email?",
      callout: "I'll reply within one business day.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send message",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@company.com",
      messagePlaceholder: "Share goals, stack, and success metrics.",
      details: [
        { label: "Email", value: "ivanncaamano@gmail.com", href: "mailto:ivanncaamano@gmail.com" },
        { label: "Phone", value: "+34 644 983 729", href: "tel:+34644983729" },
        { label: "GitHub", value: "@ivanncaamano", href: "https://github.com/ivanncaamano" },
        { label: "X / Twitter", value: "@ivannxbt", href: "https://twitter.com/ivannxbt" },
        { label: "Location", value: "Madrid, Spain" },
      ],
    },
    footer: {
      rights: "All rights reserved.",
      tagline: "AI & data systems engineered by Iván Caamaño.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      projects: "Proyectos",
      blog: "Blog",
      contact: "Contacto",
    },
    actions: {
      downloadCV: "Descargar CV",
      viewProjects: "Ver proyectos",
      contact: "Agendemos",
    },
    home: {
      hero: {
        greeting: "Hola, soy",
        name: "Iván Alfredo Caamaño Castañeda",
        role: "Ingeniero de IA y Datos en Madrid",
        description:
          "Ingeniero en Telemática especializado en AI/ML, DevOps y sistemas de datos. Diseño agentes documentales, copilotos RAG y productos de deep learning que automatizan operaciones de punta a punta en AWS y Azure.",
        availability:
          "Actualmente en Avvale liderando despliegues de agentes, retrieval y visión artificial para equipos empresariales.",
        metrics: [
          { label: "Trabajo manual reducido", value: "95%" },
          { label: "Mejora de latencia", value: "90%" },
          { label: "Consistencia en visión", value: "+80%" },
        ],
      },
      featuredProjects: {
        eyebrow: "Entrega destacada",
        title: "IA operativa con impacto medible",
        description:
          "Desde pipelines de agentes en AWS hasta sistemas RAG en Azure y workflows de visión que elevan la consistencia en manufactura y finanzas.",
        viewAll: "Ver todos los proyectos",
      },
      latestPosts: {
        eyebrow: "Últimos artículos",
        title: "Notas de campo y sistemas",
        description:
          "Profundizo en orquestación multiagente, evaluación de retrieval y la fontanería de datos que hace confiables a los copilotos.",
        viewAll: "Ir al blog",
      },
    },
    about: {
      title: "Sobre Iván",
      intro:
        "AI & Data Analyst que combina ingeniería de software, ML y automatización cloud. Construyo agentes, stacks de retrieval y soluciones de visión que reducen ciclos y se alinean con indicadores de negocio.",
      paragraphs: [
        "Mi formación en telemática y sistemas distribuidos me permite unir investigación en IA con DevOps y data engineering. Colaboro con producto, riesgo y operaciones para diseñar workflows observables y gobernados.",
        "Trabajo de forma práctica en AWS y Azure: orquestando agentes con LangChain/LangGraph, optimizando prompts en RAG y desplegando servicios de deep learning que se integran con tooling corporativo.",
      ],
      highlights: [
        { label: "Enfoque principal", value: "Agentes · RAG · CV" },
        { label: "Stack cloud", value: "AWS + Azure" },
        { label: "Base", value: "Madrid, España" },
      ],
      timelineTitle: "Experiencia profesional",
      timeline: [
        {
          role: "AI & Data Analyst",
          company: "Avvale",
          period: "Mar 2025 – Actualidad",
          description:
            "Diseñé un agente generador de documentos en AWS, optimicé un chatbot RAG en Azure y lancé un pipeline de visión para clasificación de lomo.",
          logo: "/icons/avvale.svg",
        },
        {
          role: "Software Associate Consultant",
          company: "NFQ Advisory Services",
          period: "Ene 2025 – Mar 2025",
          description:
            "Desarrollé procesos de riesgo IMM para BBVA con Python, Java y automatización en Unix, reduciendo ejecución manual en cuatro flujos batch.",
          logo: "/icons/nfq.svg",
        },
        {
          role: "Intern, Defense & Security Systems",
          company: "Indra",
          period: "Sep 2021 – Jul 2022",
          description:
            "Apoyé la digitalización de radares del Eurofighter y desarrollé modelos ML para detección de patrones y reducción de ruido en señales AESA.",
          logo: "/icons/indra.svg",
        },
      ],
      expertiseTitle: "Áreas de enfoque",
      expertise: [
        {
          title: "Agentes de IA y automatización",
          description:
            "Copilotos RAG, agentes documentales y workflows multi-step con LangChain, LangGraph, Bedrock y Azure OpenAI.",
        },
        {
          title: "Computer vision y deep learning",
          description:
            "Segmentación con CNN, evaluación de modelos y prácticas de MLOps que garantizan SLAs de inferencia.",
        },
        {
          title: "Ingeniería de datos y cloud",
          description:
            "Pipelines, DevOps y observabilidad sobre AWS, Azure, Kubernetes y data stacks modernos.",
        },
      ],
      skillsTitle: "Stack y herramientas",
      educationTitle: "Educación",
      education: [
        {
          school: "Universidad Politécnica de Madrid",
          degree: "Máster en Servicios de Red y Telemática",
          period: "Sep 2023 – Jul 2024",
          details:
            "AI/ML, Big Data, Cloud Computing, Blockchain, Ciberseguridad, IoT.",
        },
        {
          school:
            "UPM — Ingeniería de Tecnologías y Servicios de Telecomunicación",
          degree: "Grado en Ingeniería (Mención Telemática)",
          period: "Sep 2019 – Jul 2023",
          details:
            "Acreditaciones ABET y EUR-ACE. Cursos en software, estadística, redes y sistemas.",
        },
      ],
      languagesTitle: "Idiomas",
      languages: [
        { label: "Español", level: "Nativo" },
        { label: "Inglés", level: "C2" },
        { label: "Francés", level: "B1" },
      ],
      interestsTitle: "Intereses",
      interests: ["AI/ML", "Software", "Datos", "Blockchain", "E-commerce"],
      downloadCV: "Descargar CV",
      contactCTA: "¿Prefieres hablar en vivo? Agendemos una llamada.",
    },
    projects: {
      title: "Proyectos",
      description:
        "Entregas de IA empresarial: agentes documentales, copilotos RAG, automatización de riesgo y ML para defensa.",
      highlightLabel: "Impacto",
      stackLabel: "Stack",
      empty: "No hay proyectos disponibles.",
      viewProject: "Ver demo",
      viewCode: "Ver repositorio",
    },
    blog: {
      title: "Blog",
      description:
        "Notas técnicas sobre orquestación multiagente, evaluación de retrieval y MLOps.",
      readMore: "Leer artículo",
      empty: "Aún no hay artículos publicados.",
      published: "Publicado",
    },
    contact: {
      title: "Contacto",
      description:
        "Cuéntame del agente, stack RAG o workflow de ML que necesitas automatizar. Con base en Madrid, respondo en un día hábil.",
      directEmail: "¿Prefieres email?",
      callout: "Responderé en un día hábil.",
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      send: "Enviar mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@empresa.com",
      messagePlaceholder: "Comparte objetivos, stack y métricas de éxito.",
      details: [
        { label: "Email", value: "ivanncaamano@gmail.com", href: "mailto:ivanncaamano@gmail.com" },
        { label: "Teléfono", value: "+34 644 983 729", href: "tel:+34644983729" },
        { label: "GitHub", value: "@ivanncaamano", href: "https://github.com/ivanncaamano" },
        { label: "X / Twitter", value: "@ivannxbt", href: "https://twitter.com/ivannxbt" },
        { label: "Ubicación", value: "Madrid, España" },
      ],
    },
    footer: {
      rights: "Todos los derechos reservados.",
      tagline: "Sistemas de IA y datos por Iván Caamaño.",
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
