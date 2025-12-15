# Bilingual Portfolio (ES/EN)

A modern, dark-themed bilingual portfolio built with Next.js 15, Tailwind CSS, and shadcn/ui components.

## Features

- **Bilingual Support**: Full ES/EN language support with language switcher
- **Dark Minimal Design**: Clean, modern dark theme with Tailwind CSS
- **Pages**: Home, About, Projects, Blog, Contact
- **MDX Content**: Blog posts and projects using MDX for rich content
- **API Routes**: `/api/chat` and `/api/summarize` endpoints
- **Built-in CMS**: `/admin` screen to edit hero/about/contact copy across languages
- **CV Download**: Downloadable CV/Resume button
- **Responsive**: Mobile-first responsive design

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

### Environment Setup

Create a `.env.local` file in the root directory to store any public configuration (AI keys, feature flags, etc.):

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Authentication credentials and your database connection string are kept securely in `data/secret-config.json`, which is ignored by Git. Populate or rotate that file with:

```
npm run secrets:init -- --admin-email=you@example.com --password=your_password --database-url="postgresql://user:pass@host/db" --nextauth-secret="secure-random-string"
```

The helper automatically bcrypt-hashes `--password` (use `--password-hash` if you already have a hash) and merges with whatever fields you don't touch. An example template is provided at `data/secret-config.example.json`.

If you still prefer to drive admin credentials from `.env.local`, keep the same variables as before—just ensure `ADMIN_PASSWORD_HASH` is a bcrypt hash (from `npx bcryptjs -s 10` or a trusted bcrypt generator).

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Editing Content via Backend

- Visit [`/admin`](http://localhost:3000/admin) while the dev server is running to access the lightweight CMS. If you're not signed in you'll be redirected to [`/admin/login`](http://localhost:3000/admin/login); use the email from `ADMIN_EMAIL` and the password corresponding to your `ADMIN_PASSWORD_HASH`.
- Pick a language, edit any section (navigation, hero, about, experience, projects, blog, contact, footer, and theme fonts), and press **Save changes**.  
  The CMS issues a `PUT /api/content` request that persists overrides in `data/content-overrides.json`.
- Long-form fields (hero subheadline, about summary, blog descriptions, project blurbs, contact copy, etc.) support Markdown for bold text, lists, and `[links](https://example.com)`.
- Scroll down to the **Blog entries** section to edit the list of articles (title, date label, summary, optional external URL). Changes instantly flow to the home page and the `/blog` route.
- You can also script updates. Example:

```bash
curl -X PUT http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -d '{
        "lang": "en",
        "content": {
          "hero": { "headline": "New headline" },
          "contact": { "email": "ivanncaamano@gmail.com" }
        }
      }'
```

## Project Structure

```
├── app/
│   ├── [lang]/           # Language-specific routes
│   │   ├── about/        # About page
│   │   ├── blog/         # Blog pages
│   │   ├── contact/      # Contact page
│   │   └── projects/     # Projects page
│   ├── api/              # API routes
│   │   ├── chat/         # Chat endpoint
│   │   └── summarize/    # Summarize endpoint
│   └── layout.tsx        # Root layout
├── components/           # React components
│   └── ui/               # shadcn/ui components
├── content/              # MDX content
│   ├── blog/             # Blog posts
│   └── projects/         # Project descriptions
├── lib/                  # Utility functions
│   ├── i18n.ts           # Internationalization
│   ├── mdx.ts            # MDX utilities
│   └── utils.ts          # General utilities
└── public/
    └── cv_iacc.pdf       # Downloadable CV
```

## Adding Content

### Blog Posts

Create MDX files in `content/blog/`:
- `your-post.en.mdx` for English
- `your-post.es.mdx` for Spanish

### Projects

Create MDX files in `content/projects/`:
- `your-project.en.mdx` for English
- `your-project.es.mdx` for Spanish

### MDX Frontmatter

```mdx
---
title: "Your Title"
description: "Brief description"
date: "2024-01-01"
tags: ["Tag1", "Tag2"]
github: "https://github.com/..."
demo: "https://..."
---

Your content here...
```

## API Routes

### POST /api/chat
```json
{
  "message": "Your message"
}
```

### POST /api/summarize
```json
{
  "text": "Text to summarize"
}
```

## License

MIT
