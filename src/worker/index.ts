import { publishedArticles, getArticle } from "../data/articles";
import { categories, categoryMap } from "../data/categories";
import { authors, getAuthor } from "../data/authors";
import { brand } from "../config/brand";
import { formatDateTime } from "../lib/format";
import type { Article } from "../types";

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

const BASE_URL = "https://premium-technology-news-magazine.8002salman.workers.dev";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function generateRobotsTxt(): Response {
  const content = [
    "# Signal Desk robots.txt",
    "User-agent: *",
    "Disallow: /admin",
    "Disallow: /admin/",
    "",
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    `Sitemap: ${BASE_URL}/sitemap-news.xml`,
    "",
  ].join("\n");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function generateSitemapXml(): Response {
  const staticRoutes = [
    "/",
    "/search",
    "/about",
    "/contact",
    "/editorial-policy",
    "/corrections-policy",
    "/privacy",
    "/terms",
  ];

  const now = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const route of staticRoutes) {
    xml += `  <url>\n    <loc>${BASE_URL}${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${route === "/" ? "1.0" : "0.7"}</priority>\n  </url>\n`;
  }

  for (const cat of categories) {
    xml += `  <url>\n    <loc>${BASE_URL}/category/${cat.slug}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  for (const article of publishedArticles) {
    const lastmod = article.updatedAt || article.publishedAt;
    xml += `  <url>\n    <loc>${BASE_URL}/${article.category}/${article.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  xml += "</urlset>";

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function generateNewsSitemapXml(): Response {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  for (const article of publishedArticles) {
    xml += "  <url>\n";
    xml += `    <loc>${BASE_URL}/${article.category}/${article.slug}</loc>\n`;
    xml += "    <news:news>\n";
    xml += "      <news:publication>\n";
    xml += "        <news:name>Signal Desk</news:name>\n";
    xml += "        <news:language>en</news:language>\n";
    xml += "      </news:publication>\n";
    xml += `      <news:publication_date>${article.publishedAt}</news:publication_date>\n`;
    xml += `      <news:title>${escapeXml(article.title)}</news:title>\n`;
    xml += "    </news:news>\n";
    xml += "  </url>\n";
  }

  xml += "</urlset>";

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function generateRssXml(): Response {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  xml += "  <channel>\n";
  xml += `    <title>Signal Desk — Technology News &amp; Analysis</title>\n`;
  xml += `    <link>${BASE_URL}/</link>\n`;
  xml += `    <description>${escapeXml(brand.description)}</description>\n`;
  xml += `    <language>en-us</language>\n`;
  xml += `    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n`;

  for (const article of publishedArticles) {
    const author = getAuthor(article.authorId);
    const pubDate = new Date(article.publishedAt).toUTCString();
    const link = `${BASE_URL}/${article.category}/${article.slug}`;

    xml += "    <item>\n";
    xml += `      <title>${escapeXml(article.title)}</title>\n`;
    xml += `      <link>${link}</link>\n`;
    xml += `      <guid isPermaLink="true">${link}</guid>\n`;
    xml += `      <description>${escapeXml(article.dek || article.excerpt)}</description>\n`;
    xml += `      <pubDate>${pubDate}</pubDate>\n`;
    if (author) {
      xml += `      <author>${escapeXml(author.email || "newsroom@signaldesk.news")} (${escapeXml(author.name)})</author>\n`;
    }
    xml += `      <category>${escapeXml(article.category)}</category>\n`;
    xml += "    </item>\n";
  }

  xml += "  </channel>\n";
  xml += "</rss>";

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function buildArticlePrerenderHtml(article: Article): string {
  const author = getAuthor(article.authorId);
  const category = categoryMap[article.category];
  const dateFormatted = formatDateTime(article.publishedAt);

  let bodyHtml = "";
  for (const b of article.body) {
    if (b.type === "p") {
      bodyHtml += `<p class="font-serif text-lg leading-relaxed mb-4 text-[#2A2A28]">${escapeXml(b.text)}</p>`;
    } else if (b.type === "h2") {
      bodyHtml += `<h2 class="font-display text-2xl font-medium mt-8 mb-3 text-[#121212]">${escapeXml(b.text)}</h2>`;
    } else if (b.type === "h3") {
      bodyHtml += `<h3 class="font-sans text-xl font-semibold mt-6 mb-2 text-[#121212]">${escapeXml(b.text)}</h3>`;
    } else if (b.type === "quote") {
      bodyHtml += `<blockquote class="border-l-4 border-[#0D5C46] pl-4 italic my-6 text-xl text-[#121212]">${escapeXml(b.text)}</blockquote>`;
    }
  }

  return `
    <article class="bg-[#FFFEFB] py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      <nav aria-label="Breadcrumb" class="text-xs text-[#6F6C63] mb-4">
        <a href="/">Home</a> / <a href="/category/${article.category}">${category?.name || article.category}</a> / <span>${escapeXml(article.title)}</span>
      </nav>
      <div class="mb-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-[#0D5C46]">${category?.kicker || article.category}</span>
        ${article.isBreaking ? '<span class="ml-2 bg-[#9B2C2C] text-white text-[10px] font-bold uppercase px-1.5 py-0.5">Developing</span>' : ""}
      </div>
      <h1 class="font-display text-3xl sm:text-5xl font-medium leading-tight text-[#121212] mb-4">${escapeXml(article.title)}</h1>
      <p class="font-serif text-xl text-[#5C5A54] leading-snug mb-6">${escapeXml(article.dek)}</p>
      <div class="border-t border-[#DDD8CC] py-3 text-xs text-[#6F6C63] mb-8">
        By <span class="font-semibold text-[#121212]">${escapeXml(author?.name || "Signal Desk Staff")}</span> · ${dateFormatted} · ${article.readingTime} min read
      </div>
      <figure class="mb-8">
        <img src="${article.featuredImage}" alt="${escapeXml(article.featuredImageCaption)}" class="w-full aspect-[16/9] object-cover mb-2" />
        <figcaption class="text-xs text-[#6F6C63]">${escapeXml(article.featuredImageCaption)} / ${escapeXml(article.featuredImageCredit)}</figcaption>
      </figure>
      <div class="max-w-[46rem]">
        ${article.keyTakeaways?.length ? `
          <div class="bg-[#F3F1EA] p-5 border border-[#DDD8CC] mb-8">
            <h3 class="font-sans text-xs font-bold uppercase tracking-wider text-[#0D5C46] mb-3">Key Takeaways</h3>
            <ul class="list-disc pl-5 space-y-1.5 text-sm text-[#2A2A28]">
              ${article.keyTakeaways.map((t) => `<li>${escapeXml(t)}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
        ${bodyHtml}
      </div>
    </article>
  `;
}

function buildNotFoundHtml(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 Not Found — Signal Desk</title>
      <meta name="robots" content="noindex, nofollow">
      <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F3F1EA; color: #121212; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .card { background: #FFFEFB; border: 1px solid #DDD8CC; max-width: 560px; padding: 40px; text-align: center; }
        .kicker { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.14em; color: #0D5C46; }
        h1 { font-family: serif; font-size: 32px; margin: 12px 0; }
        p { color: #5C5A54; font-size: 16px; line-height: 1.6; }
        a { display: inline-block; margin-top: 20px; background: #121212; color: #FFFEFB; padding: 12px 24px; text-decoration: none; font-weight: 600; font-size: 14px; }
        a:hover { background: #0D5C46; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="kicker">404 Error · Page Not Found</div>
        <h1>This story or section could not be found.</h1>
        <p>The requested address does not correspond to an article or resource in our library.</p>
        <a href="/">Return to Signal Desk Homepage</a>
      </div>
    </body>
    </html>
  `;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, "") || "/";

    // 1. Direct XML & Robots Endpoints
    if (pathname === "/robots.txt") {
      return generateRobotsTxt();
    }
    if (pathname === "/sitemap.xml") {
      return generateSitemapXml();
    }
    if (pathname === "/sitemap-news.xml") {
      return generateNewsSitemapXml();
    }
    if (pathname === "/rss.xml") {
      return generateRssXml();
    }

    // 2. Static Asset Files (.js, .css, .jpg, .png, .svg, .woff2, .json, etc.)
    if (pathname.includes(".") && !pathname.endsWith(".html")) {
      return await env.ASSETS.fetch(request);
    }

    // 3. Resolve Route Pattern
    const parts = pathname.split("/").filter(Boolean);

    let article: Article | undefined;
    let isNotFound = false;

    const knownRoots = new Set([
      "search", "about", "contact", "editorial-policy", "corrections-policy",
      "privacy", "terms", "admin", "category", "author", "article",
      ...categories.map((c) => c.slug),
    ]);

    if (parts.length > 0 && !knownRoots.has(parts[0])) {
      isNotFound = true;
    } else if (parts.length === 2 && parts[0] === "article") {
      // Legacy alias: /article/:slug
      article = getArticle(parts[1]);
      if (!article) isNotFound = true;
    } else if (parts.length === 2 && parts[0] === "category") {
      const exists = categories.some((c) => c.slug === parts[1]);
      if (!exists) isNotFound = true;
    } else if (parts.length === 2 && parts[0] === "author") {
      const exists = authors.some((a) => a.slug === parts[1]);
      if (!exists) isNotFound = true;
    } else if (parts.length === 2) {
      // Clean pattern: /:category/:slug (e.g., /ai/ai-power-bottleneck-data-centers)
      const isKnownCategory = categories.some((c) => c.slug === parts[0]);
      if (isKnownCategory) {
        article = getArticle(parts[1]);
        if (!article) isNotFound = true;
      } else {
        isNotFound = true;
      }
    } else if (parts.length > 2) {
      isNotFound = true;
    }

    // Real HTTP 404 response for unmatched paths
    if (isNotFound) {
      return new Response(buildNotFoundHtml(), {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      });
    }

    // Fetch base HTML shell from assets (fetching root "/" serves dist/index.html with 200 OK)
    const rootUrl = new URL("/", request.url);
    const assetResponse = await env.ASSETS.fetch(new Request(rootUrl.toString(), request));
    if (!assetResponse.ok) {
      return assetResponse;
    }

    let html = await assetResponse.text();

    // 4. Inject Dynamic SEO Metadata & Pre-rendered Content
    if (article) {
      const canonicalUrl = `${BASE_URL}/${article.category}/${article.slug}`;
      const title = `${article.title} — Signal Desk`;
      const description = article.dek || article.excerpt;
      const ogImage = article.featuredImage || `${BASE_URL}/images/hero-ai-cluster.jpg`;
      const author = getAuthor(article.authorId);

      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description,
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
          url: BASE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/images/newsroom.jpg`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl,
        },
      };

      // Replace Title
      html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeXml(title)}</title>`);

      // Inject SEO Meta tags & Canonical
      const headInjection = `
    <meta name="description" content="${escapeXml(description)}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:title" content="${escapeXml(title)}">
    <meta property="og:description" content="${escapeXml(description)}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeXml(title)}">
    <meta name="twitter:description" content="${escapeXml(description)}">
    <meta name="twitter:image" content="${ogImage}">
    <meta name="robots" content="noindex, nofollow">
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `.trim();

      html = html.replace("</head>", `  ${headInjection}\n</head>`);

      // Inject Semantic Pre-rendered Article HTML into root
      const articlePrerender = buildArticlePrerenderHtml(article);
      html = html.replace('<div id="root"></div>', `<div id="root">${articlePrerender}</div>`);
    } else {
      // General Pages (Homepage, Category, Info pages)
      const isKnownCategory = parts.length === 2 && parts[0] === "category" ? categories.find((c) => c.slug === parts[1]) : categories.find((c) => c.slug === parts[0]);
      const pageTitle = isKnownCategory
        ? `${isKnownCategory.name} — Signal Desk`
        : pathname === "/"
          ? "Signal Desk — Technology News & Analysis"
          : "Signal Desk";

      html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeXml(pageTitle)}</title>`);
      html = html.replace("</head>", `  <meta name="robots" content="noindex, nofollow">\n</head>`);
    }

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  },
};
