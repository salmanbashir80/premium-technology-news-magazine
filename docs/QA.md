# Handoff QA Record

## Results

| Check | Result |
| --- | --- |
| `node scripts/typecheck.mjs` | Passed for `tsconfig.json` and `tsconfig.qa.json`; no files emitted |
| Production Vite build | Passed; 1,957 modules; approximately 465 kB HTML / 138 kB gzip |
| `npx playwright test` | 87 passed, 0 failed, 0 skipped; Chromium; 47.8 seconds in the recorded run |
| Concrete route renders | All 52 passed, with no captured page runtime exceptions |
| Data relationships | Unique slugs, valid authors/categories/timestamps, explicit demo flags, deduplicated recommendations passed |
| `npm audit --json` | The final audit reported 0 vulnerabilities for the installed lockfile; re-run after dependency changes |

The TypeScript command and browser suite were actually executed against this source and its production bundle. A temporary build-time invocation bridge was used by the editor's restricted command runner; it has been removed from the handed-off source. Normal Vite configuration and package build scripts are unchanged. Reproduce the checks with the standalone commands in `README.md`.

## Browser Coverage

- Homepage, all seven categories, all 22 article routes, all five author routes, search, all six editorial pages, `/admin`, and all nine admin subroutes.
- A main landmark and page heading on every route, route-specific browser titles, visible public/admin demo notices, and generated internal link destinations matching the route inventory.
- In-app not-found states for invalid article, category, and author slugs, plus the unknown-route redirect.
- Featured-story navigation, author navigation, breadcrumb navigation, browser back, search query/history/filters/empty state, and category-filter reset.
- Working article contents links with focus transfer and no route loss, including the mobile collapsed contents layout.
- Clipboard success uses the actual working hash URL; clipboard rejection is visibly reported as failure.
- Newsletter acknowledgement without a POST, contact demo acknowledgement, admin assignee changes, status transitions, and reset-on-reload behavior.
- Native mobile menu focus containment, Escape dismissal, focus restoration, section links, and mobile header search.

## Responsive Coverage

| Viewport | Pages and assertions |
| --- | --- |
| 1440 x 900 | Homepage and featured article; loaded lead image; layout and reading screenshots; no document overflow |
| 768 x 1024 | Homepage and featured article; layout and reading screenshots; no document overflow |
| 375 x 667 | Homepage and featured article; loaded featured image and entire first headline above the fold; compact visible demo notice; no document overflow |
| 375 x 667 | AI category, long-name author profile, admin overview, discovery table, settings, mobile navigation/search, and contents interaction |

Overflow checks temporarily remove root/body horizontal clipping before measuring document width. Intentional scroll areas, including the section rail, ticker, article tables, and admin tables, remain locally scrollable rather than widening the page.

Screenshots are generated under `test-results/responsive-home-and-article-layout-at-*/`. These are inspection artifacts, not golden-image baselines or source assets. They are not committed.

## Accessibility Coverage

The suite uses axe-core WCAG 2 A/AA and WCAG 2.1 A/AA rule tags. No detected violations remained in the tested states: desktop homepage, featured article, category, search, author, contact, About, admin overview/discovery/settings, mobile article, and open mobile menu.

Keyboard interactions were explicitly tested for menu containment, Escape, article contents, and focus transfer. Image-only links have accessible names, scrollable tables are keyboard reachable, form fields have labels, and contrast fixes use the existing palette.

Automated checks are not an accessibility certification. Screen-reader testing, zoom/large-text testing, real touch devices, and a manual WCAG review remain outside this handoff's verified scope.

## Remaining Limitations

- Chromium was tested. Safari/WebKit, Firefox, real iOS/Android devices, and assistive technologies have not been tested in this pass.
- The application uses HashRouter and client-side metadata. It has no SSR, real HTTP article/404 responses, or production search indexing setup.
- All newsroom states, settings, newsletter acknowledgements, and contact behavior are local demonstrations. No persistence, access control, authentication, or publishing exists.
- Current photography and fonts are hotlinked to Pexels and Google Fonts. External availability and asset licensing are not guaranteed by these tests.
- Author identities, portrait associations, contact details, source references, office addresses, and analytics are placeholders. They require editorial/legal review before any live use.
- Original artwork is retained in `public/images/`, while current story imagery uses the media URL map. The mock media library is not a live asset-management system.
- Category pagination is implemented, but the small seed library does not currently create multiple pages at the configured six-item page size. The browser suite verifies filters and category navigation, not a multi-page seed-data scenario.
- The existing Print control delegates to the browser; a dedicated print/PDF layout has not been validated.
- Dependency advisories can change after this snapshot. Run `npm audit` again during migration rather than applying an unreviewed force update.

No GitHub connection, repository creation, deployment, backend service, content API, authentication, or real publishing was introduced.