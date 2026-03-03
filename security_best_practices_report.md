# Security Best Practices Report

## Executive Summary

This review covered the Next.js + React + TypeScript stack (`app/api/*`, auth/session handling, and frontend rendering paths) against the `security-best-practices` references for Next.js server and React/frontend security.

Current status: all originally reported findings (`SBP-001` to `SBP-005`) have been remediated in code. Residual risk remains operational: enable shared Redis rate limiting in production and verify deployment header trust boundaries.

## Scope & Method

- Framework/language identified: Next.js 16 (App Router), React 19, TypeScript.
- References applied:
  - `javascript-typescript-nextjs-web-server-security.md`
  - `javascript-typescript-react-web-frontend-security.md`
  - `javascript-general-web-frontend-security.md`
- Reviewed areas: auth routes/options, all API routes, rate limiting implementation, content rendering paths.

## Remediation Status

### [SBP-001] CSRF/origin protection for cookie-authenticated state-changing routes

- Rule ID: `NEXT-CSRF-*`
- Previous severity: High
- Status: Remediated
- Implemented changes:
  - Added request guard enforcing allowed `Origin`/`Referer` and required `X-Requested-With` header in `/Users/ivancaamano/Proyectos/portfolio/lib/request-guard.ts`.
  - Applied guard to:
    - `/Users/ivancaamano/Proyectos/portfolio/app/api/content/route.ts:63`
    - `/Users/ivancaamano/Proyectos/portfolio/app/api/uploads/route.ts:25`
  - Updated admin save request header in `/Users/ivancaamano/Proyectos/portfolio/components/admin-client.tsx:479`.
- Notes:
  - This is an origin + non-simple-header CSRF hardening pattern.
  - If future non-browser clients need these endpoints, they must include the required header and valid origin.

### [SBP-002] Brute-force protection on admin login

- Rule ID: `NEXT-AUTH-*`
- Previous severity: High
- Status: Remediated
- Implemented changes:
  - Added login throttling utility in `/Users/ivancaamano/Proyectos/portfolio/lib/login-throttle.ts`.
  - Integrated per-IP + per-email lockout logic into credentials `authorize` flow in `/Users/ivancaamano/Proyectos/portfolio/lib/auth.ts:64`.
  - Added tests in `/Users/ivancaamano/Proyectos/portfolio/lib/login-throttle.test.ts`.
- Current policy:
  - 5 failed attempts in 15 minutes triggers 15-minute block.

### [SBP-003] Trusted client IP extraction for rate limiting

- Rule ID: `NEXT-ABUSE-*`
- Previous severity: Medium
- Status: Remediated
- Implemented changes:
  - Added centralized client IP parsing in `/Users/ivancaamano/Proyectos/portfolio/lib/client-ip.ts`.
  - Replaced direct `x-forwarded-for` usage in:
    - `/Users/ivancaamano/Proyectos/portfolio/app/api/chat/route.ts`
    - `/Users/ivancaamano/Proyectos/portfolio/app/api/content/route.ts`
    - `/Users/ivancaamano/Proyectos/portfolio/app/api/uploads/route.ts`
    - `/Users/ivancaamano/Proyectos/portfolio/app/api/substack/route.ts`
    - `/Users/ivancaamano/Proyectos/portfolio/app/api/summarize/route.ts`
  - Added tests in `/Users/ivancaamano/Proyectos/portfolio/lib/client-ip.test.ts`.
- Operational requirement:
  - Configure `TRUST_PROXY_HEADERS=true` only behind trusted reverse proxies.

### [SBP-004] Shared/durable rate limit store for production

- Rule ID: `NEXT-ABUSE-*`
- Previous severity: Medium
- Status: Remediated (code path), pending production config
- Implemented changes:
  - Upgraded limiter to async store abstraction with Upstash Redis support in `/Users/ivancaamano/Proyectos/portfolio/lib/rate-limit.ts`.
  - Falls back to in-memory store when Redis is not configured/unavailable.
  - Updated API routes to await limiter calls.
  - Added env/doc entries:
    - `/Users/ivancaamano/Proyectos/portfolio/.env.example`
    - `/Users/ivancaamano/Proyectos/portfolio/README.md`
  - Updated tests in `/Users/ivancaamano/Proyectos/portfolio/lib/rate-limit.test.ts`.
- Operational requirement:
  - Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in production to get true multi-instance durability.

### [SBP-005] Diagnostic metadata exposure on `GET /api/chat`

- Rule ID: `NEXT-INFO-*`
- Previous severity: Low
- Status: Remediated
- Implemented changes:
  - `GET /api/chat` now returns minimal response in production.
  - Detailed debug metadata only returned in non-production.
  - Location: `/Users/ivancaamano/Proyectos/portfolio/app/api/chat/route.ts:94`.

## Validation

- `npm run lint`: passed.
- Security-related targeted tests passed:
  - `npx vitest run lib/rate-limit.test.ts lib/client-ip.test.ts lib/login-throttle.test.ts`
- Full test suite (`npm run test:run`) still has pre-existing failures unrelated to these changes:
  - `lib/content-store.test.ts` (14 failing tests, same failure pattern on mocked `readFile` return and write expectations).

## Positive Findings

- Upload filename validation blocks traversal patterns and includes `nosniff` + restrictive response CSP (`/Users/ivancaamano/Proyectos/portfolio/app/api/uploads/[filename]/route.ts:13`, `:32-34`).
- NextAuth hard-fails when `NEXTAUTH_SECRET` is missing (`/Users/ivancaamano/Proyectos/portfolio/lib/auth.ts:75`).
- `next` version is `^16.0.10`, above the vulnerable floor listed in the applied guidance.

## Remaining Actions

1. Configure Upstash env vars in production to activate shared rate-limiter backend.
2. Confirm reverse-proxy trust configuration before enabling `TRUST_PROXY_HEADERS=true`.
3. Separately triage and fix `lib/content-store.test.ts` failures to restore full CI green state.
