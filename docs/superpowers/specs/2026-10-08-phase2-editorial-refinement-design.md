# Signal Desk — Phase 2: Premium Editorial Design & Experience Specification

**Date:** 2026-10-08  
**Status:** Approved Specification  
**Project:** Signal Desk (Technology News & Analysis Publication)  
**Deployment Target:** Cloudflare Workers Assets (`https://premium-technology-news-magazine.8002salman.workers.dev`)

---

## 1. Executive Summary & Goals

Signal Desk Phase 2 refines the existing React + Vite + Tailwind CSS publication into a top-tier digital technology news magazine. The design benchmark draws inspiration from premier publications like *The Verge*, *WIRED*, *Financial Times*, *TechCrunch*, and *Bloomberg Technology*—blending authoritative serif typography with modern, crisp newsroom structure.

### Core Objectives:
1. **Editorial Masthead & Typography:** Establish a clear hierarchy using *Newsreader* (Serif Display for headlines), *Source Serif 4* (Body prose), and *Inter* (UI/Metadata).
2. **High-Impact Homepage:** Implement a magazine layout featuring a dominant lead story well, supporting breaking items, trending sidebar (01-05), category spotlights (AI, Technology, Startups, Business, Cybersecurity, E-Commerce, Guides), and distinct card variations.
3. **World-Class Article Reading Experience:** Restrict maximum body reading measure to `720px–760px` (`max-w-[46rem]`), implement breadcrumb navigation, developing badges, author metadata with avatar & role, sticky Table of Contents, Key Takeaways card, editorial pull quotes, data tables, source citations, corrections log, and author biography.
4. **Mobile Optimization & Touch UX:** Ensure clean navigation on devices ranging from 375px to 1440px+ without horizontal overflow, compact headers, accessible search modal, and touch-friendly controls.
5. **SEO & News Readiness:** Add dynamic document titles, meta descriptions, OpenGraph/Twitter cards, and JSON-LD `NewsArticle` schema for structured search indexing.

---

## 2. Architecture & Design System

### 2.1 Color Palette & Tokens
- **Backgrounds:** Canvas (`#F3F1EA`), Paper (`#FFFEFB`), Sand (`#EAE6DB`)
- **Ink & Typography:** Primary Ink (`#121212`), Ink Soft (`#2A2A28`), Muted (`#5C5A54`), Faint (`#6F6C63`)
- **Accents & Rules:** Emerald (`#0D5C46`), Emerald Soft (`#E7F2ED`), Newsred (`#9B2C2C`), Amber (`#8A5A12`), Border Rule (`#DDD8CC`), Strong Rule (`#C9C3B4`)

### 2.2 Typography Rules
- **Headlines (`font-display`):** Newsreader, optical sizing enabled, tight tracking (`-0.02em`), `text-wrap: balance`.
- **Prose Body (`font-serif`):** Source Serif 4, `1.125rem` (18px) on desktop, line-height `1.75`, paragraph spacing `1.35rem`, `text-wrap: pretty`.
- **UI & Metadata (`font-sans`):** Inter, uppercase Kickers with letter-spacing (`0.14em`), crisp 11px–13px metadata text.

---

## 3. Component & Page Refinements

### 3.1 Homepage Layout (`HomePage.tsx`)
- **Header Masthead:** Date, Edition ("US / UK International"), Standards, Tips, Newsroom links, Signal Desk logotype, search toggle, category navigation bar.
- **Breaking News Ticker:** Highlighting developing stories with a red badge, scrollable on mobile.
- **Hero Lead Well:** 12-column grid. Left 8 cols: Main lead feature card with large high-contrast image, oversized headline, dek, and author line. Right 4 cols: "Also on the Desk" list with thumbnail horizontal cards.
- **The Feed (Latest):** 3-column text & thumbnail hybrid layout with section separator.
- **Category Spotlights:**
  - **AI Section:** Feature card + 3 horizontal cards.
  - **Technology & Startups:** 2-column comparison layout with minimal card variants.
  - **Trending Sidebar (01–05):** Numbered high-interest stories alongside Editor's Picks.
  - **Business, Cybersecurity, E-commerce:** 3-column brief grids.
  - **Guides & Analysis:** 3-card deep dive block with warm background tint.
- **Newsletter Subscription Banner:** High-converting, accessible email form with instant feedback state.

### 3.2 Article Page Reading Experience (`ArticlePage.tsx`)
- **Breadcrumb Navigation:** `Home / Category / Story Title`.
- **Header Block:** Kicker label, "Developing" red badge (if breaking), oversized headline (`3.25rem` on desktop), sub-headline dek, author avatar, role, published/updated dates, reading time, share actions.
- **Featured Image:** High-resolution display with caption and photo credit.
- **Body & Sticky Sidebar:**
  - **Main Content (720-760px measure):** Key Takeaways box, lead paragraph styling, inline advertisement slots, editorial pull-quotes, data tables, tag pills, source list, corrections note, author bio box, and article-specific newsletter form.
  - **Sidebar Rail (Desktop):** Sticky Table of Contents, social share rail, square AdSlot, and "More from the Desk" vertical feed.
- **Related Stories:** 3-card grid at footer.

### 3.3 Article Body Elements (`ArticleBody.tsx`)
- Supports structured block rendering: `p`, `h2`, `h3`, `blockquote` (pull quotes), `ul`/`ol`, `image`, `table` (responsive data display), `callout`, and `code`.

### 3.4 Interactive Utilities & SEO (`pageMetadata.ts`, `ShareBar.tsx`)
- **ShareBar:** Copy link with "Copied!" feedback tooltip, X/Twitter, LinkedIn, Facebook share links.
- **SEO & Metadata:** Page-specific title, description, canonical link, OpenGraph tags (`og:title`, `og:description`, `og:type=article`, `og:image`), and JSON-LD `NewsArticle` schema script injection.

---

## 4. Quality Assurance & Deployment Plan

### Verification Checklist:
1. `npm run typecheck` & `npm run build` pass without warnings or errors.
2. Verify responsive layout across 375px, 390px, 430px, 768px, 1024px, and 1440px viewports.
3. Test all routes: Homepage, Article Pages, Category Pages, Search Page, Author Pages, Info Pages, Admin Overview.
4. Verify accessibility: keyboard navigation, dialog focus trap, focus-visible outlines, aria-labels.
5. Deploy updated build to Cloudflare Workers Assets via `wrangler deploy`.

---
