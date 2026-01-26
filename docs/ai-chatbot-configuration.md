# AI Chatbot Configuration Guide

This guide explains how to configure the AI chatbot for your personal portfolio website.

## Overview

The chatbot is a lightweight, embedded AI assistant that answers questions about the site owner. It supports both **Claude (Anthropic)** and **Grok (xAI)** as backend providers.

## Features

- ✅ Floating widget (bottom-right corner) or inline display
- ✅ Streaming responses for real-time feedback
- ✅ Bilingual support (English/Spanish)
- ✅ Fallback responses when AI is unavailable
- ✅ Configurable AI provider (Claude or Grok)
- ✅ No user accounts or authentication required
- ✅ Stateless - no conversation memory across sessions

## Environment Configuration

### Required Variables

```bash
# Choose AI provider: "claude" or "grok"
AI_PROVIDER=claude

# If using Claude:
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# If using Grok:
XAI_API_KEY=xai-your-api-key-here

# For frontend display (must match AI_PROVIDER):
NEXT_PUBLIC_AI_PROVIDER=claude
```

### Getting API Keys

**Claude (Anthropic):**
1. Visit https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Generate a new key
5. Copy and add to `.env.local` as `ANTHROPIC_API_KEY`

**Grok (xAI):**
1. Visit https://console.x.ai/
2. Create an account or sign in
3. Navigate to API section
4. Generate API key
5. Copy and add to `.env.local` as `XAI_API_KEY`

## System Prompt Design

The system prompt defines the chatbot's behavior, constraints, and personality. It should be concise and specific.

### Example System Prompt

```typescript
const systemPrompt = `You are an AI assistant for [Your Name]'s portfolio website.

**Your role:**
- Answer questions about [Your Name]'s background, skills, experience, and projects
- Be professional, concise, and enthusiastic
- Respond in the same language as the question (English or Spanish)

**Context about [Your Name]:**
- Role: [Your Role/Title]
- Location: [Your Location]
- Education: [Your Education]
- Key Skills: [Your Skills]
- Recent Projects: [Brief Project Summaries]
- Contact: [Your Email/Social Links]
- Availability: [Your Current Status]

**Rules:**
- ONLY answer questions related to [Your Name]'s professional background
- If asked about unrelated topics, politely decline and suggest relevant questions
- Keep responses under 3-4 sentences
- Do not make up information - only use the context provided
- If you don't have information, say so and suggest checking the website's project/about pages

**Tone:**
- Professional but approachable
- Enthusiastic about technical topics
- Honest and direct
`;
```

### Customizing the System Prompt

