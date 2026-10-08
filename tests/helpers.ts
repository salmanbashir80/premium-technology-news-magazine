import { expect, type Page } from "@playwright/test";

export async function noPageOverflow(page: Page) {
  const sizes = await page.evaluate(async () => {
    // Temporarily expose overflow so a clipped root cannot hide a broken layout.
    const elements = [document.documentElement, document.body, document.querySelector<HTMLElement>("#root > div")]
      .filter((el): el is HTMLElement => el !== null);
    const previous = elements.map((el) => el.style.overflowX);
    elements.forEach((el) => { el.style.overflowX = "visible"; });
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    const result = { viewport: window.innerWidth, content: document.documentElement.scrollWidth };
    elements.forEach((el, index) => { el.style.overflowX = previous[index]; });
    return result;
  });
  expect(sizes.content, JSON.stringify(sizes)).toBeLessThanOrEqual(sizes.viewport + 1);
}

export async function settleFonts(page: Page) {
  await page.evaluate(() => Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]));
}