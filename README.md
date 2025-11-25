# Bilingual Portfolio (ES/EN)

A modern, dark-themed bilingual portfolio built with Next.js 15, Tailwind CSS, and shadcn/ui components.

## Features

- **Bilingual Support**: Full ES/EN language support with language switcher
- **Dark Minimal Design**: Clean, modern dark theme with Tailwind CSS
- **Pages**: Home, About, Projects, Blog, Contact
- **MDX Content**: Blog posts and projects using MDX for rich content
- **API Routes**: `/api/chat` and `/api/summarize` endpoints
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
    └── CV.pdf            # Downloadable CV
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
