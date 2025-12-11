'use client';

import React, {
  useState,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  ArrowUpRight,
  Code2,
  BrainCircuit,
  Layers,
  Database,
  Cloud,
  MessageSquare,
  Send,
  Sparkles,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";

type Language = "en" | "es";
type Theme = "dark" | "light";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const callGemini = async (prompt: string, systemInstruction?: string) => {
  if (!apiKey) {
    return "AI key not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to use this feature.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction
            ? { parts: [{ text: systemInstruction }] }
            : undefined,
        }),
      }
    );

    if (!response.ok) throw new Error("API Error");

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No insight available right now."
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please try again later.";
  }
};

interface Content {
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
  blog: {
    title: string;
    viewAll: string;
  };
  contact: {
    title: string;
    text: string;
    email: string;
  };
  footer: {
    copyright: string;
  };
}

const content: Record<Language, Content> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      blog: "Experience",
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
    blog: {
      title: "Latest Insights",
      viewAll: "Read all articles",
    },
    contact: {
      title: "Let's Connect",
      text: "Based in Madrid. Open to collaborations in AI, Data Engineering, and Blockchain projects.",
      email: "ivanncaamano@gmail.com",
    },
    footer: {
      copyright: "© 2025 Iván Caamaño. Built with Next.js.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      projects: "Proyectos",
      blog: "Experiencia",
      contact: "Contacto",
    },
    hero: {
      role: "Ingeniero Telemático | IA y Datos",
      greeting: "Hola, soy",
      headline: "Transformando tecnología en resultados de impacto.",
      subheadline:
        "Ingeniero Telemático con experiencia en IA/ML, DevOps e Ingeniería de Datos. Enfocado en construir sistemas inteligentes escalables usando Python, arquitecturas Cloud e IA Generativa.",
      cta: "Ver Proyectos",
      contact: "Contactar",
    },
    about: {
      title: "Sobre mí",
      summary:
        "Soy un profesional dedicado, impulsado por el objetivo de transformar la tecnología en impacto real. Con una sólida base en Telemática y aprendizaje continuo en tecnologías emergentes de IA, me especializo en conectar modelos de datos complejos con soluciones de software listas para producción.",
      educationTitle: "Educación",
      education1: "Máster en Ingeniería de Redes y Servicios Telemáticos (UPM)",
      education2:
        "Grado en Ingeniería de Tecnologías y Serv. de Telecomunicación (UPM)",
    },
    stack: {
      title: "Competencias Clave",
    },
    projects: {
      title: "Trabajos Destacados",
      viewAll: "Ver CV Completo",
    },
    blog: {
      title: "Últimas Publicaciones",
      viewAll: "Leer todo",
    },
    contact: {
      title: "Conectemos",
      text: "Basado en Madrid. Abierto a colaboraciones en proyectos de IA, Ingeniería de Datos y Blockchain.",
      email: "ivanncaamano@gmail.com",
    },
    footer: {
      copyright: "© 2025 Iván Caamaño. Creado con Next.js.",
    },
  },
};
const mockProjects = [
  {
    id: 1,
    title: "AI Doc Generation Agent",
    titleEs: "Agente Generador de Docs IA",
    desc: "Designed and deployed an AWS-based agent automating production of 4 dynamic document types, reducing manual effort by 95%.",
    descEs:
      "Diseño y despliegue de un agente en AWS automatizando la producción de 4 tipos de documentos dinámicos, reduciendo el esfuerzo manual un 95%.",
    tags: ["AWS", "Python", "LLMs", "Automation"],
    icon: Cloud,
  },
  {
    id: 2,
    title: "Enterprise RAG Chatbot",
    titleEs: "Chatbot RAG Empresarial",
    desc: "Engineered prompting and RAG implementations in Azure, decreasing information retrieval latency by 90% for specialized queries.",
    descEs:
      "Ingeniería de prompts e implementación RAG en Azure, disminuyendo la latencia de recuperación de información un 90%.",
    tags: ["Azure", "RAG", "LangChain", "Python"],
    icon: Database,
  },
  {
    id: 3,
    title: "Radar ML Optimization",
    titleEs: "Optimización ML para Radares",
    desc: "Developed ML models for AESA radar data processing (Eurofighter), improving efficiency by 30% using TensorFlow and PyTorch.",
    descEs:
      "Desarrollo de modelos ML para procesamiento de datos de radar AESA (Eurofighter), mejorando la eficiencia un 30% con TensorFlow.",
    tags: ["PyTorch", "TensorFlow", "Signal Proc", "Python"],
    icon: Layers,
  },
];

