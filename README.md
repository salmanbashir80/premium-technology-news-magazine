# Signal Desk

Selected Option A: a frontend-only editorial magazine prototype built with React, TypeScript, Vite, Tailwind CSS v4, and React Router.

All articles, author profiles, newsroom records, and analytics are illustrative demo content. Nothing is published, submitted, or authenticated. Keep the visible demo notices until the content and editorial operation have genuinely been replaced.

## Requirements

- Node.js 22.12 or newer in the Node 22 LTS line; `.nvmrc` selects Node 22.
- npm and the committed `package-lock.json`.
- No environment variables, API keys, databases, accounts, or services are required.

## Local Development

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the local URL printed by Vite. Routes use hashes, for example `/#/article/ai-power-bottleneck-data-centers` and `/#/admin`.

## Validation

```sh
node scripts/typecheck.mjs
npm run build
npx playwright install chromium
npx playwright test
```

On a minimal Linux machine, use `npx playwright install --with-deps chromium` to install Chromium's system libraries. This is test tooling, not an application integration.

`node scripts/typecheck.mjs` is the standalone typecheck command. It invokes the installed TypeScript compiler with `--noEmit` for both the application and the test configuration. Vite's existing `npm run build` command does not perform a full TypeScript typecheck by itself. Run both commands.

The browser suite starts a local Vite preview server on `127.0.0.1:4173`, tests the built `dist/`, and shuts the server down. Free that port before testing. It does not run a build, publish files, or contact a content API. Tests use the existing Google Fonts and Pexels assets; those resources require network access.

Results and screenshots are written to `test-results/`, which is ignored by Git. The JSON result is `test-results/results.json`. Browser tests are intentionally separate from the normal production build.

## Production Preview

```sh
npm run build
npm run preview -- --host 127.0.0.1
```

`vite-plugin-singlefile` inlines the application JavaScript and CSS into `dist/index.html`. Vite also copies the retained `public/` artwork. Google Fonts and current Pexels photography are still external, so this is not an offline bundle. Preview over HTTP rather than opening a `file://` URL.

## Source Guide

| Location | Responsibility |
| --- | --- |
| `src/App.tsx` | Public/admin route tree and route metadata effects |
| `src/config/brand.ts` | Brand copy, wordmark labels, contact placeholders, demo notices |
| `src/index.css` | Established typography, emerald/paper palette, reading styles |
| `src/pages/` | Public page compositions |
| `src/pages/admin/` | In-memory editorial workflow prototype |
| `src/components/` | Shared layout, article, admin, and UI components |
| `src/data/` | Demo stories, authors, categories, assets, and admin records |
| `src/context/AppContext.tsx` | Session-only newsletter, search, and admin state |
| `src/lib/` | Date formatting, same-page scrolling, and metadata |
| `src/types/` | Domain types |
| `scripts/typecheck.mjs` | Portable no-emit TypeScript validation |
| `tests/` | Route, interaction, responsive, accessibility, and data checks |
| `docs/HANDOFF.md` | Full file structure, route inventory, and future GitHub export steps |
| `docs/QA.md` | Recorded validation results and scope |

## Boundaries

- No Supabase, Cloudflare Workers, Hermes, n8n, authentication, live APIs, or publishing integrations exist.
- `/admin` is deliberately public and contains only demo data. It is not a secured CMS.
- Admin changes and newsletter confirmation reset on reload; settings controls are illustrative and do not enforce publishing rules.
- Contact uses a local demo acknowledgement. Newsletter validation is local. Neither form sends data.
- Share buttons are user-initiated external links; copy-link uses the actual prototype address, not the placeholder domain.
- Author names, biographies, addresses, email addresses, and social destinations are placeholders. Stock portraits are not verified identities.
- Reference lists describe demonstration research, not independently verified reporting.

Do not deploy this as a factual news service. Source handoff does not imply editorial, legal, security, or cross-browser production approval.