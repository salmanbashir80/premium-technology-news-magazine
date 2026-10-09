import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Load Supabase service role from .env.local if present
let supabaseUrl = '';
let serviceRoleKey = '';

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const u = envContent.match(/^\s*VITE_SUPABASE_URL\s*=\s*"?([^"\r\n]*)"?\s*$/m);
  if (u && u[1]) supabaseUrl = u[1].trim();
  const k = envContent.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*"?([^"\r\n]*)"?\s*$/m);
  if (k && k[1]) serviceRoleKey = k[1].trim();
}

test.describe('Task A & B & C: Dynamic React SSR, Demo Isolation & Static Fallback Removal', () => {
  let createdArticleId: string | null = null;
  const testId = Date.now();
  const testSlug = `e2e-dynamic-ssr-${testId}`;
  const testTitle = `Breakthrough Quantum Photonic Processing Cluster ${testId}`;
  const testDek = `Signal Desk reported analysis of newly verified optical interconnect architecture.`;
  const uniqueBody = `Photonic link interconnects achieved sixty gigabits per second across optical buses during benchmark runs.`;

  test.beforeAll(async () => {
    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data: cat } = await adminClient.from('categories').select('id').eq('slug', 'technology').single();
      const { data: author } = await adminClient.from('authors').select('id').eq('slug', 'maya-ellison').single();

      const { data, error } = await adminClient
        .from('articles')
        .insert({
          slug: testSlug,
          title: testTitle,
          dek: testDek,
          summary: testDek,
          category_id: cat?.id,
          author_id: author?.id,
          status: 'published',
          is_demo: false,
          published_at: new Date().toISOString(),
          reading_time: 4,
          featured_image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
          featured_image_caption: 'Photonic lab test silicon wafer',
          featured_image_credit: 'Signal Desk Lab',
          key_takeaways: ['Photonic interconnect verification successful.'],
          body: [
            { type: 'p', text: uniqueBody },
            { type: 'h2', text: 'Optical Bus Measurements' },
            { type: 'p', text: 'Benchmark latencies fell well below electronic switching thresholds.' }
          ]
        })
        .select()
        .single();

      if (!error && data) {
        createdArticleId = data.id;
      }
    }
  });

  test.afterAll(async () => {
    if (createdArticleId && supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      await adminClient.from('articles').delete().eq('id', createdArticleId);
    }
  });

  test('newly published article renders headline and body and hydrates with 0 mismatches', async ({ page }) => {
    const consoleWarnings: string[] = [];
    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.includes('Hydration failed') ||
        text.includes('hydration mismatch') ||
        text.includes('did not match') ||
        text.includes('server-rendered HTML') ||
        text.includes('Warning: Expected server HTML')
      ) {
        consoleWarnings.push(text);
      }
    });

    const route = `/technology/${testSlug}`;
    await page.goto(route);

    // Headline and body render properly
    await expect(page.locator('h1')).toHaveText(testTitle);
    await expect(page.getByText(uniqueBody)).toBeVisible();

    // Verify 0 hydration mismatches occurred
    expect(consoleWarnings).toEqual([]);
  });

  test('missing or unpublished slug does NOT render static fallback', async ({ page }) => {
    await page.goto('/technology/missing-non-existent-article-xyz');
    // Must show Not Found, NEVER static demo article content
    await expect(page.locator('h1')).toHaveText('This story is not in the demo library.');
    await expect(page.getByText('Compute is no longer the bottleneck')).toHaveCount(0);
  });
});
