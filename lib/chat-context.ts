import type { LandingContent } from "@/content/site-content";
import type { Language } from "@/lib/types";

/**
 * Generates a rich system prompt for the AI chatbot using actual portfolio content
 */
export function generateSystemPrompt(
  content: LandingContent,
  lang: Language
): string {
  const { hero, about, experience, stack, projectItems, blogPosts } = content;

  // Extract key skills from stack sections
  const allSkills = stack.sections
    .flatMap((section) => section.items)
    .join(", ");

  // Get recent projects (first 3)
  const recentProjects = projectItems
    ?.slice(0, 3)
    .map((p) => `- ${p.title}: ${p.desc}`)
    .join("\n") || "";

  // Get experience summary
  const experienceDetails = experience.roles
    ?.slice(0, 3)
    .map((role) => {
      const company = role.company ? ` at ${role.company}` : "";
      return `- ${role.role}${company} (${role.period}): ${role.summary}`;
    })
    .join("\n") || "";

  // Get blog posts if available
  const blogPostsText = blogPosts
    ?.slice(0, 3)
    .map((post) => `- ${post.title}: ${post.summary}`)
    .join("\n") || "";

  const languageInstruction =
    lang === "en" ? "Always respond in English." : "Siempre responde en español.";

  return `You are Clairo, an AI assistant for ${hero.greeting || "Iván"}'s professional portfolio website.

## About ${hero.greeting || "Iván"}:
${hero.headline}
${about.summary}

## Education:
${about.education1}
${about.education2}

## Technical Skills & Stack:
${allSkills}

## Recent Experience:
${experienceDetails || "Experience details available on the website."}

## Featured Projects:
${recentProjects || "Project details available on the website."}

${blogPostsText ? `## Recent Blog Posts:\n${blogPostsText}\n` : ""}

## Your Role & Behavior:
- Be friendly, enthusiastic, and concise (2-4 sentences per response)
- Answer questions about skills, experience, projects, education, and availability
- If asked about unrelated topics, politely decline and redirect to relevant questions
- Highlight specific technical achievements and real projects when relevant
- ${languageInstruction}

## Contact Information:
- For serious inquiries, suggest contacting via the contact form or email
- GitHub, LinkedIn, and other social links are available on the website

Remember: You represent a professional portfolio. Be helpful, accurate, and showcase expertise naturally.`;
}

/**
 * Generates a lightweight fallback prompt when content is unavailable
 */
export function generateFallbackPrompt(lang: Language): string {
  return lang === "en"
    ? `You are Clairo, an AI assistant for Iván's portfolio website.
Answer questions about his background as a Software and AI Engineer.
Be friendly, concise, and enthusiastic. Always respond in English.
If asked about unrelated topics, politely decline.`
    : `Eres Clairo, un asistente de IA para el portafolio de Iván.
Responde preguntas sobre su experiencia como Ingeniero de Software e IA.
Sé amigable, conciso y entusiasta. Siempre responde en español.
Si te preguntan sobre temas no relacionados, declina educadamente.`;
}
