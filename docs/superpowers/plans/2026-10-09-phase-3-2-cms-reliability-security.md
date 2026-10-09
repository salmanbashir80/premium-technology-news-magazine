# Phase 3.2 — Final CMS Reliability & Security Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the four critical reliability and security gate issues for Signal Desk: dynamic React SSR with live data hydration, demo content isolation in news sitemaps, removal of unsafe static fallbacks during DB outages/empty states, and secure owner login recovery with full validation and deployment.

**Architecture:** Cloudflare Workers Edge SSR with React 19 (`renderToString` + `hydrateRoot`) receiving live Supabase PostgreSQL articles dehydrated into `window.__INITIAL_DATA__`; Supabase Auth with RLS, editorial state machine, and secure recovery for the verified OWNER account (`dudeme46@gmail.com`); strict filtering of demo content (`is_demo = false`) and 48-hour window on Google News sitemaps.

**Tech Stack:** React 19, Vite 7, TypeScript 5.9, Tailwind CSS 4, Cloudflare Workers / Wrangler 4, Supabase PostgreSQL 17 + Supabase Auth / JS v2, Playwright E2E.

**Spec:** User Prompt — PHASE 3.2 — FINAL CMS RELIABILITY & SECURITY GATE.

## Global Constraints

- Do not modify Himalayan Koh or Salman Portfolio.
- Repository: `salmanbashir80/premium-technology-news-magazine`.
- Cloudflare Account ID: `f542683e97458480452b0b8ef37a898a`.
- Supabase Project: `sxwvyidbawcontujulhc`.
- Keep existing visual design completely unchanged. Do not initiate another design cycle.
- Do not reveal or print any passwords in logs or terminal outputs.
- Retain all Phase 3.1 security protections (role escalation defense, immutable audit logs, editorial approvals).
- Keep preview `noindex, nofollow` enabled.

## Review Focus

1. Brand-new published article: Returns HTTP 200, renders correct headline and full body in initial HTML without JS, hydrates with 0 console warnings, appears in RSS and sitemaps.
2. Demo isolation: `mapDbToArticle` preserves `row.is_demo`; Google News sitemap includes only non-demo articles published within the last 48 hours.
3. Outage & empty DB resilience: Empty database returns empty feed (never hardcoded demo articles); missing or unpublished slug returns 404 (never static fallback).
4. Owner login recovery: Owner (`dudeme46@gmail.com`) can log in securely to Signal Desk CMS with OWNER privileges; password recovery flow supported; no passwords printed.
5. All 19 security suite tests, full Playwright suite, TypeScript, and production build pass with 100% verifiable evidence.

---

