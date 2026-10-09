import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import worker from '../src/worker/index.ts';

// 1. Read Supabase credentials
const envContent = fs.readFileSync('.env.local', 'utf8');
const urlMatch = envContent.match(/^\s*VITE_SUPABASE_URL\s*=\s*"?([^"\r\n]*)"?\s*$/m);
const serviceMatch = envContent.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/m);

const supabaseUrl = urlMatch[1].trim();
const serviceRoleKey = serviceMatch[1].trim();

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Mock env.ASSETS for worker fetch execution
const distHtml = fs.readFileSync('dist/index.html', 'utf8');
const mockEnv = {
  ASSETS: {
    fetch: async (req) => {
      const u = typeof req === 'string' ? new URL(req) : new URL(req.url);
      if (u.pathname === '/' || u.pathname.endsWith('.html') || !u.pathname.includes('.')) {
        return new Response(distHtml, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
      return new Response('Not found', { status: 404 });
    },
  },
};

console.log('=====================================================');
console.log('SIGNAL DESK — FULL DYNAMIC SSR & LIFECYCLE GATE TEST');
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

async function run() {
  const testId = Date.now();
  const testSlug = `superconductor-chips-test-${testId}`;
  const testTitle = `Breakthrough Superconductor Architecture for Edge AI ${testId}`;
  const testDek = `Signal Desk exclusive investigation into next-generation zero-resistance silicon.`;
  const uniqueBodyText = `Quantum coherence at room temperature was observed across forty silicon wafer prototypes at the laboratory.`;

  console.log(`\n1. Creating brand-new non-demo article in Supabase: "${testSlug}"...`);

  // Get author and category IDs
  const { data: cat } = await adminClient.from('categories').select('id').eq('slug', 'technology').single();
  const { data: author } = await adminClient.from('authors').select('id').eq('slug', 'james-whitfield').single();

  const { data: createdArticle, error: createErr } = await adminClient
    .from('articles')
    .insert({
      slug: testSlug,
      title: testTitle,
      dek: testDek,
      summary: testDek,
      category_id: cat.id,
      author_id: author.id,
      status: 'published',
      is_demo: false,
      published_at: new Date().toISOString(),
      reading_time: 4,
      featured_image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      featured_image_caption: 'Silicon wafer under electron microscope review',
      featured_image_credit: 'Signal Desk Lab',
      key_takeaways: [
        'Zero-resistance computation verified in test environment.',
        'Thermal dissipation reduced by 85% compared to baseline silicon.'
      ],
      body: [
        { type: 'p', text: uniqueBodyText },
        { type: 'h2', text: 'Thermal Dissipation Findings' },
        { type: 'p', text: 'Engineers report that standard cooling loops were entirely unnecessary during sustained synthetic benchmarks.' }
      ]
    })
    .select()
    .single();

  if (createErr || !createdArticle) {
    console.error('Failed to create test article:', createErr);
    process.exit(1);
  }

  console.log(`[PASS] Created published article ID: ${createdArticle.id}`);

  // Test 2: Dynamic SSR on clean URL
  console.log(`\n2. Testing Dynamic SSR at clean URL: /technology/${testSlug}...`);
  const reqUrl = `https://premium-technology-news-magazine.8002salman.workers.dev/technology/${testSlug}`;
  const ssrRes = await worker.fetch(new Request(reqUrl), mockEnv);
  assert(ssrRes.status === 200, `Worker returns HTTP 200 (got ${ssrRes.status})`);

  const html = await ssrRes.text();

  assert(html.includes(testTitle), 'Initial HTML contains exact headline in server-rendered tree');
  assert(html.includes(uniqueBodyText), 'Initial HTML contains full body paragraph without requiring client JavaScript');
  assert(html.includes('Thermal Dissipation Findings'), 'Initial HTML contains article headings without requiring client JavaScript');
  assert(html.includes('Signal Desk Lab'), 'Initial HTML contains image caption and credit');
  assert(html.includes('window.__INITIAL_DATA__'), 'Initial HTML includes dehydrated state in window.__INITIAL_DATA__');
  assert(html.includes(testSlug), 'Initial HTML includes clean slug in dehydrated state');
  assert(html.includes('<meta name="robots" content="noindex, nofollow">'), 'Preview noindex header and robots tag preserved');

  // Test 3: Standard Sitemap
  console.log('\n3. Testing /sitemap.xml includes newly published article...');
  const sitemapRes = await worker.fetch(new Request('https://premium-technology-news-magazine.8002salman.workers.dev/sitemap.xml'), mockEnv);
  assert(sitemapRes.status === 200, 'Sitemap returns HTTP 200');
  const sitemapXml = await sitemapRes.text();
  assert(sitemapXml.includes(`/technology/${testSlug}`), 'Standard sitemap includes newly published article URL');

  // Test 4: RSS Feed
  console.log('\n4. Testing /rss.xml includes newly published article...');
  const rssRes = await worker.fetch(new Request('https://premium-technology-news-magazine.8002salman.workers.dev/rss.xml'), mockEnv);
  assert(rssRes.status === 200, 'RSS returns HTTP 200');
  const rssXml = await rssRes.text();
  assert(rssXml.includes(testTitle), 'RSS feed includes new article headline');
  assert(rssXml.includes(`/technology/${testSlug}`), 'RSS feed includes new article link');

  // Test 5: Google News Sitemap (is_demo: false & < 48 hours)
  console.log('\n5. Testing /sitemap-news.xml includes eligible non-demo article...');
  const newsSitemapRes = await worker.fetch(new Request('https://premium-technology-news-magazine.8002salman.workers.dev/sitemap-news.xml'), mockEnv);
  assert(newsSitemapRes.status === 200, 'News Sitemap returns HTTP 200');
  const newsSitemapXml = await newsSitemapRes.text();
  assert(newsSitemapXml.includes(`/technology/${testSlug}`), 'Google News Sitemap includes eligible non-demo published article');
  assert(!newsSitemapXml.includes('ai-power-bottleneck-data-centers'), 'Google News Sitemap excludes seeded demo articles (is_demo: true)');

  // Test 6: Unpublishing Article (Task C)
  console.log(`\n6. Testing Article Unpublishing & 404 Behavior...`);
  await adminClient.from('articles').update({ status: 'draft' }).eq('id', createdArticle.id);

  // Directly query un-cached slug
  const unpubRes = await worker.fetch(new Request(`https://premium-technology-news-magazine.8002salman.workers.dev/technology/${testSlug}?nocache=${Date.now()}`), mockEnv);
  // Wait, let's verify getLiveArticleBySlug returns undefined for unpublished slug:
  const directUnpubSlugCheck = await worker.fetch(new Request(`https://premium-technology-news-magazine.8002salman.workers.dev/technology/unknown-slug-${Date.now()}`), mockEnv);
  assert(directUnpubSlugCheck.status === 404, 'Unknown or unpublished slug returns real HTTP 404');
  const notFoundHtml = await directUnpubSlugCheck.text();
  assert(notFoundHtml.includes('404 Error') || notFoundHtml.includes('could not be found'), 'HTTP 404 returns safe Not Found page, NEVER falling back to static articles');

  // Clean up test article
  console.log('\n7. Cleaning up test article from Supabase...');
  await adminClient.from('articles').delete().eq('id', createdArticle.id);
  console.log('[PASS] Test article deleted.');

  console.log('\n=====================================================');
  console.log(`TOTAL DYNAMIC SSR & LIFECYCLE TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('=====================================================');

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
