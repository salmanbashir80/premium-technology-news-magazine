# Source Handoff

The Signal Desk Option A design is preserved. This pass adds repeatable QA, fixes verified frontend defects, and prepares portable source. No GitHub remote was connected, no repository was created, and nothing was deployed.

## Final Source Structure

Generated output, dependencies, test reports, and browser caches are deliberately excluded from this tree.

```text
.
|-- .gitattributes
|-- .gitignore
|-- .nvmrc
|-- README.md
|-- docs/
|   |-- HANDOFF.md
|   `-- QA.md
|-- index.html
|-- package.json
|-- package-lock.json
|-- playwright.config.ts
|-- tsconfig.json
|-- tsconfig.qa.json
|-- vite.config.ts
|-- scripts/
|   `-- typecheck.mjs
|-- public/
|   `-- images/
|       |-- chip-foundry.jpg
|       |-- cyber-ops.jpg
|       |-- hero-ai-cluster.jpg
|       |-- newsroom.jpg
|       |-- startup-pitch.jpg
|       `-- warehouse-robots.jpg
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- index.css
|   |-- config/
|   |   `-- brand.ts
|   |-- context/
|   |   `-- AppContext.tsx
|   |-- types/
|   |   `-- index.ts
|   |-- utils/
|   |   `-- cn.ts
|   |-- lib/
|   |   |-- dom.ts
|   |   |-- format.ts
|   |   `-- pageMetadata.ts
|   |-- data/
|   |   |-- admin.ts
|   |   |-- articles.ts
|   |   |-- authors.ts
|   |   |-- categories.ts
|   |   `-- media.ts
|   |-- components/
|   |   |-- admin/
|   |   |   |-- AdminLayout.tsx
|   |   |   `-- status.tsx
|   |   |-- article/
|   |   |   |-- ArticleBody.tsx
|   |   |   |-- AuthorCard.tsx
|   |   |   |-- KeyTakeaways.tsx
|   |   |   |-- ReadingProgress.tsx
|   |   |   |-- ShareBar.tsx
|   |   |   |-- SourceList.tsx
|   |   |   `-- TableOfContents.tsx
|   |   |-- brand/
|   |   |   `-- Logo.tsx
|   |   |-- layout/
|   |   |   |-- Footer.tsx
|   |   |   |-- Header.tsx
|   |   |   `-- PublicLayout.tsx
|   |   `-- ui/
|   |       |-- AdSlot.tsx
|   |       |-- ArticleCard.tsx
|   |       `-- Newsletter.tsx
|   `-- pages/
|       |-- ArticlePage.tsx
|       |-- AuthorPage.tsx
|       |-- CategoryPage.tsx
|       |-- HomePage.tsx
|       |-- InfoPages.tsx
|       |-- SearchPage.tsx
|       `-- admin/
|           `-- AdminPages.tsx
`-- tests/
    |-- accessibility.spec.ts
    |-- catalogue.ts
    |-- helpers.ts
    |-- interactions.spec.ts
    |-- responsive.spec.ts
    `-- routes.spec.ts
```

The six files in `public/images/` are retained original demo artwork. The current `src/data/media.ts` uses Pexels URLs, and the mock media library still names original assets. They are intentionally retained as source deliverables rather than deleted speculatively. Validate rights and attribution before any publication.

## Route Inventory

There are 52 concrete routes. Prefix each path with `/#` when opening the current HashRouter prototype. For example, `/admin/media` becomes `http://localhost:5173/#/admin/media`, not a server-side `/admin/media` page.

| Group | Paths |
| --- | --- |
| Home | `/` |
| Categories | `/category/ai`, `/category/technology`, `/category/startups`, `/category/business`, `/category/cybersecurity`, `/category/ecommerce`, `/category/guides` |
| Search | `/search`, with an optional `?q=...` inside the route hash |
| Authors | `/author/maya-ellison`, `/author/james-whitfield`, `/author/priya-ramanathan`, `/author/oliver-grant`, `/author/helen-cho` |
| Editorial | `/about`, `/contact`, `/editorial-policy`, `/corrections-policy`, `/privacy`, `/terms` |
| Admin | `/admin`, `/admin/discovery`, `/admin/research`, `/admin/drafts`, `/admin/approvals`, `/admin/published`, `/admin/media`, `/admin/seo`, `/admin/automation`, `/admin/settings` |

Article paths use `/article/` followed by one of these 22 slugs:

```text
ai-power-bottleneck-data-centers
smaller-specialised-ai-models
chip-war-supply-chains
london-fintech-series-d
conversational-commerce-checkout
board-cybersecurity-gap
open-source-models-enterprise-buying
app-store-regulation-five-years
evaluating-ai-vendors-guide
startups-profitability-wrong-metric
uk-ai-safety-institute
warehouse-robotics-margin-war
ransomware-third-party-risk
microsoft-openai-distribution
how-to-read-series-b-2026
browser-becoming-agent
european-cloud-sovereignty
founder-led-sales-rules
ev-charging-software-stack
identity-security-buying-guide
sf-to-london-capital-rotation
payments-fraud-ai-arms-race
```

