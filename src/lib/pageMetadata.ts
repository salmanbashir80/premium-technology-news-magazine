import { brand } from "../config/brand";
import { getArticle } from "../data/articles";
import { authors } from "../data/authors";
import { getCategory } from "../data/categories";

const titles: Record<string, string> = {
  "/": "Technology News & Analysis",
  "/search": "Search",
  "/about": "About us",
  "/contact": "Contact",
  "/editorial-policy": "Editorial policy",
  "/corrections-policy": "Corrections policy",
  "/privacy": "Privacy",
  "/terms": "Terms",
  "/admin": "Newsroom overview",
  "/admin/discovery": "News discovery",
  "/admin/research": "Research queue",
  "/admin/drafts": "Draft articles",
  "/admin/approvals": "Editorial approvals",
  "/admin/published": "Published articles",
  "/admin/media": "Media library",
  "/admin/seo": "SEO & analytics",
  "/admin/automation": "Automation health",
  "/admin/settings": "Settings",
};

export function pageMetadata(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  const [, kind, slug] = path.split("/");
  const article = kind === "article" ? getArticle(slug) : undefined;
  const category = kind === "category" ? getCategory(slug) : undefined;
  const author = kind === "author" ? authors.find((a) => a.slug === slug) : undefined;
  const title = article?.title ?? category?.name ?? author?.name ?? titles[path] ?? "Not found";
  return {
    title: `${title} | ${brand.wordmark}`,
    description: `${brand.demoNotice} ${article?.dek ?? category?.description ?? brand.description}`,
  };
}