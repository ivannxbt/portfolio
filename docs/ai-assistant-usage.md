# AI Assistant Component Usage

The new **inline search-bar style AI assistant** component provides a clean, integrated chat interface similar to Vercel and Linear's design patterns.

## Component: `AIAssistant`

Location: `components/portfolio/ai-assistant.tsx`

### Design Philosophy

- **Inline, not floating**: Integrated into page layout, not a corner widget
- **Search-bar aesthetic**: Horizontal input with icon and button
- **Progressive disclosure**: Conversation history expands above when needed
- **Minimal by default**: Single input bar, clean and unobtrusive
- **Streaming responses**: Real-time text generation

## Basic Usage

```tsx
import { AIAssistant } from "@/components/portfolio/ai-assistant";

export default function Page() {
  return (
    <div className="container py-20">
      <h1>Ask Me Anything</h1>

      <AIAssistant
        lang="en"
        theme="dark"
      />
    </div>
  );
}
```

## Props

```typescript
type AIAssistantProps = {
  lang: Locale;                    // Required: "en" | "es"
  theme?: "light" | "dark";        // Optional: defaults to "dark"
  placeholder?: string;            // Optional: custom input placeholder
  systemPrompt?: string;           // Optional: custom AI instructions
};
```

## Examples

### English with Dark Theme

```tsx
<AIAssistant
  lang="en"
  theme="dark"
/>
```

**Result:** Dark-themed assistant with English text

---

### Spanish with Light Theme

```tsx
<AIAssistant
  lang="es"
  theme="light"
/>
```

**Result:** Light-themed assistant with Spanish text

---

### Custom Placeholder

```tsx
<AIAssistant
  lang="en"
  theme="dark"
  placeholder="What would you like to know about my projects?"
/>
```

---

### Custom System Prompt

```tsx
const customPrompt = `You are an AI assistant for John Doe's portfolio.

Background:
- Senior Full Stack Engineer at Tech Corp
- 8 years experience with React, Node.js, Python
- Specializes in scalable web applications and cloud infrastructure

Key Projects:
- E-commerce platform serving 1M+ users
- Real-time analytics dashboard using WebSockets
- Serverless API gateway on AWS Lambda

Answer questions concisely and professionally.
If asked about unrelated topics, politely decline.
Always respond in English.`;

<AIAssistant
  lang="en"
  theme="dark"
  systemPrompt={customPrompt}
/>
```

---

## Full Page Example

```tsx
// app/ask-me/page.tsx
import { AIAssistant } from "@/components/portfolio/ai-assistant";

export default function AskMePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="container max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Ask Me Anything
          </h1>
          <p className="text-zinc-400 text-lg">
            I'm here to answer questions about my work, skills, and experience.
          </p>
        </div>

        <AIAssistant
          lang="en"
          theme="dark"
        />

        <div className="mt-16 text-center">
          <p className="text-zinc-500 text-sm">
            Suggested questions:
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs">
              What are your key skills?
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs">
              Tell me about your experience
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs">
              What projects have you worked on?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Embedded in Existing Page

```tsx
// app/about/page.tsx
import { PortfolioLanding } from "@/components/portfolio-landing";
import { AIAssistant } from "@/components/portfolio/ai-assistant";

