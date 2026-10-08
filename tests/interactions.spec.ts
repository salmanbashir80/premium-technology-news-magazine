import { test, expect } from "@playwright/test";
import { article } from "./catalogue";
import { initialAdminItems } from "../src/data/admin";

test("header, featured story, breadcrumb, author and back navigation", async ({ page }) => {
  await page.goto("/#/");
  await page.getByRole("heading", { level: 2, name: article.title }).getByRole("link").click();
  await expect(page.locator("h1")).toHaveText(article.title);
  await page.locator("#article-root header").getByRole("link", { name: "Maya Ellison", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Maya Ellison");
  await page.goBack();
  await expect(page.locator("h1")).toHaveText(article.title);
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Artificial Intelligence" }).click();
  await expect(page).toHaveURL(/#\/category\/ai$/);
});

test("search query, filters, empty state, and history", async ({ page }) => {
  await page.goto("/#/search");
  const form = page.locator("main").getByRole("search");
  await form.getByLabel("Search articles").fill("power");
  await form.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("main article").first()).toBeVisible();
  await page.getByRole("button", { name: "Cybersecurity", exact: true }).click();
  await expect(page.getByRole("heading", { name: /No demo stories/ })).toBeVisible();
  await page.getByRole("button", { name: "All sections", exact: true }).click();
  await expect(page.locator("main article").first()).toBeVisible();
  await form.getByLabel("Search articles").fill("no-match-9281");
  await form.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: /No demo stories/ })).toBeVisible();
  await page.goBack();
  await expect(form.getByLabel("Search articles")).toHaveValue("power");
});

test("category filter resets when moving to another section", async ({ page }) => {
  await page.goto("/#/category/ai");
  await page.getByRole("button", { name: "Energy", exact: true }).click();
  await expect(page.getByRole("button", { name: "Energy", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "Technology", exact: true }).click();
  await expect(page.getByRole("button", { name: "All", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("main article").first()).toBeVisible();
});

test("table of contents keeps the article route and moves keyboard focus", async ({ page }) => {
  await page.goto(`/#/article/${article.slug}`);
  const heading = article.body.find((block) => block.type === "h2")!;
  if (heading.type !== "h2") throw new Error("Missing heading fixture");
  await page.getByRole("navigation", { name: "Table of contents" }).filter({ visible: true }).getByRole("link").first().click();
  await expect(page).toHaveURL(new RegExp(`#/article/${article.slug}$`));
  await expect(page.locator(`#${heading.id}`)).toBeFocused();
});

test("copy link uses the current prototype URL and reports real clipboard success", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(`/#/article/${article.slug}`);
  await page.locator("#article-root header").getByRole("button", { name: "Copy link", exact: true }).click();
  await expect(page.locator("#article-root header").getByRole("button", { name: "Copied", exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(page.url());
});

test("clipboard rejection is never reported as success", async ({ page }) => {
  await page.goto(`/#/article/${article.slug}`);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Clipboard blocked for test")) },
    });
  });
  await page.locator("#article-root header").getByRole("button", { name: "Copy link", exact: true }).click();
  await expect(page.locator("#article-root header").getByRole("button", { name: "Copy unavailable", exact: true })).toBeVisible();
});

test("mobile contents collapse keeps the target in view", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`/#/article/${article.slug}`);
  await page.getByRole("button", { name: /Contents/ }).click();
  const contents = page.getByRole("navigation", { name: "Table of contents" }).filter({ visible: true });
  await contents.getByRole("link").first().click();
  await expect(page).toHaveURL(new RegExp(`#/article/${article.slug}$`));
  await expect(page.locator("#from-flops-to-megawatts")).toBeFocused();
  const position = await page.evaluate(() => document.activeElement?.getBoundingClientRect().top);
  expect(position).toBeGreaterThanOrEqual(0);
  expect(position).toBeLessThan(200);
});

test("newsletter confirms locally and does not send a form request", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (request) => { if (request.method() === "POST") writes.push(request.url()); });
  await page.goto("/#/");
  await page.getByLabel("Email address", { exact: true }).fill("reader@example.com");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("No email has been sent");
  expect(writes).toEqual([]);
});

test("contact remains a local demo", async ({ page }) => {
  await page.goto("/#/contact");
  await page.getByLabel("Name", { exact: true }).fill("Demo reader");
  await page.getByLabel("Email", { exact: true }).fill("reader@example.com");
  await page.getByLabel("Message", { exact: true }).fill("Handoff check only.");
  let message = "";
  page.once("dialog", async (dialog) => { message = dialog.message(); await dialog.accept(); });
  await page.getByRole("button", { name: "Send (demo)", exact: true }).click();
  expect(message).toContain("nothing was sent");
});

test("admin assignment and status transitions stay local and reset on reload", async ({ page }) => {
  const record = initialAdminItems.find((item) => item.status === "discovered")!;
  await page.goto("/#/admin/discovery");
  const row = page.getByRole("row").filter({ hasText: record.headline });
  await row.getByRole("combobox").selectOption("Maya Ellison");
  await row.getByRole("button", { name: "Move to Researching", exact: true }).click();
  await expect(row).toHaveCount(0);
  await page.getByRole("navigation", { name: "Admin", exact: true }).getByRole("link", { name: "Research queue" }).click();
  const assigned = page.getByRole("row").filter({ hasText: record.headline });
  await expect(assigned.getByRole("combobox")).toHaveValue("Maya Ellison");
  await page.reload();
  await expect(page.getByRole("row").filter({ hasText: record.headline })).toHaveCount(0);
});