import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { article } from "./catalogue";

for (const path of [
  "/", `/${article.category}/${article.slug}`, `/article/${article.slug}`, "/category/ai", "/search", "/author/maya-ellison",
  "/contact", "/about", "/admin", "/admin/discovery", "/admin/settings",
]) {
  test(`automated accessibility ${path}`, async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    await testInfo.attach("axe-results", { body: JSON.stringify(results), contentType: "application/json" });
    expect(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
  });
}

test("mobile article and menu accessibility", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`/${article.category}/${article.slug}`);
  const articleResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(articleResults.violations.map((v) => v.id)).toEqual([]);
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  const menuResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(menuResults.violations.map((v) => v.id)).toEqual([]);
});