export default function AboutPage() {
  return (
    <>
      <PortfolioLanding lang="en" />

      <section className="py-20 bg-zinc-900">
        <div className="container max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            Have Questions?
          </h2>

          <AIAssistant
            lang="en"
            theme="dark"
            placeholder="Ask about my experience, skills, or projects..."
          />
        </div>
      </section>
    </>
  );
}
```

---

## Styling

The component is fully styled with Tailwind CSS and adapts to light/dark themes automatically.

**Color Scheme:**
- **Dark theme**: Zinc-950 background, teal-500 accents
- **Light theme**: White background, zinc-900 accents

**Responsive:**
- Mobile: Button text hidden, icon only
- Desktop: Full "Send" button text visible

**Animations:**
- Smooth expand/collapse for conversation history
- Loading spinner during generation
- Hover states on all interactive elements

---

## Behavior

### Conversation Flow

1. User types question → presses Enter or clicks Send
2. Input clears, user message appears
3. Loading indicator shows ("Thinking...")
4. Assistant response streams in word-by-word
5. Conversation history expands above input bar

### Features

- **Auto-scroll**: Automatically scrolls to latest message
- **Clear conversation**: X button to reset chat history
- **Keyboard shortcuts**: Enter to send, Shift+Enter for new line
- **Streaming**: Real-time text generation (not buffered)
- **Error handling**: Graceful fallback on API errors

---

## Comparison: Old vs New

| Feature | Old (`chat-widget.tsx`) | New (`ai-assistant.tsx`) |
|---------|------------------------|--------------------------|
| **Position** | Floating (bottom-right corner) | Inline (within page flow) |
| **Aesthetic** | Chat window with header | Search bar interface |
| **Collapsed State** | Minimized to button | Always visible as input bar |
| **Conversation** | Shown inside modal | Expands above input bar |
| **Use Case** | Global site assistant | Section-specific Q&A |

---

## Customization Guide

### Change Colors

Edit the component file to use your brand colors:

```tsx
// User message background
bg-teal-500/90  →  bg-purple-500/90

// Assistant message background
bg-zinc-800/80  →  bg-slate-800/80

// Button gradient
from-teal-500 to-emerald-500  →  from-blue-500 to-indigo-500
```

### Add Suggested Questions

```tsx
<AIAssistant lang="en" theme="dark" />

<div className="mt-6 flex gap-2">
  <button
    onClick={() => handleSuggestedQuestion("What are your skills?")}
    className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
  >
    What are your skills?
  </button>
</div>
```

### Persist Conversation (localStorage)

```tsx
// Save on message update
useEffect(() => {
  localStorage.setItem('chat-history', JSON.stringify(messages));
}, [messages]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('chat-history');
  if (saved) {
    setMessages(JSON.parse(saved));
  }
}, []);
```

---

## API Integration

The component uses the existing `/api/chat` endpoint:

```typescript
POST /api/chat
{
  "message": "What are your key skills?",
  "systemInstruction": "You are an AI assistant for..."
}

Response: Streaming text/plain
```

Configured via environment variables:
- `AI_PROVIDER` - "claude" or "grok"
- `ANTHROPIC_API_KEY` or `XAI_API_KEY`
- `NEXT_PUBLIC_AI_PROVIDER` - for frontend display

---

## Accessibility

- **Keyboard navigation**: Full keyboard support (Enter to send)
- **ARIA labels**: All buttons have proper labels
- **Focus management**: Input autofocus on page load
- **Screen readers**: Semantic HTML structure

---

## Performance

- **Code splitting**: Component is client-side only (`"use client"`)
- **Optimized re-renders**: Uses `useCallback` for handlers
- **Streaming**: No buffering delays, instant feedback
- **Lightweight**: ~250 lines, no heavy dependencies

---

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14+)
- Mobile: ✅ Responsive design

---

## Troubleshooting

### No response from assistant

1. Check environment variables are set correctly
2. Verify API key is valid
3. Check browser console for errors
4. Test `/api/chat` endpoint directly

### Styling issues

1. Ensure Tailwind CSS is properly configured
2. Check `theme` prop matches your site theme
3. Verify dark mode classes are enabled

### Streaming not working

1. Confirm API route returns streaming response
2. Check network tab for chunked transfer
3. Verify browser supports ReadableStream API

---

## Migration from Old Widget

If you're replacing `ChatWidget` with `AIAssistant`:

**Before:**
```tsx
<ChatWidget lang="en" theme="dark" variant="floating" />
```

**After:**
```tsx
<AIAssistant lang="en" theme="dark" />
```

The old widget can coexist with the new one if needed.
