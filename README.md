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

1. Set up your environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Then fill in your values. Required variables:
   - `ADMIN_EMAIL` — admin login email
   - `ADMIN_PASSWORD_HASH` — bcrypt hash of your password (generate with `node generate-hash.mjs`)
   - `NEXTAUTH_SECRET` — random secret (generate with `openssl rand -base64 32`)
   - `TRUST_PROXY_HEADERS` — set `true` only when running behind a trusted reverse proxy
   - `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` — optional, enables shared production rate limiting
   - `GOOGLE_API_KEY` — Google Gemini API key (required for AI chat and summarization)

1. Install dependencies and run:

   ```bash
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

## Code Formatting

- Check formatting without changing files:

  ```bash
  npm run format:check
  ```

- Format the codebase:

  ```bash
  npm run format
  ```

Formatting rollout is currently check-only in CI to avoid noisy, large diffs while active work is in progress.

## Quality Checks

Run these checks before pushing changes:

```bash
npm run typecheck
npm run test:run
npm run lint
```

## Agent Workflow

If AI agents are used in this repo, the canonical operational guide is:

- [`AGENTS.md`](AGENTS.md)

Supporting docs for execution and consistency:

- `docs/agents/architecture-map.md`
- `docs/agents/playbook.md`
- `docs/agents/checklists.md`
- `docs/agents/task-template.md`

## Admin Panel

Visit `/admin` to manage content. Edit text, blog entries, and other content across languages. Changes are saved to `data/content-overrides.json`.

## Project Structure

```text
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

Deploy to Vercel, Netlify, or any platform that supports Next.js. Set the following environment variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH`
- `NEXTAUTH_SECRET`
- `TRUST_PROXY_HEADERS` (optional; default `false`)
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (optional; recommended for multi-instance rate limiting)
- `GOOGLE_API_KEY`
- `NEXT_PUBLIC_SITE_URL` (optional)
- `NEXT_PUBLIC_SUBSTACK_USERNAME` (optional)

## License

MIT