The system prompt is passed to the `/api/chat` endpoint via the `systemInstruction` parameter:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userInput,
    systemInstruction: systemPrompt, // Your custom prompt
  }),
});
```

## Context Object

The context object contains factual information about you that the AI can reference.

### Example Context Structure

```typescript
interface PortfolioContext {
  personal: {
    name: string;
    role: string;
    location: string;
    email: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };

  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;

  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    domains: string[];
  };

  experience: Array<{
    company: string;
    role: string;
    period: string;
    highlights: string[];
  }>;

  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;

  availability: {
    status: "open" | "limited" | "unavailable";
    message: string;
  };
}
```

### Example Context Data

```typescript
const portfolioContext: PortfolioContext = {
  personal: {
    name: "Iván Caamaño",
    role: "AI/ML Engineer",
    location: "Madrid, Spain",
    email: "ivanncaamano@gmail.com",
    social: {
      github: "@ivannxbt",
      linkedin: "@_ivvann",
      twitter: "@_ivvann",
    },
  },

  education: [
    {
      degree: "Master's in Network & Telematic Services",
      institution: "Universidad Politécnica de Madrid",
      year: "2020",
    },
    {
      degree: "Bachelor's in Telecommunications Engineering",
      institution: "Universidad Politécnica de Madrid",
      year: "2018",
    },
  ],

  skills: {
    languages: ["Python", "TypeScript", "SQL"],
    frameworks: ["PyTorch", "TensorFlow", "LangChain", "Next.js"],
    tools: ["AWS", "Azure", "Databricks", "Docker", "Terraform"],
    domains: ["AI/ML", "RAG Systems", "Generative AI", "MLOps"],
  },

  experience: [
    {
      company: "Avvale",
      role: "AI Program Lead",
      period: "2024 - Present",
      highlights: [
        "Leading document generation agents using AWS Bedrock",
        "Building RAG-powered copilots for business workflows",
      ],
    },
    {
      company: "NFQ (BBVA Client)",
      role: "Senior ML Engineer",
      period: "2023 - 2024",
      highlights: [
        "Developed IMM risk analysis tooling",
        "Implemented automated reporting pipelines",
      ],
    },
  ],

  projects: [
    {
      name: "AWS Document Agent",
      description: "Automated document generation system using AWS Bedrock and LangChain",
      technologies: ["AWS Bedrock", "LangChain", "Python"],
    },
    {
      name: "Azure RAG Chatbot",
      description: "Enterprise chatbot with retrieval-augmented generation",
      technologies: ["Azure OpenAI", "Cognitive Search", "TypeScript"],
    },
  ],

  availability: {
    status: "limited",
    message: "Currently leading AI programs at Avvale, open to consulting or advisory projects with tangible impact.",
  },
};
```

### Converting Context to System Prompt

```typescript
function buildSystemPrompt(context: PortfolioContext, language: "en" | "es"): string {
  const isEnglish = language === "en";

  return `You are an AI assistant for ${context.personal.name}'s portfolio website.

Role: ${context.personal.role}
Location: ${context.personal.location}
Contact: ${context.personal.email}

Education:
${context.education.map(e => `- ${e.degree}, ${e.institution} (${e.year})`).join('\n')}

Key Skills:
- Languages: ${context.skills.languages.join(', ')}
- Frameworks: ${context.skills.frameworks.join(', ')}
- Tools: ${context.skills.tools.join(', ')}

Recent Experience:
${context.experience.map(e => `- ${e.role} at ${e.company} (${e.period})`).join('\n')}

Availability: ${context.availability.message}

Rules:
- Answer ONLY questions about ${context.personal.name}'s professional background
- Be concise (2-4 sentences max)
- Respond in ${isEnglish ? 'English' : 'Spanish'}
- If unsure, suggest checking the website's project or about pages
- Do not make up information
`;
}
```

## Usage in Components

### Current Implementation

The chat widget (`components/portfolio/chat-widget.tsx`) already implements this pattern:

```typescript
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

const reply = await callGrokAssistant({
  prompt: userMsg,
  systemInstruction: systemContext,
  fallback: () => getFallbackResponse(userMsg, lang),
});
```

### Updating the Context

To update the chatbot's knowledge:

1. Edit the `systemContext` variable in `components/portfolio/chat-widget.tsx`
2. Update the `fallbackChatProfile` object for offline responses
3. Rebuild and deploy

## Fallback Responses

The widget includes keyword-based fallback responses when the AI API is unavailable:

```typescript
const fallbackTopicMatchers = [
  {
    keywords: ["skill", "skills", "stack", "technology"],
    getAnswer: (profile) => profile.skills,
  },
  {
    keywords: ["experience", "project", "work"],
    getAnswer: (profile) => profile.experience,
  },
  // ... more matchers
];
```

This ensures the chatbot remains functional even without an active AI API connection.

## Testing

### Local Testing

```bash
# Set AI provider to Claude
echo "AI_PROVIDER=claude" >> .env.local
echo "ANTHROPIC_API_KEY=sk-ant-your-key" >> .env.local
echo "NEXT_PUBLIC_AI_PROVIDER=claude" >> .env.local

# Start development server
npm run dev

# Open http://localhost:3000
# Click the chat widget in bottom-right corner
# Ask: "What are your key skills?"
```

### Testing Different Providers

```bash
# Switch to Grok
AI_PROVIDER=grok
XAI_API_KEY=xai-your-key
NEXT_PUBLIC_AI_PROVIDER=grok

