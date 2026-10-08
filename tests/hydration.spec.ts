import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.DEPLOYMENT_URL || 'https://premium-technology-news-magazine.8002salman.workers.dev';

test.describe('Automated Hydration & SSR Verification', () => {
  test('article content is fully available in initial HTML without JavaScript', async ({ browser }) => {
    // Create context with JavaScript completely disabled
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    const response = await page.goto(`${TARGET_URL}/ai/ai-power-bottleneck-data-centers`, {
      waitUntil: 'commit',
    });
    expect(response?.status()).toBe(200);

    // Initial HTML contains full server-rendered React structure
    const root = page.locator('#root');
    await expect(root).toBeVisible();

    // Masthead and header rendered server-side
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    // Main article headline rendered server-side
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('The new bottleneck in artificial intelligence is no longer compute. It is power.');

    // Article dek rendered server-side
    const dek = page.locator('p.font-serif').first();
    await expect(dek).toBeVisible();

    // Key takeaways rendered server-side
    const takeaways = page.locator('text=Key Takeaways');
    await expect(takeaways).toBeVisible();

    // Body content rendered server-side
    const bodyParagraph = page.locator('text=It is about electricity.');
    await expect(bodyParagraph).toBeVisible();

    // Site footer rendered server-side
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    await context.close();
  });

  test('client hydrates server-rendered HTML with ZERO hydration warnings or errors', async ({ page }) => {
    const consoleWarnings: string[] = [];
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      const type = msg.type();
      if (type === 'error') {
        consoleErrors.push(text);
      }
      if (
        text.includes('Hydration failed') ||
        text.includes('hydration mismatch') ||
        text.includes('did not match') ||
        text.includes('server-rendered HTML') ||
        text.includes('hydrateRoot') ||
        text.includes('Warning: Expected server HTML') ||
        text.includes('suppressHydrationWarning')
      ) {
        consoleWarnings.push(text);
      }
    });

    // Navigate to article page with JS enabled for full hydration
    const response = await page.goto(`${TARGET_URL}/ai/ai-power-bottleneck-data-centers`, {
      waitUntil: 'networkidle',
    });
    expect(response?.status()).toBe(200);

    // Headline remains intact after hydration
    await expect(page.locator('h1')).toHaveText(
      'The new bottleneck in artificial intelligence is no longer compute. It is power.'
    );

    // Verify zero hydration mismatches occurred
    expect(consoleWarnings).toEqual([]);

    // Filter out external analytics/favicon 404s
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('favicon') &&
        !err.includes('analytics') &&
        !err.includes('status of 404')
    );
    expect(criticalErrors).toEqual([]);
  });

  test('multiple public article routes hydrate consistently without flashes or errors', async ({ page }) => {
    const hydrationIssues: string[] = [];

    page.on('console', (msg) => {
      const text = msg.text();
      if (
        text.toLowerCase().includes('hydration') ||
        text.toLowerCase().includes('did not match')
      ) {
        hydrationIssues.push(text);
      }
    });

    const routes = [
      '/startups/london-fintech-series-d',
      '/technology/chip-war-supply-chains',
      '/cybersecurity/board-cybersecurity-gap',
    ];

    for (const route of routes) {
      await page.goto(`${TARGET_URL}${route}`, { waitUntil: 'networkidle' });
      await expect(page.locator('h1')).toBeVisible();
      await page.waitForTimeout(200);
    }

    expect(hydrationIssues).toEqual([]);
  });

  test('interactive components function properly after hydration', async ({ page }) => {
    await page.goto(`${TARGET_URL}/ai/ai-power-bottleneck-data-centers`, {
      waitUntil: 'networkidle',
    });

    // Test Table of Contents interaction
    const tocLink = page.locator('a[href="#from-flops-to-megawatts"]').first();
    if (await tocLink.isVisible()) {
      await tocLink.click();
      const targetHeading = page.locator('#from-flops-to-megawatts');
      await expect(targetHeading).toBeVisible();
    }

    // Test Share Bar copy link button
    const copyButton = page.locator('button[aria-label="Copy link"]').first();
    await expect(copyButton).toBeVisible();
  });
});
