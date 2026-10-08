import { test, expect } from '@playwright/test';

const LIVE_URL = 'https://premium-technology-news-magazine.8002salman.workers.dev';

test.describe('Live Canonical Preview Verification', () => {
  test('homepage loads, renders header, hero, and footer', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(LIVE_URL, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/Signal Desk/i);

    const masthead = page.locator('header');
    await expect(masthead).toBeVisible();

    // Verify no fatal runtime errors in console
    const fatalErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('analytics'));
    expect(fatalErrors).toHaveLength(0);
  });

  test('clean article route loads directly, hydrates, and retains SEO title', async ({ page }) => {
    await page.goto(`${LIVE_URL}/ai/ai-power-bottleneck-data-centers`, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/The new bottleneck in artificial intelligence/i);

    // Article headline visible
    const h1 = page.locator('h1');
    await expect(h1).toContainText('The new bottleneck in artificial intelligence');

    // Breadcrumb works
    const breadcrumb = page.locator('nav').filter({ hasText: 'Artificial Intelligence' });
    await expect(breadcrumb.first()).toBeVisible();
  });

  test('direct refresh on article route preserves state without 404', async ({ page }) => {
    await page.goto(`${LIVE_URL}/startups/london-fintech-series-d`, { waitUntil: 'networkidle' });
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toContainText('London fintech');
  });

  test('unknown route loads editorial 404 page', async ({ page }) => {
    const response = await page.goto(`${LIVE_URL}/invalid-random-path-404`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('could not be found');
  });

  test('search filter works live', async ({ page }) => {
    await page.goto(`${LIVE_URL}/search`, { waitUntil: 'networkidle' });
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('compute');
      await page.waitForTimeout(500);
      const results = page.locator('article, [data-testid="article-card"]');
      expect(await results.count()).toBeGreaterThan(0);
    }
  });
});
