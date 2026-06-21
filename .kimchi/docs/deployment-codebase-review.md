# Deployment State & Codebase Review — Portfolio Website

**Date:** 2026-06-21  
**Branch:** `preview`  
**Repository:** https://github.com/dsahu1001-git/portfolio-website  
**Deployments:** Cloudflare Workers (Next.js via OpenNext) + D1  
**Legacy Surface:** Static HTML/CSS/JS at repo root (served by GitHub Pages from `main`)

---

## Executive Summary

The project is a well-architected Next.js 15 portfolio/blog deployed to Cloudflare Workers. The CI/CD pipeline is healthy, build/test/typecheck all pass, and security patterns are solid (CSP headers, Zod validation, no secrets in source). However, there are **6 high-severity npm vulnerabilities**, **critically low test coverage** (1 unit test), **no API rate limiting**, and a **dual-site coexistence** (static HTML root + Next.js app) that creates deployment confusion.

---

## Deployment State

| Check | Status | Notes |
|---|---|---|
| Last deploy (preview) | ✅ Success | gh run list shows recent successful deploys |
| Last deploy (production) | ⚠️ Not done from `preview` | Production deploys only from `main` push |
| CI (lint / typecheck / test / build / e2e) | ✅ Passing | `.github/workflows/ci.yml` runs full regression |
| Cloudflare Worker preview | ✅ Live | `deepak-portfolio-preview.dsahu1001.workers.dev` |
| Cloudflare Worker production | ✅ Live | `deepak-portfolio` Worker deployed from `main` |
| D1 Database (preview) | ✅ Provisioned | `deepak-newsletter-preview` |
| D1 Database (production) | ✅ Provisioned | `deepak-newsletter-production` |
| Domain cutover | ⚠️ Pending | `deepaksahu.dev` still points to GitHub Pages static site |

### Critical Finding: Dual-Site Coexistence

The repository root contains a static HTML portfolio (`index.html`, `css/`, `js/`, `assets/`) that is served by GitHub Pages from the `main` branch. The Next.js app (under `app/`) is deployed to Cloudflare Workers. The README explicitly states:

> "The existing GitHub Pages site serves the root static portfolio from `main` at `https://deepaksahu.dev/` until the Next.js migration is approved."

**Risk:** Visitors to `deepaksahu.dev` see an entirely different site than the Cloudflare Worker preview. SEO split, content drift, and user confusion.

---

## Codebase Health

### What Works Well

1. **Security posture:** CSP headers in `_headers`, no secrets committed, `.env.local.example` uses dummy values, GitHub Actions uses minimal `permissions: contents: read`, broadcast API protected by bearer token, Zod validation on all API inputs.
2. **Database schema:** Well-designed D1 schema with indexes, foreign keys, `CHECK` constraints, and audit tables (`consent_events`).
3. **CI/CD completeness:** Lint → typecheck → unit tests → build → e2e tests (Playwright) → deploy → smoke tests → secret sync.
4. **Environment parity:** Preview and production environments with isolated D1 databases.
5. **OpenGraph / SEO:** Dynamic `opengraph-image.tsx`, `robots.ts`, `sitemap.ts` generation.

### Issues Found

#### 🚨 High Priority

| # | Issue | Evidence | Impact |
|---|---|---|---|
| 1 | **6 high-severity npm vulnerabilities** | `npm audit` shows: `undici` (TLS bypass, DoS), `ws` (memory exhaustion DoS), `miniflare` (via `undici`/`ws`), `wrangler` (via `esbuild`/`miniflare`), `vite` (fs.deny bypass), `form-data` (CRLF injection) | Production Worker could be exposed to DoS, request smuggling, or file-system traversal |
| 2 | **Only 1 unit test** | `lib/utils.test.ts` is the only test file; `vitest.config.ts` only includes `lib/**/*.test.ts` | Zero coverage for newsletter logic, API routes, database queries, affiliate validation |
| 3 | **No API rate limiting** | `app/api/newsletter/route.ts`, `app/api/contact/route.ts`, `app/api/game/score/route.ts` accept unlimited requests | Newsletter/contact endpoints vulnerable to spam/abuse; D1 writes unbounded |
| 4 | **No e2e coverage for admin/broadcast endpoints** | `tests/e2e/api.spec.ts` tests public APIs only; broadcast 401 is tested but not success path |No regression protection for newsletter sending pipeline |
| 5 | **Static `sitemap.xml` at root** | `sitemap.xml` in repo root has only 1 URL and is stale (lastmod 2026-05-15); `app/sitemap.ts` generates a full dynamic sitemap but may not be emitted to the root | Search engines may index the stale root sitemap instead of the generated one |

#### ⚠️ Medium Priority