const mockPosts = [
  {
    id: 1,
    date: "2025",
    title: "Internal Model Method (IMM) Development Strategy",
    titleEs: "Estrategia de Desarrollo del Internal Model Method (IMM)",
  },
  {
    id: 2,
    date: "2024",
    title: "Optimizing Beef Loin Analysis with Deep Learning",
    titleEs: "Optimizando el Análisis de Lomo de Vacuno con Deep Learning",
  },
  {
    id: 3,
    date: "2023",
    title: "Real-time Data Processing in Defense Systems",
    titleEs: "Procesamiento de Datos en Tiempo Real en Sistemas de Defensa",
  },
];

const TechIcon = ({ label, theme }: { label: string; theme: Theme }) => (
  <span
    className={`text-xs font-mono px-2 py-1 rounded transition-colors cursor-default border ${
      theme === "dark"
        ? "text-neutral-400 bg-neutral-900 border-neutral-800 hover:border-neutral-600"
        : "text-neutral-600 bg-white border-neutral-200 hover:border-neutral-400"
    }`}
  >
    {label}
  </span>
);

const ProjectCard = ({
  project,
  lang,
  theme,
  aiEnabled,
}: {
  project: (typeof mockProjects)[number];
  lang: Language;
  theme: Theme;
  aiEnabled: boolean;
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateInsight = async (e: ReactMouseEvent) => {
    e.preventDefault();
    if (insight || !aiEnabled) return;

    setLoading(true);
    const desc = lang === "en" ? project.desc : project.descEs;
    const prompt = `Act as a senior software architect. Briefly analyze (max 40 words) why the tech stack [${project.tags.join(
      ", "
    )}] is a good choice for a project described as: "${desc}". Respond in ${
      lang === "en" ? "English" : "Spanish"
    }. Start directly with the reason.`;

    const result = await callGemini(prompt);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div
      className={`group relative border rounded-xl p-6 transition-all duration-300 flex flex-col h-full hover:shadow-lg ${
        theme === "dark"
          ? "bg-[#0a0a0a] border-neutral-900 hover:border-neutral-700 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]"
          : "bg-white border-neutral-200 hover:border-teal-500/30 hover:shadow-teal-900/5"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-lg transition-colors ${
            theme === "dark"
              ? "bg-neutral-900 text-neutral-300 group-hover:text-white"
              : "bg-teal-50 text-teal-700 group-hover:bg-teal-100"
          }`}
        >
          <project.icon size={24} strokeWidth={1.5} />
        </div>
        <div className="flex gap-2">
          {aiEnabled ? (
            <button
              onClick={handleGenerateInsight}
              title="Generate AI Architecture Insight"
              disabled={loading}
              className={`p-2 rounded-full transition-all ${
                insight
                  ? theme === "dark"
                    ? "text-teal-400 bg-teal-900/20"
                    : "text-teal-600 bg-teal-100"
                  : theme === "dark"
                    ? "text-neutral-600 hover:text-teal-400 hover:bg-neutral-800"
                    : "text-neutral-400 hover:text-teal-600 hover:bg-neutral-100"
              }`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            </button>
          ) : (
            <div
              className={`p-2 rounded-full text-xs ${
                theme === "dark"
                  ? "text-neutral-600 bg-neutral-900"
                  : "text-neutral-400 bg-neutral-100"
              }`}
              title="AI insights disabled (no API key configured)"
            >
              <Sparkles size={18} />
            </div>
          )}
          <ArrowUpRight
            size={18}
            className={`mt-2 transition-colors ${
              theme === "dark"
                ? "text-neutral-600 group-hover:text-white"
                : "text-neutral-400 group-hover:text-neutral-900"
            }`}
          />
        </div>
      </div>

      <h3
        className={`text-lg font-semibold mb-2 ${
          theme === "dark"
            ? "text-neutral-200 group-hover:text-white"
            : "text-neutral-800 group-hover:text-teal-700"
        }`}
      >
        {lang === "en" ? project.title : project.titleEs}
      </h3>
      <p
        className={`text-sm leading-relaxed mb-6 flex-grow ${
          theme === "dark" ? "text-neutral-500" : "text-neutral-600"
        }`}
      >
        {lang === "en" ? project.desc : project.descEs}
      </p>

      {insight && (
        <div
          className={`mb-6 p-3 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-950/20 border-teal-900/30"
              : "bg-teal-50 border-teal-100"
          }`}
        >
          <p
            className={`text-xs leading-relaxed font-mono ${
              theme === "dark" ? "text-teal-200/80" : "text-teal-800/80"
            }`}
          >
            <span className="font-bold text-teal-500">AI Insight:</span> {insight}
          </p>
        </div>
      )}

      <div
        className={`flex flex-wrap gap-2 mt-auto pt-4 border-t ${
          theme === "dark" ? "border-neutral-900/50" : "border-neutral-100"
        }`}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};
const BlogRow = ({
  post,
  lang,
  theme,
}: {
  post: (typeof mockPosts)[number];
  lang: Language;
  theme: Theme;
}) => (
  <a
    href="#"
    className={`group flex items-baseline gap-6 py-4 border-b transition-colors px-2 ${
      theme === "dark"
        ? "border-neutral-900 hover:bg-neutral-900/30"
        : "border-neutral-200 hover:bg-neutral-50"
    }`}
  >
    <span className="text-xs font-mono text-neutral-500 shrink-0">{post.date}</span>
    <h4
      className={`text-base font-medium transition-colors ${
        theme === "dark"
          ? "text-neutral-300 group-hover:text-teal-400"
          : "text-neutral-800 group-hover:text-teal-600"
      }`}
    >
      {lang === "en" ? post.title : post.titleEs}
    </h4>
  </a>
);

const ChatWidget = ({ lang, theme }: { lang: Language; theme: Theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "model"; text: string }[]>([
    {
      role: "model",
      text:
        lang === "en"
          ? "Hi! I'm Ivan's AI Assistant. Ask me anything about his experience or skills."
          : "¡Hola! Soy el asistente IA de Iván. Pregúntame lo que quieras sobre su experiencia o habilidades.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    const systemContext = `
      You are an AI assistant for Iván Caamaño's portfolio website. 
      Use the following context to answer questions:
      - Role: Telematics Engineer, AI/ML Specialist.
      - Education: Master in Network Services (UPM), Bachelor in Telecom (UPM).
      - Key Skills: Python, PyTorch, AWS, Azure, RAG, Generative AI.
      - Projects: AI Doc Generation (AWS), RAG Chatbot (Azure), Radar ML Optimization (Indra).
      - Tone: Professional, enthusiastic, concise.
      - Language: Respond in ${lang === "en" ? "English" : "Spanish"}.
    `;

    const reply = await callGemini(userMsg, systemContext);

    setMessages((prev) => [...prev, { role: "model", text: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className={`border rounded-2xl w-80 md:w-96 shadow-2xl mb-4 overflow-hidden flex flex-col h-[400px] ${
            theme === "dark"
              ? "bg-[#0f0f0f] border-neutral-800"
              : "bg-white border-neutral-200"
          }`}
        >
          <div
            className={`p-4 border-b flex justify-between items-center ${
              theme === "dark"
                ? "bg-neutral-900/50 border-neutral-800"
                : "bg-neutral-50/80 border-neutral-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span
                className={`font-medium text-sm ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                }`}
              >
                Iván.AI Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`hover:opacity-70 ${
                theme === "dark"
                  ? "text-neutral-500 hover:text-white"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? theme === "dark"
                        ? "bg-neutral-800 text-neutral-200 rounded-tr-none"
                        : "bg-neutral-200 text-neutral-800 rounded-tr-none"
                      : theme === "dark"
                        ? "bg-teal-900/20 text-teal-100 border border-teal-900/30 rounded-tl-none"
                        : "bg-teal-50 text-teal-900 border border-teal-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className={`p-2 rounded-xl rounded-tl-none ${
                    theme === "dark" ? "bg-teal-900/10" : "bg-teal-50"
                  }`}
                >
                  <Loader2 size={16} className="animate-spin text-teal-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`p-3 border-t flex gap-2 ${
              theme === "dark"
                ? "border-neutral-800 bg-neutral-900/30"
                : "border-neutral-100 bg-neutral-50"
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleSend()}
              placeholder={lang === "en" ? "Ask about my skills..." : "Pregunta sobre mis skills..."}
              className={`flex-1 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-500/50 transition-colors border ${
                theme === "dark"
                  ? "bg-neutral-950 border-neutral-800 text-white"
                  : "bg-white border-neutral-200 text-neutral-900"
              }`}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-3 bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-full shadow-lg shadow-teal-900/20 transition-all hover:scale-105 active:scale-95"
      >
        <span
          className={`max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium ${
            isOpen ? "hidden" : "block"
          }`}
        >
          {lang === "en" ? "Chat with AI" : "Hablar con IA"}
        </span>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};
interface PortfolioLandingProps {
  initialLang?: Language;
}

export function PortfolioLanding({ initialLang = "es" }: PortfolioLandingProps) {
  const [lang, setLang] = useState<Language>(initialLang);
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const t = content[lang];
  const aiEnabled = Boolean(apiKey);

  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#050505] text-neutral-200 selection:bg-teal-900/30 selection:text-teal-50"
          : "bg-gray-50 text-neutral-800 selection:bg-teal-100 selection:text-teal-900"
      }`}
    >
      <div
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${
          theme === "dark" ? "opacity-[0.03]" : "opacity-[0.03]"
        }`}
        style={{
          backgroundImage: `radial-gradient(${theme === "dark" ? "#ffffff" : "#000000"} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? `${
                theme === "dark" ? "bg-[#050505]/80 border-neutral-900" : "bg-white/80 border-gray-200"
              } backdrop-blur-md border-b py-3`
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div
            className={`font-bold text-lg tracking-tight flex items-center gap-2 ${
              theme === "dark" ? "text-neutral-100" : "text-neutral-900"
            }`}
          >
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            Iván.Dev
          </div>

          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-medium ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {Object.entries(t.nav).map(([key, value]) => (
              <a key={key} href={`#${key}`} className="hover:text-teal-500 transition-colors capitalize">
                {value}
              </a>
            ))}

            <div className="flex items-center gap-3 ml-4 border-l pl-4 border-neutral-800/50">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${
                  theme === "dark"
                    ? "text-neutral-400 hover:text-white hover:bg-neutral-900"
                    : "text-neutral-600 hover:text-black hover:bg-gray-100"
                }`}
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setLang((prev) => (prev === "en" ? "es" : "en"))}
                className={`px-2 py-1 text-xs font-mono border rounded transition-all ${
                  theme === "dark"
                    ? "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white"
                    : "border-gray-200 text-neutral-500 hover:border-gray-300 hover:text-black"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            </div>
          </nav>

          <button
            className={`md:hidden ${theme === "dark" ? "text-neutral-400" : "text-neutral-600"}`}
            onClick={() => setMobileMenu((prev) => !prev)}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileMenu && (
        <div
          className={`fixed inset-0 z-40 pt-24 px-6 md:hidden ${
            theme === "dark" ? "bg-[#050505]" : "bg-white"
          }`}
        >
          <nav
            className={`flex flex-col gap-6 text-xl font-medium ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {Object.entries(t.nav).map(([key, value]) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setMobileMenu(false)}
                className="hover:text-teal-500"
              >
                {value}
              </a>
            ))}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setLang((prev) => (prev === "en" ? "es" : "en"));
                  setMobileMenu(false);
                }}
                className="text-teal-500 text-base"
              >
                {lang === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                  setMobileMenu(false);
                }}
                className="text-teal-500 text-base flex items-center gap-2"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} Theme
              </button>
            </div>
          </nav>
        </div>
      )}

      <main className="relative z-10 max-w-5xl mx-auto px-6">
        <section id="home" className="pt-40 pb-32 flex flex-col justify-center min-h-[80vh]">
          <div className="absolute top-20 right-0 -z-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] opacity-50" />

          <span className="font-mono text-teal-500 mb-6 block tracking-wide text-sm">
            {t.hero.greeting} <span className={theme === "dark" ? "text-neutral-400" : "text-neutral-600"}>Iván Caamaño</span>
          </span>

          <h1
            className={`text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] ${
              theme === "dark" ? "text-white" : "text-neutral-900"
            }`}
          >
            {t.hero.headline}
          </h1>

          <p
            className={`text-lg max-w-2xl leading-relaxed mb-12 ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            {t.hero.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <button
              className={`px-8 py-4 font-semibold rounded-full transition-all flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              {t.hero.cta}
            </button>
            <a
              href="mailto:ivanncaamano@gmail.com"
              className={`px-8 py-4 font-medium transition-colors border-b border-transparent ${
                theme === "dark"
                  ? "text-neutral-400 hover:text-white hover:border-white"
                  : "text-neutral-600 hover:text-black hover:border-black"
              }`}
            >
              {t.hero.contact}
            </a>
          </div>

          <div className={`mt-24 pt-8 border-t ${theme === "dark" ? "border-neutral-900" : "border-neutral-200"}`}>
            <p className="text-xs font-mono text-neutral-500 mb-4 uppercase tracking-wider">
              {t.stack.title}
            </p>
            <div className="flex flex-wrap gap-3 opacity-90">
              {[
                "Python",
                "PyTorch",
                "TensorFlow",
                "AWS",
                "Azure",
                "Docker",
                "Kubernetes",
                "LangChain",
                "React",
                "Git",
              ].map((tech) => (
                <TechIcon key={tech} label={tech} theme={theme} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                {t.about.title}
              </h2>
              <div className={`text-sm space-y-2 ${theme === "dark" ? "text-neutral-500" : "text-neutral-600"}`}>
                <p className={`font-semibold ${theme === "dark" ? "text-white" : "text-neutral-900"}`}>
                  {t.about.educationTitle}
                </p>
                <p>{t.about.education1}</p>
                <p>{t.about.education2}</p>
              </div>
            </div>
            <div>
              <p
                className={`text-xl leading-relaxed mb-8 ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {t.about.summary}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4
                    className={`font-medium mb-2 flex items-center gap-2 ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    <Code2 size={16} /> Engineering
                  </h4>
                  <p className="text-sm text-neutral-500">
                    DevOps (Docker, K8s), Software Architecture, Cloud (AWS, Azure).
                  </p>
                </div>
                <div>
                  <h4
                    className={`font-medium mb-2 flex items-center gap-2 ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    <BrainCircuit size={16} /> AI & Data
                  </h4>
                  <p className="text-sm text-neutral-500">
                    RAG, LLMs, Deep Learning, Computer Vision, Data Pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="projects"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="flex justify-between items-end mb-12">
            <h2 className={`text-3xl font-bold ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
              {t.projects.title}
            </h2>
            <a
              href="#"
              className={`hidden md:block text-sm font-medium transition-colors ${
                theme === "dark" ? "text-neutral-500 hover:text-teal-400" : "text-neutral-500 hover:text-teal-600"
              }`}
            >
              {t.projects.viewAll} &rarr;
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                theme={theme}
                aiEnabled={aiEnabled}
              />
            ))}
          </div>

          <div className="mt-8 md:hidden text-center">
            <a
              href="#"
              className="text-sm font-medium text-neutral-500 hover:text-teal-500 transition-colors"
            >
              {t.projects.viewAll} &rarr;
            </a>
          </div>
        </section>

        <section
          id="blog"
          className={`py-24 border-t ${theme === "dark" ? "border-neutral-900/50" : "border-neutral-200"}`}
        >
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className={`text-2xl font-bold mb-8 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                {t.blog.title}
              </h2>
              <div className="flex flex-col">
                {mockPosts.map((post) => (
                  <BlogRow key={post.id} post={post} lang={lang} theme={theme} />
                ))}
              </div>
              <a
                href="#"
                className={`inline-block mt-8 text-sm transition-colors ${
                  theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-500 hover:text-black"
                }`}
              >
                {t.blog.viewAll} &rarr;
              </a>
            </div>

            <div id="contact">
              <h2 className={`text-2xl font-bold mb-6 ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}>
                {t.contact.title}
              </h2>
              <p
                className={`mb-8 max-w-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                {t.contact.text}
              </p>
              <a
                href={`mailto:${t.contact.email}`}
                className={`text-xl md:text-2xl font-medium transition-colors border-b-2 pb-1 ${
                  theme === "dark"
                    ? "text-white border-neutral-800 hover:text-teal-400 hover:border-teal-400"
                    : "text-neutral-900 border-neutral-200 hover:text-teal-600 hover:border-teal-600"
                }`}
              >
                {t.contact.email}
              </a>

              <div className="flex gap-6 mt-12">
                <a
                  href="https://github.com/ivannxbt"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors ${
                    theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"
                  }`}
                >
                  <Github size={22} />
                </a>
                <a
                  href="https://linkedin.com/in/ivanncaamano"
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors ${
                    theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"
                  }`}
                >
                  <Linkedin size={22} />
                </a>
                <a
                  href={`mailto:${t.contact.email}`}
                  className={`transition-colors ${
                    theme === "dark" ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-black"
                  }`}
                >
                  <Mail size={22} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className={`py-12 text-center border-t mt-12 ${
          theme === "dark" ? "border-neutral-900" : "border-neutral-200"
        }`}
      >
        <p className="text-neutral-500 text-sm font-mono">{t.footer.copyright}</p>
      </footer>

      {aiEnabled && <ChatWidget lang={lang} theme={theme} />}
    </div>
  );
}
