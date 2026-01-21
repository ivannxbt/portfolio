# Bilingual Portfolio (ES/EN)

A modern, dark-themed bilingual portfolio built with Next.js 15, Tailwind CSS, and shadcn/ui.

## Features

- Bilingual support (ES/EN) with language switcher
- Built-in CMS at `/admin` to manage content across languages
- MDX support for blog posts and projects
- Dark theme with responsive design
- AI chat and summarization endpoints
- GitHub contributions graph
- Downloadable CV

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

1. Set up authentication credentials in `data/secret-config.json`:
```bash
npm run secrets:init -- --admin-email=you@example.com --password=your_password --database-url="postgresql://user:pass@host/db" --nextauth-secret="secure-random-string"
```

2. Install dependencies and run:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

## Admin Panel

Visit `/admin` to manage content. Edit text, blog entries, and other content across languages. Changes are saved to `data/content-overrides.json`.

## Project Structure

```
├── app/[lang]/          # Language-specific pages
├── app/admin/           # CMS admin panel
├── app/api/             # API routes (chat, summarize, content)
├── components/          # React components
├── content/             # MDX files (blog, projects)
├── data/                # Content overrides and secrets
└── lib/                 # Utilities (i18n, mdx)
```

## Adding Content

Create MDX files in `content/blog/` or `content/projects/` with language suffixes:
- `your-post.en.mdx` (English)
- `your-post.es.mdx` (Spanish)

Example frontmatter:
```mdx
---
title: "Your Title"
description: "Brief description"
date: "2024-01-01"
tags: ["Tag1", "Tag2"]
---
```

## API Routes

- `POST /api/chat` - AI chat endpoint
- `POST /api/summarize` - Text summarization
- `PUT /api/content` - Update site content (admin only)

## Deployment

Deploy to Vercel, Netlify, or any platform that supports Next.js. Set admin credentials via `data/secret-config.json`.

## License

MIT
