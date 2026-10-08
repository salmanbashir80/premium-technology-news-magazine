import { test, expect } from "@playwright/test";
import { article } from "./catalogue";
import { noPageOverflow, settleFonts } from "./helpers";
import { brand } from "../src/config/brand";

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 375, height: 667 },
]) {
  test(`home and article layout at ${viewport.width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await settleFonts(page);
    await noPageOverflow(page);
    const feature = page.locator("main article").first();
    await expect.poll(() => feature.locator("img").evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const image = await feature.locator("img").boundingBox();
    expect(image).not.toBeNull();
    expect(image!.y).toBeGreaterThan(0);
    expect(image!.y).toBeLessThan(viewport.height / 2);
    if (viewport.width === 375) {
      const headline = await feature.locator("h2").boundingBox();
      expect(headline!.y + headline!.height).toBeLessThanOrEqual(viewport.height);
      await expect(page.getByText(brand.demoNoticeShort, { exact: true })).toBeVisible();
    }
    await page.screenshot({ path: testInfo.outputPath("homepage.png"), animations: "disabled" });
    await page.goto(`/${article.category}/${article.slug}`);
    await settleFonts(page);
    await expect(page.locator("h1")).toHaveText(article.title);
    await noPageOverflow(page);
    await expect(page.locator("#article-root header time")).toHaveCount(2);
    await expect(page.getByRole("complementary", { name: "Key takeaways" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sources & references" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Corrections & updates" })).toBeAttached();
    await page.screenshot({ path: testInfo.outputPath("article.png"), animations: "disabled" });
    await page.locator(".lead-paragraph").scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("article-reading.png"), animations: "disabled" });
  });
}

test("mobile menu traps focus, closes with Escape, and keeps navigation reachable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open menu", exact: true });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Menu", exact: true });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((el) => el.matches(":modal"))).toBe(true);
  for (let i = 0; i < 18; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole("link", { name: "Artificial Intelligence", exact: true }).click();
  await expect(page).toHaveURL(/\/category\/ai$/);
  await expect(dialog).toHaveCount(0);
  await noPageOverflow(page);
  await page.getByRole("button", { name: "Open search", exact: true }).click();
  await page.locator("#masthead-search").fill("identity");
  await page.locator("#masthead-search-panel").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/\/search\?q=identity$/);
  await noPageOverflow(page);
});

for (const path of ["/category/ai", "/author/priya-ramanathan", "/admin", "/admin/discovery", "/admin/settings"]) {
  test(`mobile secondary layout ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(path);
    await expect(page.getByRole("main")).toBeVisible();
    await noPageOverflow(page);
  });
}