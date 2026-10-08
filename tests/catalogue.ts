import { articles } from "../src/data/articles";
import { authors } from "../src/data/authors";
import { categories } from "../src/data/categories";

export const article = articles.find((a) => a.isFeatured)!;

export const adminPaths = [
  "/admin", "/admin/discovery", "/admin/research", "/admin/drafts",
  "/admin/approvals", "/admin/published", "/admin/media", "/admin/seo",
  "/admin/automation", "/admin/settings",
];

export const editorialPaths = [
  "/about", "/contact", "/editorial-policy", "/corrections-policy", "/privacy", "/terms",
];

export const routeCases = [
  { path: "/", heading: "Signal Desk: technology news and analysis" },
  ...categories.map((c) => ({ path: `/category/${c.slug}`, heading: c.name })),
  ...articles.map((a) => ({ path: `/article/${a.slug}`, heading: a.title })),
  ...authors.map((a) => ({ path: `/author/${a.slug}`, heading: a.name })),
  { path: "/search", heading: "Look through the desk" },
  ...editorialPaths.map((path) => ({ path, heading: undefined })),
  ...adminPaths.map((path) => ({ path, heading: undefined })),
];

export const knownPaths = new Set(routeCases.map((r) => r.path));