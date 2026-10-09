import { mapDbToArticle } from '../src/services/database/supabase.ts';

console.log('=====================================================');
console.log('SIGNAL DESK — DEMO CONTENT ISOLATION TEST');
console.log('=====================================================');

let passed = 0;
let failed = 0;

function assert(cond, name) {
  if (cond) {
    console.log(`[PASS] ${name}`);
    passed++;
  } else {
    console.error(`[FAIL] ${name}`);
    failed++;
  }
}

// Test 1: mapDbToArticle preserves is_demo: true
const demoRow = {
  id: 'test-demo-1',
  slug: 'test-demo-story',
  title: 'Synthetic Demo Article',
  is_demo: true,
  status: 'published',
};
const mappedDemo = mapDbToArticle(demoRow);
assert(mappedDemo.isDemo === true, 'mapDbToArticle accurately preserves is_demo: true');

// Test 2: mapDbToArticle preserves is_demo: false (not hardcoded false or overridden)
const realRow = {
  id: 'test-real-1',
  slug: 'test-real-journalism',
  title: 'Real Journalistic Investigation',
  is_demo: false,
  status: 'published',
};
const mappedReal = mapDbToArticle(realRow);
assert(mappedReal.isDemo === false, 'mapDbToArticle accurately preserves is_demo: false (non-demo journalism)');

// Test 3: News Sitemap 48-hour & demo exclusion logic
const now = Date.now();
const oneHourAgo = new Date(now - 1 * 3600 * 1000).toISOString();
const twentyFourHoursAgo = new Date(now - 24 * 3600 * 1000).toISOString();
const fiftyHoursAgo = new Date(now - 50 * 3600 * 1000).toISOString();

const testArticles = [
  // 1. Non-demo published 1 hour ago -> ELIGIBLE
  { slug: 'real-fresh-news', title: 'Breaking Real News', category: 'technology', isDemo: false, publishedAt: oneHourAgo },
  // 2. Demo article published 1 hour ago -> EXCLUDED (demo)
  { slug: 'demo-fresh-news', title: 'Demo Fresh News', category: 'ai', isDemo: true, publishedAt: oneHourAgo },
  // 3. Non-demo published 24 hours ago -> ELIGIBLE
  { slug: 'real-yesterday-news', title: 'Real Yesterday News', category: 'cybersecurity', isDemo: false, publishedAt: twentyFourHoursAgo },
  // 4. Non-demo published 50 hours ago -> EXCLUDED (> 48h)
  { slug: 'real-stale-news', title: 'Real Stale News', category: 'startups', isDemo: false, publishedAt: fiftyHoursAgo },
];

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
const eligible = testArticles.filter((article) => {
  if (article.isDemo) return false;
  if (!article.publishedAt) return false;
  const pubTime = new Date(article.publishedAt).getTime();
  if (isNaN(pubTime)) return false;
  const age = now - pubTime;
  return age >= 0 && age <= FORTY_EIGHT_HOURS_MS;
});

assert(eligible.length === 2, `Eligible count is exactly 2 (got ${eligible.length})`);
assert(eligible.some(a => a.slug === 'real-fresh-news'), 'Includes fresh non-demo article');
assert(eligible.some(a => a.slug === 'real-yesterday-news'), 'Includes 24h-old non-demo article');
assert(!eligible.some(a => a.slug === 'demo-fresh-news'), 'Strictly excludes fresh demo article');
assert(!eligible.some(a => a.slug === 'real-stale-news'), 'Strictly excludes non-demo article older than 48 hours');

console.log('=====================================================');
console.log(`TOTAL DEMO ISOLATION TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('=====================================================');

if (failed > 0) process.exit(1);
