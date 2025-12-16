import type { Locale } from "@/lib/i18n";

export type Language = Locale;

export type SocialPlatform = "github" | "linkedin" | "twitter" | "resume";

export interface SocialPreview {
  title: string;
  subtitle: string;
  description: string;
  highlights?: string[];
  stats?: Array<{ label: string; value: string }>;
  avatar?: string;
  badge?: string;
  brandIcons?: string[];
  previewImage?: string;
}

export interface SocialLink {
  label: string;
  url: string;
  platform: SocialPlatform;
  preview?: SocialPreview;
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
  image?: string;
}

export interface ExperienceItem {
  role: string;
  company?: string;
  companyLogo?: string;
  companyLogoAlt?: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
}

export type StackIcon = "code" | "layers" | "brain";

export interface StackSection {
  title: string;
  description: string;
  icon: StackIcon;
  items: string[];
}

export interface ThemeSettings {
  bodyFont: string;
  headingFont: string;
  monoFont?: string;
}

export interface LandingContent {
  branding: {
    title: string;
    description: string;
    favicon: string;
    logoText: string;
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
    sections: StackSection[];
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
    viewMore: string;
    viewLess: string;
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
  theme?: ThemeSettings;
}

export type SiteContent = Record<Language, LandingContent>;

const englishContent: LandingContent = {
  branding: {
    title: "Iván Caamaño - AI & Software Engineer",
    description: "AI & Software Engineer building production-grade agents, ML systems, and scalable platforms.",
    favicon: "/icons/ivan-orb.svg",
    logoText: "Iván Caamaño",
  },
  theme: {
    bodyFont:
      "Space Grotesk, Calibri, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    headingFont: "Space Grotesk, 'Sora', 'Segoe UI', sans-serif",
    monoFont: "IBM Plex Mono, 'SFMono-Regular', ui-monospace, monospace",
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
        companyLogo: "/icons/avvale.png",
        companyLogoAlt: "Avvale logo",
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
        companyLogo: "/icons/nfq.png",
        companyLogoAlt: "NFQ Advisory Services logo",
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
        companyLogo: "/icons/indra.png",
        companyLogoAlt: "Indra logo",
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
    sections: [
      {
        title: "Programming",
        description: "Languages I use across consulting projects and open-source work.",
        icon: "code",
        items: ["Python", "SQL", "TypeScript", "JavaScript", "Java", "R", "Scala", "Go", "Rust", "Solidity"],
      },
      {
        title: "Software",
        description: "Cloud and platform tooling from my DevOps and product experience.",
        icon: "layers",
        items: ["AWS", "Azure", "Docker", "Kubernetes", "Databricks", "Linux", "Git", "Next.js", "Terraform", "CI/CD"],
      },
      {
        title: "AI & Data",
        description: "The AI/ML stack powering my RAG, CV, and analytics deliveries.",
        icon: "brain",
        items: ["PyTorch", "TensorFlow", "Keras", "LangChain", "MLflow", "RAG", "Prompt Engineering", "Computer Vision", "Data Engineering", "LLMOps"],
      },
    ],
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
    description: "",
    viewAll: "Read all articles",
    viewMore: "View more insights",
    viewLess: "View fewer insights",
    readMore: "Read article",
    empty: "No articles published yet.",
  },
  blogPosts: [
    {
      id: 1,
      date: "May 2025",
      title: "My AI Stack Is for Solving Boring Work",
      summary:
        "Why I obsess over pragmatic agents: scoped context windows, ruthless observability, and using LLMs only when latency and cost prove the ROI.",
      image: "/blog/default.svg",
    },
    {
      id: 2,
      date: "Apr 2025",
      title: "Venezuela Wants Builders, Not Saviors",
      summary:
        "Notes from my trips home: talent is everywhere, trust is scarce, and the real leverage is small funds plus patient execution in local currency.",
      image: "/blog/default.svg",
    },
    {
      id: 3,
      date: "Mar 2025",
      title: "Crypto Rails as Emergency Exit",
      summary:
        "How I use stablecoins and onchain rails as a resilience plan—multi-sig treasuries, compliance guardrails, and custody discipline learned the hard way.",
      image: "/blog/default.svg",
    },
    {
      id: 4,
      date: "Feb 2025",
      title: "Watching the Economy Like an Engineer",
      summary:
        "The macro dashboard on my desk: liquidity, shipping costs, labor churn, and how each signal shapes the projects I greenlight.",
      image: "/blog/default.svg",
    },
    {
      id: 5,
      date: "Jan 2025",
      title: "Capitalism as a Craft, Not a Dogma",
      summary:
        "Personal rules for building companies: profit with constraints, equity for contributors, and ruthless clarity on who owns the downside.",
      image: "/blog/default.svg",
    },
    {
      id: 6,
      date: "Dec 2024",
      title: "Taming Consumism in My Own Routine",
      summary:
        "I track cravings like metrics—cutting pointless upgrades, buying local, and investing surplus into community experiments instead of gadgets.",
      image: "/blog/default.svg",
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
        preview: {
          title: "GitHub",
          subtitle: "@ivannxbt",
          description:
            "Code powering Avvale automation, NFQ risk tooling, and Indra ML experiments.",
          highlights: ["400+ contributions in 2024", "Featured Avvale, NFQ & Indra toolkits"],
          stats: [
            { label: "Repos", value: "40+" },
            { label: "Followers", value: "90+" },
          ],
          avatar: "/profile.jpeg",
          badge: "Active this week",
          brandIcons: ["/icons/avvale.png", "/icons/nfq.png", "/icons/indra.png"],
          previewImage: "/github.png",
        },
      },
      {
        platform: "linkedin",
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/ivancaamano/",
        preview: {
          title: "LinkedIn",
          subtitle: "AI & Software Engineer · Avvale",
          description:
            "Leading Avvale AI programs while staying connected with NFQ and Indra collaborators.",
          highlights: ["600+ professional connections", "Open to advisory roles"],
          stats: [
            { label: "Experience", value: "4+ yrs" },
            { label: "Recommendations", value: "5" },
          ],
          avatar: "/profile.jpeg",
          badge: "Available for chat",
          brandIcons: ["/icons/avvale.png", "/icons/nfq.png", "/icons/indra.png"],
          previewImage: "/linkedin.png",
        },
      },
      {
        platform: "twitter",
        label: "X/Twitter",
        url: "https://x.com/_ivvann",
        preview: {
          title: "X / Twitter",
          subtitle: "@_ivvann",
          description:
            "Threads on AI engineering, data ops, and the Avvale, NFQ, and Indra projects informing my work.",
          highlights: ["Daily updates", "Community questions welcome"],
          stats: [
            { label: "Followers", value: "500+" },
            { label: "Avg. reach", value: "4k" },
          ],
          avatar: "/profile.jpeg",
          badge: "Posting now",
          brandIcons: ["/icons/avvale.png", "/icons/nfq.png", "/icons/indra.png"],
          previewImage: "/x.png",
        },
      },
      {
        platform: "resume",
        label: "Resume",
        url: "/cv_iacc.pdf",
        preview: {
          title: "Resume",
          subtitle: "Iván Caamaño · 2025 Edition",
          description: "Telematics Engineer focused on AI, data, and software systems.",
          highlights: ["Avvale · AI & Data Analyst", "NFQ · Software Consultant", "Indra · ML Intern"],
          stats: [
            { label: "Pages", value: "2" },
            { label: "Updated", value: "Mar 2025" },
          ],
          badge: "Download PDF",
          brandIcons: ["/icons/avvale.png", "/icons/nfq.png", "/icons/indra.png"],
          previewImage: "/cv_iacc.png",
        },
      },
    ],
  },
  footer: {
    copyright: "© 2025 Iván Caamaño.",
  },
};

export const defaultContent: SiteContent = {
  en: englishContent,
  es: englishContent,
};