### Task 1: Fix Dynamic React SSR & Data Hydration Architecture (Task A)

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/ServerApp.tsx`
- Modify: `src/context/AppContext.tsx`
- Modify: `src/main.tsx`
- Modify: `src/worker/index.ts`
- Create test: `tests/dynamic-ssr.spec.ts`

**Interfaces:**
- `ServerApp`: `({ location, initialArticles }: { location: string; initialArticles?: Article[] }) => React.JSX.Element`
- `AppProvider`: `({ children, initialArticles }: { children: ReactNode; initialArticles?: Article[] }) => React.JSX.Element`
- `window.__INITIAL_DATA__`: `{ articles: Article[] }`

- [ ] **Step 1: Write dynamic SSR test in `tests/dynamic-ssr.spec.ts`**
Create Playwright test verifying that a dynamically published article (created in Supabase via service client) renders with HTTP 200, includes the headline and full body in raw initial HTML without JavaScript, and hydrates with zero warnings.

- [ ] **Step 2: Update `src/types/index.ts`**
Change `Article.isDemo` from literal `true` to `boolean` (optional or boolean) to allow real articles to have `isDemo: false`.

- [ ] **Step 3: Update `src/ServerApp.tsx` and `src/context/AppContext.tsx`**
Update `ServerApp` to accept `initialArticles?: Article[]` and forward to `AppProvider`.
In `AppProvider`, read `initialArticles` from props or `window.__INITIAL_DATA__?.articles`.

- [ ] **Step 4: Update `src/worker/index.ts`**
When rendering HTML in the worker:
1. Ensure the target article is in `liveArticles` passed to `ServerApp`.
2. Pass `initialArticles: liveArticles` into `ServerApp`.
3. Inject `<script id="__INITIAL_DATA__">window.__INITIAL_DATA__ = ...</script>` into the HTML shell right before `</body>` or in `<head>` using safe JSON serialization.

- [ ] **Step 5: Update `src/main.tsx`**
Ensure `main.tsx` hydrates `App` seamlessly with matching `window.__INITIAL_DATA__`.

- [ ] **Step 6: Run dynamic SSR test and verify PASS**
Run: `npx playwright test tests/dynamic-ssr.spec.ts`
Expected: PASS with 0 hydration errors.

- [ ] **Step 7: Commit**
`git commit -m "fix(ssr): pass live published article data to ServerApp and hydrate client seamlessly"`

---

### Task 2: Demo Content Isolation & News Sitemap 48-Hour Filter (Task B)

**Files:**
- Modify: `src/services/database/supabase.ts:56-93`
- Modify: `src/worker/index.ts:173-201`
- Create test: `scripts/test-demo-isolation.mjs`

**Interfaces:**
- `mapDbToArticle(row: any): Article`: sets `isDemo: Boolean(row.is_demo)`
- `generateNewsSitemapXml(articles: Article[]): Response`: filters `!a.isDemo && within48Hours(a.publishedAt)`

- [ ] **Step 1: Write test script `scripts/test-demo-isolation.mjs`**
Verify that `mapDbToArticle` preserves `is_demo: false` when `row.is_demo === false` and `true` when `row.is_demo === true`. Verify that `generateNewsSitemapXml` excludes all articles with `isDemo: true` and articles published older than 48 hours.

- [ ] **Step 2: Fix `mapDbToArticle` in `src/services/database/supabase.ts`**
Replace `isDemo: false as any` with `isDemo: Boolean(row.is_demo)`. Also ensure creation payload sets `is_demo: Boolean(article.isDemo)`.

- [ ] **Step 3: Update `generateNewsSitemapXml` in `src/worker/index.ts`**
Filter articles to:
`articles.filter(a => !a.isDemo && a.publishedAt && (Date.now() - new Date(a.publishedAt).getTime() <= 48 * 3600 * 1000) && (Date.now() - new Date(a.publishedAt).getTime() >= 0))`

- [ ] **Step 4: Run test script and verify PASS**
Run: `node scripts/test-demo-isolation.mjs`
Expected: PASS

- [ ] **Step 5: Commit**
`git commit -m "fix(sitemap): isolate demo content and enforce 48h window on Google News sitemap"`

---

### Task 3: Remove Unsafe Static Fallbacks & Safe Outage/Empty State Handling (Task C)

**Files:**
- Modify: `src/worker/index.ts`
- Modify: `src/services/database/supabase.ts`
- Modify: `src/pages/ArticlePage.tsx`
- Modify: `src/context/AppContext.tsx`
- Create test: `scripts/test-static-fallbacks.mjs`

**Interfaces:**
- `SupabaseArticleRepository`: returns `[]` / `null` instead of hardcoded `publishedArticles` when DB has zero records or slug not found.
- Outage handling: worker returns 503 Service Unavailable or safe empty feed if DB unreachable, never synthetic published articles.
- Slug 404: unpublished, deleted, or nonexistent slug returns HTTP 404.

- [ ] **Step 1: Write test script `scripts/test-static-fallbacks.mjs`**
Test:
1. When query returns 0 published articles, returns empty array `[]` (not `publishedArticles`).
2. When querying unpublished slug, returns null / 404 (not static demo article).
3. When database throws network error, handles safely without serving fake news stories.

- [ ] **Step 2: Remove static fallbacks from `src/worker/index.ts`**
In `getLivePublishedArticles`: if DB returns empty array `[]`, return `[]`. If DB fails, return cached or empty array `[]`.
In `getLiveArticleBySlug`: if slug is not found in DB, return `undefined` (which triggers 404).

- [ ] **Step 3: Remove static fallbacks from `src/services/database/supabase.ts`**
In `SupabaseArticleRepository`:
- `getById`: returns `null` if not in DB.
- `getBySlug`: returns `null` if not in DB.
- `list`: returns `{ data: [], count: 0 }` if DB returns empty.
Only allow demo fallbacks if `isDemoMode()` is explicitly enabled (e.g. `process.env.VITE_DEMO_MODE === 'true'`).

- [ ] **Step 4: Update `src/pages/ArticlePage.tsx` and `src/context/AppContext.tsx`**
In `ArticlePage`: if article not found, render NotFound UI (404), do not fall back to `getArticle(slug)`.
In `AppContext`: when `artRows` is empty, set `liveArticles` to `[]`.

- [ ] **Step 5: Run test script and verify PASS**
Run: `node scripts/test-static-fallbacks.mjs`
Expected: PASS

- [ ] **Step 6: Commit**
`git commit -m "fix(reliability): eliminate unsafe static fallbacks on empty DB and handle missing slugs as 404"`

---

### Task 4: Secure Owner Login Recovery & CMS Authentication (Task D)

**Files:**
- Modify: `src/components/admin/AdminLayout.tsx`
- Modify: `src/context/AppContext.tsx`
- Modify: `scripts/rotate-and-secure-accounts.mjs`
- Create: `scripts/verify-owner-login.mjs`

**Interfaces:**
- Password recovery in CMS UI: `resetPassword(email: string)` triggers Supabase Auth recovery.
- Owner login verification: script tests authentication of `dudeme46@gmail.com` without printing secrets.

- [ ] **Step 1: Implement Password Recovery in `src/components/admin/AdminLayout.tsx` and `AppContext.tsx`**
Add "Forgot Password?" state to `StaffLoginModal` that calls `supabase.auth.resetPasswordForEmail`.
Handle password update when arriving from recovery link (`supabase.auth.onAuthStateChange` with `PASSWORD_RECOVERY`).

- [ ] **Step 2: Update `scripts/rotate-and-secure-accounts.mjs`**
Ensure owner password rotation always writes the secret securely to gitignored `.env.local` (`OWNER_PASSWORD`) and NEVER prints it to the console.

- [ ] **Step 3: Create `scripts/verify-owner-login.mjs`**
Write script that logs in as `dudeme46@gmail.com` using the secure credential from `.env.local`, verifies session, checks role is `OWNER`, and logs out. Output only `[PASS]` or `[FAIL]` without printing passwords.

- [ ] **Step 4: Execute verification script and verify PASS**
Run: `node scripts/verify-owner-login.mjs`
Expected: PASS — Owner authenticated and confirmed as OWNER.

- [ ] **Step 5: Commit**
`git commit -m "feat(auth): implement secure password recovery and verify owner login"`

---

### Task 5: Security Regression Suite & Database Authorization (Task E)

**Files:**
- Run: `scripts/test-security-suite.mjs`

- [ ] **Step 1: Execute `node scripts/test-security-suite.mjs`**
Verify all 19 assertions pass:
1. Anonymous visitor cannot read audit_logs
2. Anonymous visitor cannot read story_candidates
3. Anonymous visitor receives zero draft articles
4. Anonymous visitor cannot insert articles
5. RESEARCHER cannot escalate self to OWNER
6. RESEARCHER cannot escalate self to ADMIN
7. RESEARCHER role remains uncorrupted
8. Direct draft-to-published transition is strictly BLOCKED
9. RESEARCHER cannot approve articles
10. EDITOR cannot skip workflow
11. EDITOR cannot escalate self to OWNER
12. Legitimate transition: draft -> fact_check
13. Legitimate transition: fact_check -> editorial_review
14. Legitimate transition: editorial_review -> approved
15. Legitimate transition: approved -> published
16. Publication event recorded
17. Status transitions recorded in audit_logs
18. Authenticated users cannot UPDATE audit logs
19. Authenticated users cannot DELETE audit logs

- [ ] **Step 2: Verify 19/19 PASSED**

---

### Task 6: Complete Validation & End-to-End Suite (Task F)

**Files:**
- All tests

- [ ] **Step 1: Run TypeScript check (`npx tsc --noEmit`)**
- [ ] **Step 2: Run Production Build (`npm run build`)**
- [ ] **Step 3: Run Full Playwright Test Suite (`npx playwright test`)**
- [ ] **Step 4: Run Real Article Publishing, Dynamic SSR, Client Hydration, Unpublishing verification**
- [ ] **Step 5: Verify RSS and Sitemaps with newly published article**
- [ ] **Step 6: Verify preview noindex header and meta tag**

---

### Task 7: GitHub Handoff, Pull Request & Cloudflare Deployment (Task G)

- [ ] **Step 1: Push branch `phase-3.2-cms-reliability-security` to origin**
- [ ] **Step 2: Create GitHub Pull Request from `phase-3.2-cms-reliability-security` into `main`**
- [ ] **Step 3: After checks pass, merge approved Phase 3 & security fixes in order into `main`**
- [ ] **Step 4: Verify `main` contains final tested code**
- [ ] **Step 5: Deploy to verified Signal Desk Cloudflare account (`f542683e97458480452b0b8ef37a898a`)**
- [ ] **Step 6: Prepare final report with all verifiable evidence**
