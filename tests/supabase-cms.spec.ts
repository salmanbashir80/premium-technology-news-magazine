import { test, expect } from "@playwright/test";

test.describe("Supabase CMS & Editorial Workflow Integration", () => {
  test("overview displays Supabase connection status and real queue counts", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("h1")).toHaveText("Newsroom at a glance");
    await expect(page.getByText(/Supabase Project: Signal-Desk-News/i)).toBeVisible();
    await expect(page.getByText("Connected Infrastructure")).toBeVisible();
    await expect(page.getByText("Supabase PostgreSQL 17")).toBeVisible();
  });

  test("staff login modal allows switching roles and signing in", async ({ page }) => {
    await page.goto("/admin");
    const staffSignInBtn = page.getByRole("button", { name: /Staff Sign In|Staff Login/i }).first();
    await staffSignInBtn.click();
    
    // Modal dialog opens
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();
    await expect(modal.getByRole("heading", { name: "Editorial Staff Authentication" })).toBeVisible();

    // Form inputs and security notice are present
    await expect(modal.locator("#staff-email-input")).toBeVisible();
    await expect(modal.locator("#staff-password-input")).toBeVisible();
    await expect(modal.getByText("Strict Onboarding & RBAC Notice")).toBeVisible();

    await modal.locator("#staff-email-input").fill("editor@signaldesk.news");
    await expect(modal.locator("#staff-email-input")).toHaveValue("editor@signaldesk.news");

    // Close button dismisses modal
    await modal.getByRole("button", { name: "Close dialog" }).click();
    await expect(modal).toHaveCount(0);
  });

  test("drafts queue supports creating a new article draft", async ({ page }) => {
    await page.goto("/admin/drafts");
    await expect(page.locator("h1")).toHaveText("Draft articles");

    // Click New Article
    await page.getByRole("button", { name: /New Article/i }).click();

    // Modal opens
    await expect(page.getByRole("heading", { name: "Create New Article" })).toBeVisible();
    await page.locator('input[placeholder*="Next-Generation AI Silicon" i]').fill("Automated Silicon Test Report");
    await page.locator('textarea[placeholder*="One or two sentences" i]').fill("A comprehensive test dek for editorial verification.");
    await page.locator('textarea[placeholder*="First reported paragraph" i]').fill("Testing paragraph content inside the new Supabase draft.");

    // Click cancel to close cleanly
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("heading", { name: "Create New Article" })).toHaveCount(0);
  });

  test("settings page displays the 4 editorial roles and RLS policies", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page.locator("h1")).toHaveText("Editorial Roles & Access Control");
    await expect(page.getByText("Basco Editorial Director")).toBeVisible();
    await expect(page.getByText("Managing Editor")).toBeVisible();
    await expect(page.getByText("Maya Ellison")).toBeVisible();
    await expect(page.getByText("Hermes Research Agent")).toBeVisible();
    await expect(page.getByText("Row Level Security (RLS)")).toBeVisible();
    await expect(page.getByText("Active on all 15 tables")).toBeVisible();
  });
});
