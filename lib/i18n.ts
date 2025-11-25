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
    home: {
      greeting: "Hi, I'm",
      name: "Your Name",
      title: "Full Stack Developer",
      description:
        "I build exceptional digital experiences with modern technologies.",
      downloadCV: "Download CV",
      viewProjects: "View Projects",
    },
    about: {
      title: "About Me",
      description:
        "I'm a passionate developer with experience in building web applications using modern technologies like React, Next.js, TypeScript, and more.",
      skills: "Skills",
      experience: "Experience",
    },
    projects: {
      title: "Projects",
      description: "A selection of my recent work and personal projects.",
      viewProject: "View Project",
      viewCode: "View Code",
    },
    blog: {
      title: "Blog",
      description: "Thoughts, ideas, and tutorials about web development.",
      readMore: "Read More",
    },
    contact: {
      title: "Contact",
      description: "Get in touch with me for any inquiries or collaborations.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      messagePlaceholder: "Your message...",
    },
    footer: {
      rights: "All rights reserved.",
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
    home: {
      greeting: "Hola, soy",
      name: "Tu Nombre",
      title: "Desarrollador Full Stack",
      description:
        "Construyo experiencias digitales excepcionales con tecnologías modernas.",
      downloadCV: "Descargar CV",
      viewProjects: "Ver Proyectos",
    },
    about: {
      title: "Sobre Mí",
      description:
        "Soy un desarrollador apasionado con experiencia en la construcción de aplicaciones web usando tecnologías modernas como React, Next.js, TypeScript y más.",
      skills: "Habilidades",
      experience: "Experiencia",
    },
    projects: {
      title: "Proyectos",
      description: "Una selección de mis trabajos recientes y proyectos personales.",
      viewProject: "Ver Proyecto",
      viewCode: "Ver Código",
    },
    blog: {
      title: "Blog",
      description: "Pensamientos, ideas y tutoriales sobre desarrollo web.",
      readMore: "Leer Más",
    },
    contact: {
      title: "Contacto",
      description: "Contáctame para cualquier consulta o colaboración.",
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      send: "Enviar Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tu@correo.com",
      messagePlaceholder: "Tu mensaje...",
    },
    footer: {
      rights: "Todos los derechos reservados.",
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