Invalid article, author, and category records show in-app not-found states. Other unknown routes redirect home. Hash routing cannot issue individual HTTP 404 responses; that is a production routing decision.

## Targeted Changes

- `scripts/typecheck.mjs` and `tsconfig.qa.json`: explicit no-emit compiler checks for app/config and tests.
- `playwright.config.ts` and `tests/`: executable production-preview tests, including all concrete routes and viewport measurements with root clipping temporarily disabled.
- `src/lib/pageMetadata.ts`, `src/App.tsx`, and the article/category/author pages: one metadata owner instead of competing generic and detail-page title effects.
- `Header.tsx`: native modal semantics, contained tab navigation, Escape/route/resize dismissal, and focus restoration without changing the masthead.
- `ShareBar.tsx`: copy the current working hash URL; report clipboard failures honestly; clear feedback timers on unmount.
- `dom.ts`, `TableOfContents.tsx`, and `ArticleBody.tsx`: respect reduced motion, focus section headings after contents collapse, and expose horizontally scrollable tables to keyboard users.
- `AdminLayout.tsx` and `AdminPages.tsx`: main landmark, mobile demo label, and a positioned scroll container preventing off-screen labels from widening the page.
- `Newsletter.tsx`, `AuthorPage.tsx`, `ArticleCard.tsx`, and `AuthorCard.tsx`: prevent narrow-column form overflow, wrap long contact links, and label image-only links.
- `HomePage.tsx` and `AdSlot.tsx`: accessible page heading and readable muted text for ranks and ad labels using existing palette tokens.
- `.gitignore`, `.gitattributes`, `.nvmrc`, and documentation: reproducible install, consistent text files, and clean export boundaries.

## Confirmed Cleanup

Repository-wide reference searches confirmed that `formatDate` and its formatter, the duplicate JavaScript `colors` export, eight unused image-map entries, the unused shadow token, the unused `.admin-scroll` rules, and unconsumed newsletter email context state had no consumers. These were removed. The `pexels` helper is now private to its data module.

No working page, component variant, navigation destination, article record, or admin workflow was removed. Reusable components and original artwork were retained. Palette values remain in `src/index.css`; brand copy remains in `src/config/brand.ts`.

## Export Locally

1. Use the host editor's source-download/export feature if available, or copy the full project directory to your computer. Include hidden dotfiles and `package-lock.json`. Export source, not only `dist/index.html`.
2. Exclude `node_modules/`, `dist/`, `test-results/`, `playwright-report/`, caches, and local `.env` files. The included `.gitignore` covers them.
3. Open a terminal in the exported project. Install Node 22 LTS if necessary, then run the following commands.

```sh
nvm install
nvm use
npm ci
node scripts/typecheck.mjs
npm run build
npx playwright install chromium
npx playwright test
npm run dev
```

If you do not use nvm, install Node 22.12+ directly and omit the first two commands. On a minimal Linux host, substitute `npx playwright install --with-deps chromium` for the browser-install command. It may require permission to install OS libraries.

## GitHub Later

These are future instructions only. No Git commands, remotes, GitHub connections, or deployments were performed during this handoff.

1. In a clean exported folder with no existing `.git` directory, initialise a local repository. If your export already has Git history, keep that history and skip `git init`.

```sh
git init -b main
git status --short
git add .
git diff --cached --stat
git diff --cached --check
git commit -m "Handoff Signal Desk Option A frontend"
```

2. Review the staged file list before committing. It should contain source, tests, documentation, assets, config, and the lockfile, not generated reports or secrets.
3. Only when authorised, create an empty private GitHub repository named `signal-desk-frontend`. Do not initialise a second README, license, or gitignore on GitHub. No open-source license is assumed for this project.
4. Replace `YOUR_ORG` with your GitHub account or organisation, configure your own SSH access, and run these commands when you are ready to connect and upload.

```sh
git remote add origin git@github.com:YOUR_ORG/signal-desk-frontend.git
git remote -v
git push -u origin main
```

5. Uploading source does not deploy the application. Do not enable Pages, hosting, or automatic publishing as part of this handoff. Validation commands for a later CI workflow are `npm ci`, `node scripts/typecheck.mjs`, `npm run build`, browser installation, and `npx playwright test`.

## Later Production Migration

- Keep `src/components`, domain types, editorial layouts, and CSS tokens intact while replacing data sources behind the existing helpers.
- Choose real routing deliberately: BrowserRouter needs a host fallback to `index.html`; Next.js needs file-based routes and explicit client boundaries. HashRouter is retained now for portable static previews.
- Replace placeholder brand/contact/legal information and demo stories only when verified real content exists. Do not remove demo notices prematurely.
- Move fonts and photography into an approved asset pipeline, reconcile credits, and verify licenses before publishing.
- Review authentication, editorial approvals, privacy, security, data storage, and deployment in a separately authorised implementation phase. None is implemented here.