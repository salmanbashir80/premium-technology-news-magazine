import { test, expect } from "@playwright/test";
import { articles, relatedArticles, moreFromCategory } from "../src/data/articles";
import { authors } from "../src/data/authors";
import { categories } from "../src/data/categories";
import { brand } from "../src/config/brand";
import { pageMetadata } from "../src/lib/pageMetadata";
import { knownPaths, routeCases } from "./catalogue";

test("demo data has unique slugs, valid relationships, and no duplicate recommendations", () => {
  expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
  expect(new Set(authors.map((a) => a.slug)).size).toBe(authors.length);
  expect(new Set(routeCases.map((r) => r.path)).size).toBe(routeCases.length);
  for (const article of articles) {
    expect(article.isDemo).toBe(true);
    expect(authors.some((a) => a.id === article.authorId)).toBe(true);
    expect(categories.some((c) => c.slug === article.category)).toBe(true);
    expect(Number.isFinite(Date.parse(article.publishedAt))).toBe(true);
    expect(Date.parse(article.updatedAt)).toBeGreaterThanOrEqual(Date.parse(article.publishedAt));
    const related = relatedArticles(article);
    const sidebar = moreFromCategory(article, related);
    const ids = [article.id, ...related.map((a) => a.id), ...sidebar.map((a) => a.id)];
    expect(new Set(ids).size).toBe(ids.length);
  }
});

for (const route of routeCases) {
  test(`route ${route.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    if (route.heading) await expect(page.locator("h1")).toHaveText(route.heading);
    else await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page).toHaveTitle(pageMetadata(route.path).title);
    if (!route.path.startsWith("/admin")) {
      await expect(page.getByText(brand.demoNotice, { exact: true }).first()).toBeVisible();
    } else {
      await expect(page.getByText("Newsroom · Demo", { exact: true })).toBeVisible();
    }
    const links = await page.locator('a[href^="/"]').evaluateAll((elements) =>
      elements
        .map((el) => el.getAttribute("href")!.split("?")[0].split("#")[0])
        .filter((href) => !href.startsWith("/images") && href !== ""),
    );
    expect(links.filter((path) => !knownPaths.has(path))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const [path, heading] of [
  ["/article/not-in-demo", "This story is not in the demo library."],
  ["/author/not-in-demo", "Author not found"],
  ["/category/not-in-demo", "Section not found"],
]) {
  test(`safe missing record ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveText(heading);
    await expect(page.getByRole("link", { name: /Back home|Return to the homepage/i })).toHaveAttribute("href", "/");
  });
}

test("unknown route renders editorial 404 page", async ({ page }) => {
  await page.goto("/not-a-route-404");
  await expect(page.locator("h1")).toContainText("could not be found");
  await expect(page.getByRole("link", { name: /Return to the Homepage/i })).toHaveAttribute("href", "/");
});

test("legacy hash URL redirects to clean SEO route", async ({ page }) => {
  await page.goto("/#/category/ai");
  await expect(page).toHaveURL(/\/category\/ai$/);
  await expect(page.locator("h1")).toHaveText("Artificial Intelligence");
});