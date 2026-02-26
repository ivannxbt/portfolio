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

### 1) Frontend environment setup (public variables)

Create your local env file:

```bash
cp .env.example .env.local
```

Set the **public** variables used by browser/client code:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL used for metadata, sitemap, and robots.
- `NEXT_PUBLIC_SUBSTACK_USERNAME` — Substack username used for blog links and feed reads.
- `NEXT_PUBLIC_API_BASE_URL` — optional API origin for split deployments (for example `https://api.your-domain.com`). Leave empty for same-origin `/api/*` calls.

### 2) Backend environment setup (server-only secrets)

Set the following **secret** variables for API/auth services:

- `ADMIN_EMAIL` — admin login email.
- `ADMIN_PASSWORD_HASH` — bcrypt hash for admin login (generate with `node generate-hash.mjs`).
- `NEXTAUTH_SECRET` — random secret for NextAuth sessions (generate with `openssl rand -base64 32`).
- `GOOGLE_API_KEY` — Google Gemini API key for server-side AI calls.
- `DATABASE_URL` — optional DB connection string (reserved/future use).

### 3) Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

### Environment matrix

| Variable | Layer | Required | Used by |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Frontend (public) | No | Metadata, sitemap, robots |
| `NEXT_PUBLIC_SUBSTACK_USERNAME` | Frontend (public) | No | Substack links/feed |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend (public) | No | Browser calls to backend `/api/*` endpoints |
| `ADMIN_EMAIL` | Backend (secret) | Yes (admin) | Credentials auth check |
| `ADMIN_PASSWORD_HASH` | Backend (secret) | Yes (admin) | Credentials auth check |
| `NEXTAUTH_SECRET` | Backend (secret) | Yes | Session/JWT signing |
| `GOOGLE_API_KEY` | Backend (secret) | Yes (AI) | Server-side Gemini requests |
| `DATABASE_URL` | Backend (secret) | No | Future DB-backed storage |


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

Deploy to Vercel, Netlify, or any platform that supports Next.js.

Set both layers in your host:

- **Frontend/public:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUBSTACK_USERNAME`, `NEXT_PUBLIC_API_BASE_URL`.
- **Backend/secret:** `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_SECRET`, `GOOGLE_API_KEY`, and optional `DATABASE_URL`.

## License

MIT
