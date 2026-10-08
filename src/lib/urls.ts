import type { Article } from "../types";

/**
 * Returns clean, search-engine-friendly article URL.
 * Format: `/:category/:slug` (e.g., `/ai/ai-power-bottleneck-data-centers`)
 */
export function getArticleUrl(article: Pick<Article, "category" | "slug">): string {
  return `/${article.category}/${article.slug}`;
}

/**
 * Returns canonical section/category URL.
 */
export function getCategoryUrl(slug: string): string {
  return `/category/${slug}`;
}

/**
 * Returns author profile URL.
 */
export function getAuthorUrl(slug: string): string {
  return `/author/${slug}`;
}
