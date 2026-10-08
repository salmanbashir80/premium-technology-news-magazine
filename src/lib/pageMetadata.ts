import { brand } from "../config/brand";
import { getArticle } from "../data/articles";
import { authors, getAuthor } from "../data/authors";
import { getCategory } from "../data/categories";
import type { Article } from "../types";

const titles: Record<string, string> = {
  "/": "Technology News & Analysis",
  "/search": "Search",
  "/about": "About Us",
  "/contact": "Contact",
  "/editorial-policy": "Editorial Policy",
  "/corrections-policy": "Corrections Policy",
  "/privacy": "Privacy Policy",
  "/terms": "Terms of Service",
  "/admin": "Newsroom Overview",
  "/admin/discovery": "News Discovery",
  "/admin/research": "Research Queue",
  "/admin/drafts": "Draft Articles",
  "/admin/approvals": "Editorial Approvals",
  "/admin/published": "Published Articles",
  "/admin/media": "Media Library",
  "/admin/seo": "SEO & Analytics",
  "/admin/automation": "Automation Health",
  "/admin/settings": "Settings",
};

export function pageMetadata(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  const [, kind, slug] = path.split("/");
  const article = kind === "article" ? getArticle(slug) : undefined;
  const category = kind === "category" ? getCategory(slug) : undefined;
  const author = kind === "author" ? authors.find((a) => a.slug === slug) : undefined;
  const title = article?.title ?? category?.name ?? author?.name ?? titles[path] ?? "Not found";
  const description = article?.dek ?? article?.excerpt ?? category?.description ?? brand.description;

  return {
    title: `${title} — ${brand.wordmark}`,
    description,
    canonicalUrl: `https://premium-technology-news-magazine.8002salman.workers.dev/#${path}`,
    ogType: article ? "article" : "website",
    ogImage: article?.featuredImage || "https://premium-technology-news-magazine.8002salman.workers.dev/images/hero-ai-cluster.jpg",
  };
}

export function generateArticleSchema(article: Article) {
  const author = getAuthor(article.authorId);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.dek || article.excerpt,
    image: [article.featuredImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: author?.name || "Signal Desk Staff",
      jobTitle: author?.role,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "Signal Desk",
      url: "https://premium-technology-news-magazine.8002salman.workers.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://premium-technology-news-magazine.8002salman.workers.dev/images/newsroom.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://premium-technology-news-magazine.8002salman.workers.dev/#/article/${article.slug}`,
    },
  };
}