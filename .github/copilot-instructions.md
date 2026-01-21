# Portfolio Copilot Notes

This file captures repository-specific rules, architecture, and conventions to help an AI coding agent be productive immediately. Keep entries short and actionable — prefer exact file references and examples.

## Big picture
- **Framework**: Next.js (App Router) with TypeScript and Tailwind CSS. Entry points: `app/layout.tsx` and `app/[lang]/layout.tsx`.
- **Locales**: App routes are localized under `app/[lang]/` — localization is validated in `lib/i18n.ts` and translations are fetched via `getTranslations(lang)`.
- **Content-driven site**: Content is sourced from `content/` (MDX) and `content/site-content.ts` (default JSON-like payload). Overrides live in `data/content-overrides.json` and are merged by `lib/content-store.ts`.

## Key files & patterns (use these as examples)
- `app/admin/page.tsx` — client-side CMS editor that PUTs to `/api/content`; keep the `LandingContent` shape in sync.
- `lib/content-store.ts` — server-only, reads/writes `data/content-overrides.json`; import only in server components or route handlers.
- `lib/mdx.ts` — MDX compilation and slug discovery; localized MDX filenames follow `slug.en.mdx` / `slug.es.mdx`.
- `components/portfolio-landing.tsx` — main landing client; sets theme CSS variables from content and uses `NEXT_PUBLIC_GEMINI_API_KEY` for AI responses.
- `app/[lang]/blog/[slug]/page.tsx` — shows how frontmatter is read and rendered via `compileMDX`.

## Development workflows
- Run dev server: `npm run dev`.
- Build for production: `npm run build` then `npm run start`.
- Linting: `npm run lint` (ESLint 9 config in repo). Run lint before commits.
- Tests: no test suite currently; rely on lint + manual smoke tests (open `/admin`, `/[lang]/blog`, `/[lang]/projects`).

## Conventions & gotchas
- **Server vs Client imports**: Modules that access the filesystem (e.g., `lib/content-store.ts`, `lib/mdx.ts`) must only be imported in server components, API routes, or `generateStaticParams`/`generateMetadata` to avoid build-time errors.
- **MDX localization**: For any new blog/project, provide `slug.en.mdx` and `slug.es.mdx` to avoid 404s for missing locales.
- **Content overrides merging**: The admin UI appends keys; preserve stable `id` fields for blog posts and projects to avoid creating duplicates in `data/content-overrides.json`.
- **Auth for admin**: Admin writes are protected in `app/api/content/route.ts`. `lib/auth.ts` normalizes email and reads `.env` fallbacks — use those helpers.

## AI & external integrations
- Gemini (or other AI): components expect `NEXT_PUBLIC_GEMINI_API_KEY`. When missing, `components/portfolio/chat-widget.tsx` falls back to `getFallbackResponse` — keep that behavior when modifying.
- GitHub contributions: `components/github-contributions.tsx` fetches client-side only to avoid server build fetches.

## When modifying or adding features
- Add server-only helpers under `lib/` and import them only from server boundaries.
- Update `content/site-content.ts` and both `en` and `es` objects when adding new content fields.
- When changing the `LandingContent` shape, update the admin form at `app/admin/page.tsx` and the API contract in `app/api/content/route.ts` simultaneously.

## Local env & secrets
- Required for full functionality: `NEXT_PUBLIC_GEMINI_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET` (put in `.env.local`). Missing Gemini disables AI answers; missing admin creds prevents CMS writes.

## Quick examples
- Add a localized project MDX: `content/projects/my-project.en.mdx` and `content/projects/my-project.es.mdx`.
- Read merged content on the server: `import { getLandingContent } from 'lib/content-store'; const content = await getLandingContent('en');`

If anything here is unclear or you want more examples (API payload shapes, `LandingContent` type, or MDX frontmatter schema), tell me which area to expand. 