# Restart server
npm run dev
```

### Testing Fallback Mode

```bash
# Remove API keys to test fallback responses
unset ANTHROPIC_API_KEY
unset XAI_API_KEY

# Restart server - chatbot will use keyword matching
npm run dev
```

## API Endpoint

### POST /api/chat

Streams AI-generated responses based on user input.

**Request:**
```json
{
  "message": "What are your key skills?",
  "systemInstruction": "You are an AI assistant for..."
}
```

**Response:**
- Streaming text response (text/plain)
- Content chunks sent as they're generated

**Error Handling:**
- 400: Invalid request (missing message)
- 500: AI service unavailable (API key not configured)

### GET /api/chat

Returns API status and configuration.

**Response:**
```json
{
  "message": "Chat API endpoint. Use POST to chat with Claude.",
  "provider": "claude",
  "model": "claude-sonnet-4-5-20250929",
  "usage": {
    "method": "POST",
    "body": {
      "message": "Your conversational message",
      "systemInstruction": "Optional assistant context"
    }
  }
}
```

## Best Practices

### System Prompt Guidelines

1. **Be Explicit:** Clearly define what the chatbot can and cannot do
2. **Provide Context:** Include all relevant information in the system prompt
3. **Set Boundaries:** Explicitly list forbidden behaviors
4. **Define Tone:** Specify the desired communication style
5. **Language Handling:** Ensure proper multilingual support

### Security Considerations

1. **Never Expose API Keys:** Keep all keys in `.env.local` (not committed to git)
2. **Server-Side Only:** All AI API calls happen server-side, never in the browser
3. **Input Validation:** The API validates all user inputs
4. **Rate Limiting:** Consider implementing rate limiting for production
5. **Error Sanitization:** Never expose internal error details to users

### Performance Optimization

1. **Streaming:** Use streaming responses for better perceived performance
2. **Fallbacks:** Implement keyword-based fallbacks for offline functionality
3. **Token Limits:** Set appropriate `maxTokens` to control response length
4. **Caching:** Consider caching common Q&A pairs at the edge

## Troubleshooting

### Chatbot Not Responding

1. Check environment variables are set correctly
2. Verify API key is valid
3. Check browser console for errors
4. Verify `/api/chat` endpoint returns 200 status

### Wrong AI Provider

1. Ensure `AI_PROVIDER` and `NEXT_PUBLIC_AI_PROVIDER` match
2. Restart development server after changing env vars
3. Clear browser cache

### Streaming Issues

1. Verify API key has streaming permissions
2. Check network tab for connection errors
3. Ensure proper headers are set in API response

## Production Deployment

### Vercel Deployment

```bash
# Set environment variables in Vercel dashboard
vercel env add ANTHROPIC_API_KEY production
vercel env add AI_PROVIDER production
vercel env add NEXT_PUBLIC_AI_PROVIDER production

# Deploy
vercel --prod
```

### Environment Variables Checklist

- [ ] `AI_PROVIDER` set to desired provider
- [ ] `ANTHROPIC_API_KEY` or `XAI_API_KEY` configured
- [ ] `NEXT_PUBLIC_AI_PROVIDER` matches `AI_PROVIDER`
- [ ] `NEXTAUTH_SECRET` set for authentication
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain

## Cost Management

### Token Usage

Both Claude and Grok charge per token (input + output).

**Optimization strategies:**
1. Set reasonable `maxTokens` limits (1024 is usually sufficient)
2. Keep system prompts concise
3. Monitor usage via provider dashboards
4. Implement fallback responses for common questions

### Rate Limiting

Consider implementing rate limiting to prevent abuse:

```typescript
// Example: Simple in-memory rate limiter
const rateLimiter = new Map<string, number>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimiter.get(ip) || 0;

  if (now - lastRequest < 1000) { // 1 request per second
    return false;
  }

  rateLimiter.set(ip, now);
  return true;
}
```

## Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [xAI API Documentation](https://console.x.ai/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
