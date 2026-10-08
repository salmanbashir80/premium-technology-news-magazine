# Signal Desk Phase 2: Editorial Design Refinement Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Signal Desk into a world-class international technology news magazine with a premium homepage, outstanding article reading experience (720-760px measure), responsive mobile UX, dynamic SEO/JSON-LD metadata, and seamless Cloudflare deployment.

**Architecture:** Refine existing React 19 + Vite + Tailwind CSS components (`HomePage.tsx`, `ArticlePage.tsx`, `Header.tsx`, `ArticleBody.tsx`, `ArticleCard.tsx`, `pageMetadata.ts`), adding JSON-LD `NewsArticle` schema support, breadcrumb navigation, interactive share feedback, sticky Table of Contents, rich block formatting (pullquotes, data tables, key takeaways), and magazine hierarchy.

**Tech Stack:** React 19, TypeScript 5.9, Tailwind CSS v4, Lucide React, Vite 7, Cloudflare Wrangler.

**Spec:** [docs/superpowers/specs/2026-10-08-phase2-editorial-refinement-design.md](file:///c:/Users/basco/Downloads/premium-technology-news-magazine/docs/superpowers/specs/2026-10-08-phase2-editorial-refinement-design.md)

## Global Constraints
- Do not rebuild from scratch or remove working features.
- Preserve brand colors (`--color-emerald`, `--color-canvas`, `--color-paper`, `--color-ink`).
- Article body maximum width must be constrained to 720px-760px measure (`max-w-[46rem]`).
- Do not introduce external UI component libraries (keep lightweight & dependency-free).
- Every interactive control must have visible feedback (hover, focus, touch target >= 44px on mobile).

## Review Focus
1. Article body line length on 1440px desktop: Must not exceed 760px measure.
2. Mobile navigation drawer: Must lock body scroll when open and trap focus.
3. Social share copy link: Must show visual toast ("Copied!") on click.
4. Table of Contents navigation: Clicking a TOC link must smoothly scroll to the H2/H3 target anchor.
5. Cloudflare deployment: Production asset build must deploy successfully without errors.

---

### Task 1: Design System & CSS Typography Polish

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS utility classes `.prose-article`, `.article-measure`, `.kicker`, `.headline-balance`, `.headline-pretty`, pull quote styles, table formatting.

- [ ] **Step 1: Inspect current `src/index.css` and update typography rules**
- [ ] **Step 2: Add pullquote border accent, comfortable line heights, table overflow wrappers, and balanced headline classes in `src/index.css`**
- [ ] **Step 3: Run `npx tsc --noEmit` to verify CSS import safety**
- [ ] **Step 4: Commit design system changes (`git commit -m "style: refine editorial typography tokens and prose measure in index.css"`)**

---

### Task 2: Shared Component & Metadata Enhancements

**Files:**
- Modify: `src/components/article/ShareBar.tsx`
- Modify: `src/lib/pageMetadata.ts`
- Modify: `src/components/ui/ArticleCard.tsx`
- Modify: `src/components/ui/AdSlot.tsx`

**Interfaces:**
- Consumes: `Article`, `Author`, `categoryMap`
- Produces: `ShareBar` with copy link feedback, `generateArticleSchema(article)` JSON-LD generator, `ArticleCard` variants (`feature`, `secondary`, `horizontal`, `minimal`, `text`), `AdSlot` with clear disclosure labels.

- [ ] **Step 1: Update `ShareBar.tsx` to handle `navigator.clipboard.writeText` with toast state**
- [ ] **Step 2: Add `generateArticleSchema` helper in `pageMetadata.ts` to output `NewsArticle` JSON-LD schema**
- [ ] **Step 3: Refine `ArticleCard.tsx` image hover effects, typography, and author metadata line**
- [ ] **Step 4: Run typecheck (`npx tsc --noEmit`) to verify interface signatures**
- [ ] **Step 5: Commit shared component improvements (`git commit -m "feat: enhance ShareBar, ArticleCard, and pageMetadata with JSON-LD and copy feedback"`)**

---

### Task 3: Article Page Reading Experience Overhaul

**Files:**
- Modify: `src/pages/ArticlePage.tsx`
- Modify: `src/components/article/ArticleBody.tsx`
- Modify: `src/components/article/TableOfContents.tsx`
- Modify: `src/components/article/KeyTakeaways.tsx`
- Modify: `src/components/article/SourceList.tsx`
- Modify: `src/components/article/AuthorCard.tsx`

**Interfaces:**
- Consumes: `Article`, `Author`, `ShareBar`, `TableOfContents`, `KeyTakeaways`
- Produces: Complete 720-760px measure article reading experience with sticky TOC, breadcrumbs, high-res featured image, pullquotes, tables, citations, corrections, author bio, and related article grid.

- [ ] **Step 1: Update `ArticleBody.tsx` to handle tables, blockquotes, callouts, and code blocks with clean styling**
- [ ] **Step 2: Refine `ArticlePage.tsx` breadcrumbs, oversized title (`3.25rem`), developing tag, author/time meta, sticky desktop rail, and JSON-LD script tag**
- [ ] **Step 3: Polish `TableOfContents.tsx` with smooth scroll behavior and active heading highlights**
- [ ] **Step 4: Run typecheck (`npx tsc --noEmit`) to ensure clean compilation**
- [ ] **Step 5: Commit article page improvements (`git commit -m "feat: overhaul ArticlePage reading experience and rich body elements"`)**

---

### Task 4: Homepage Editorial Magazine Layout

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/ui/Newsletter.tsx`

**Interfaces:**
- Consumes: `publishedArticles`, `ArticleCard`, `Newsletter`, `AdSlot`, `categories`
- Produces: Magazine-style homepage layout with masthead, breaking news ticker, 12-col hero lead well, 3-col feed, category spotlights (AI, Tech, Startups, Business, Cyber, Ecommerce, Guides), 01-05 trending sidebar, and footer.

- [ ] **Step 1: Refine `Header.tsx` date line ("October 8, 2026 | International Edition"), search modal autofocus, mobile navigation drawer**
- [ ] **Step 2: Update `HomePage.tsx` content hierarchy (lead hero, supporting horizontal cards, latest feed, AI spotlight, 01-05 trending sidebar, guides section)**
- [ ] **Step 3: Enhance `Footer.tsx` with standards policy links, RSS/Sitemap links, and publication disclosures**
- [ ] **Step 4: Run typecheck (`npx tsc --noEmit`) and verify no broken routes**
- [ ] **Step 5: Commit homepage and layout updates (`git commit -m "feat: elevate Homepage magazine layout and header/footer masthead"`)**

---

### Task 5: Verification, Production Build & Cloudflare Deployment

**Files:**
- Modify: `wrangler.jsonc` (if needed)

**Interfaces:**
- Consumes: All updated pages & components
- Produces: Production build bundle in `dist/`, verified local preview, deployed Cloudflare Workers Assets URL.

- [ ] **Step 1: Execute `npx tsc --noEmit` and `npm run build` to ensure clean compilation**
- [ ] **Step 2: Test live page routes locally (`http://localhost:5173/`)**
- [ ] **Step 3: Execute Cloudflare deploy (`.\node_modules\.bin\wrangler deploy`)**
- [ ] **Step 4: Verify deployed Cloudflare URL content using `read_url_content`**
- [ ] **Step 5: Commit build verification & push to GitHub (`git push origin main`)**
