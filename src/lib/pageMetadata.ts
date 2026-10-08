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
  const parts = path.split("/").filter(Boolean);

  let article: Article | undefined;
  let categoryName: string | undefined;
  let authorName: string | undefined;

  if (parts.length === 2 && parts[0] === "article") {
    article = getArticle(parts[1]);
  } else if (parts.length === 2 && parts[0] === "category") {
    categoryName = getCategory(parts[1])?.name;
  } else if (parts.length === 2 && parts[0] === "author") {
    authorName = authors.find((a) => a.slug === parts[1])?.name;
  } else if (parts.length === 2) {
    // Clean pattern: /:category/:slug (e.g., /ai/ai-power-bottleneck-data-centers)
    article = getArticle(parts[1]);
    if (!article) {
      categoryName = getCategory(parts[0])?.name;
    }
  } else if (parts.length === 1) {
    categoryName = getCategory(parts[0])?.name;
  }

  const category = article ? getCategory(article.category) : undefined;
  const author = article ? getAuthor(article.authorId) : undefined;

  const title =
    article?.title ??
    categoryName ??
    authorName ??
    titles[path] ??
    "Page Not Found";

  const description =
    article?.dek ??
    article?.excerpt ??
    category?.description ??
    brand.description;

  const canonicalPath = article
    ? `/${article.category}/${article.slug}`
    : path;

  return {
    title: `${title} — ${brand.wordmark}`,
    description,
    canonicalUrl: `https://premium-technology-news-magazine.8002salman.workers.dev${canonicalPath}`,
    ogType: article ? "article" : "website",
    ogImage: article?.featuredImage || "https://premium-technology-news-magazine.8002salman.workers.dev/images/hero-ai-cluster.jpg",
    publishedTime: article?.publishedAt,
    modifiedTime: article?.updatedAt,
    author: author?.name,
  };
}

export function generateArticleSchema(article: Article) {
  const author = getAuthor(article.authorId);
  const canonicalUrl = `https://premium-technology-news-magazine.8002salman.workers.dev/${article.category}/${article.slug}`;

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
      "@id": canonicalUrl,
    },
  };
}