| # | Issue | Evidence | Impact |
|---|---|---|---|
| 6 | **28+ outdated dependencies** | `npm outdated` shows React 18→19, Next.js 15→16, Tailwind 3→4, ESLint 8→10, etc. | Missing bug fixes, performance improvements, security patches |
| 7 | **No dependency update automation** | No Dependabot or Renovate config | Vulnerabilities and outdated packages accumulate silently |
| 8 | **`next.config.mjs` is empty** | `const nextConfig = {};` | No image remotePatterns, no bundle analyzer, no experimental features, no redirects for old static site URLs |
| 9 | **No error tracking / observability** | No Sentry, Logflare, or custom error boundary logging | Failures in production (Resend API errors, D1 failures) are invisible |
| 10 | **No structured data (JSON-LD)** | `layout.tsx` has rich OpenGraph/Twitter metadata but no `application/ld+json` | Missed rich snippets in search results for articles and person branding |
| 11 | **Playwright e2e uses `npm run dev`** | `playwright.config.ts` webServer runs `npm run dev -- --hostname 127.0.0.1 --port 3100` | E2E tests exercise the dev server, not the production build; `next dev` has different behavior than `next build` + `next start` |
| 12 | **`@supabase/supabase-js` imported but unused?** | Listed in `dependencies`; no clear Supabase client usage in `lib/` or `app/` | Dead dependency adds 100+ transient packages |

#### 💡 Low Priority / Nice to Have

| # | Issue | Evidence | Impact |
|---|---|---|---|
| 13 | **No `robots.txt` route protection** | Static `robots.txt` at root may conflict with `app/robots.ts` | Same dual-site pattern as sitemap |
| 14 | **Makefile `ci` target omits e2e** | `ci: lint typecheck test` — does not include build or e2e | Local `make ci` does not match CI pipeline completeness |
| 15 | **No caching strategy for API routes** | API routes (game puzzle, affiliate) have no `Cache-Control` | Repeated identical requests hit the Worker/D1 unnecessarily |

---

## Recommendations I Would Drive

### Phase 1: Security & Stability (Do First)

1. **Pin and upgrade vulnerable dependencies**
   - `npm audit fix` to auto-fix where possible
   - Manually bump `wrangler` → latest (patches `esbuild`, `miniflare`)
   - Verify `undici` and `ws` are resolved to patched versions in the lockfile
   - Add `npm audit` step to CI so builds fail on new high/critical vulnerabilities

2. **Add API rate limiting**
   - Use Cloudflare Turnstile (CAPTCHA) on newsletter/contact forms
   - Or implement a simple in-memory rate limiter using D1 or Cloudflare KV:
     - `/api/newsletter` → max 3 submissions / 15 min per IP
     - `/api/contact` → max 2 submissions / 15 min per IP
     - `/api/game/score` → max 10 submissions / 5 min per IP

3. **Consolidate to single site entrypoint**
   - Delete or archive the root static HTML/CSS/JS files (`index.html`, `css/`, `js/`, `assets/`)
   - Update GitHub Pages to serve from a dedicated `gh-pages` branch or disable it
   - Point `deepaksahu.dev` DNS to the Cloudflare Worker
   - Add redirects in `next.config.mjs` for any old static-site anchor links

### Phase 2: Quality & Coverage (Do Next)

4. **Expand unit test coverage**
   - Target: `lib/newsletter.ts` (subscribe, confirm, unsubscribe)
   - Target: `lib/broadcast.ts` (newsletter broadcast logic)
   - Target: `lib/markdown.ts` and `lib/mdx.ts` (content parsing)
   - Target: `lib/affiliate.ts` (URL validation, host allowlisting)
   - Use `vitest` with mocked D1 (`miniflare` or in-memory SQLite)

5. **Expand e2e coverage**
   - Add test: newsletter confirmation flow end-to-end (subscribe → confirm email → unsubscribe)
   - Add test: contact form success path with mocked Resend
   - Add test: 404 page renders correctly
   - Switch Playwright webServer to use `npm run build && npm start` instead of `npm run dev`

6. **Add Dependabot**
   - Create `.github/dependabot.yml` with weekly npm updates
   - Group minor/patch updates; separate major updates for review

### Phase 3: Performance & Polish (Do After)

7. **Configure `next.config.mjs`**
   - Add `images.remotePatterns` if any external images are used
   - Add `@next/bundle-analyzer` as a dev dependency and a `build:analyze` script
   - Add redirects for old static site paths

8. **Add observability**
   - Integrate Sentry or a lightweight custom error logger for API route exceptions
   - Log D1 query failures and Resend API errors with request context

9. **Add JSON-LD structured data**
   - `Person` schema on the homepage
   - `BlogPosting` schema on blog articles
   - `BreadcrumbList` on hierarchical pages

10. **Clean up dead dependencies**
    - Verify if `@supabase/supabase-js` is truly unused; if so, remove it
    - Audit other dependencies for similar bloat

---

## Appendix: Dependency Audit Summary

```
Total vulnerabilities: 9
  Low:     1  (esbuild)
  Moderate: 2  (gray-matter → js-yaml, undici)
  High:    6  (undici, miniflare, wrangler, vite, form-data, ws)
  Critical: 0

Outdated major versions:
  React          18.3.1  →  19.2.7
  Next.js        15.5.18 →  16.2.9
  Tailwind CSS   3.4.4   →  4.3.1
  ESLint         8.57.0  →  10.5.0
  TypeScript     5.5.2   →  6.0.3
  @types/react   18.3.3  →  19.2.17
```
