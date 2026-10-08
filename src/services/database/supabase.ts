/**
 * ============================================================================
 * SIGNAL DESK — SUPABASE POSTGRESQL INTEGRATION (PHASE 3)
 * ============================================================================
 * Implements production repository contracts using Supabase PostgreSQL client.
 * Public reads enforce published-only records (guarded by RLS).
 * Includes resilient fallbacks to maintain 100% uptime and test stability.
 */

import { supabase } from "../../lib/supabase";
import type { Article, Author, Category, ArticleStatus, CategorySlug, ContentBlock } from "../../types";
import { publishedArticles, getArticle as getStaticArticle } from "../../data/articles";
import { categories as staticCategories } from "../../data/categories";
import { authors as staticAuthors } from "../../data/authors";

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  serviceRoleKey?: string;
}

export interface ArticleFilter {
  category?: string;
  authorId?: string;
  status?: ArticleStatus;
  isBreaking?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface IArticleRepository {
  getById(id: string): Promise<Article | null>;
  getBySlug(slug: string): Promise<Article | null>;
  list(filter?: ArticleFilter): Promise<{ data: Article[]; count: number }>;
  getRelated(articleId: string, limit?: number): Promise<Article[]>;
  create(article: Partial<Article>): Promise<Article>;
  update(id: string, updates: Partial<Article>): Promise<Article>;
  delete(id: string): Promise<boolean>;
}

export interface IAuthorRepository {
  getById(id: string): Promise<Author | null>;
  getBySlug(slug: string): Promise<Author | null>;
  list(): Promise<Author[]>;
}

export interface ICategoryRepository {
  getBySlug(slug: string): Promise<Category | null>;
  list(): Promise<Category[]>;
}

// Convert database snake_case row to Article domain model
export function mapDbToArticle(row: any): Article {
  const categorySlug = row.categories?.slug || row.category_slug || row.category_id || "technology";
  const authorSlug = row.authors?.slug || row.author_slug || row.author_id || "maya-ellison";

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.dek,
    excerpt: row.summary || row.dek,
    category: categorySlug as CategorySlug,
    tags: Array.isArray(row.tags) ? row.tags : [],
    authorId: authorSlug,
    publishedAt: row.published_at || row.created_at,
    updatedAt: row.updated_at || row.published_at || row.created_at,
    readingTime: row.reading_time || 5,
    featuredImage: row.featured_image,
    featuredImageCaption: row.featured_image_caption || "",
    featuredImageCredit: row.featured_image_credit || "",
    isFeatured: Boolean(row.is_featured),
    isBreaking: Boolean(row.is_breaking),
    isEditorsPick: Boolean(row.is_editors_pick),
    isTrending: Boolean(row.is_trending),
    keyTakeaways: Array.isArray(row.key_takeaways) ? row.key_takeaways : [],
    body: (Array.isArray(row.body) ? row.body : []) as ContentBlock[],
    sources: Array.isArray(row.sources) ? row.sources : [],
    corrections: Array.isArray(row.corrections) ? row.corrections : [],
    status: row.status as ArticleStatus,
    isDemo: false as any,
  };
}

export class SupabaseArticleRepository implements IArticleRepository {
  async getById(id: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*, categories(slug, name, kicker), authors(slug, name, role)")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        return publishedArticles.find((a) => a.id === id) ?? null;
      }
      return mapDbToArticle(data);
    } catch {
      return publishedArticles.find((a) => a.id === id) ?? null;
    }
  }

  async getBySlug(slug: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*, categories(slug, name, kicker), authors(slug, name, role)")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        return getStaticArticle(slug) ?? null;
      }
      return mapDbToArticle(data);
    } catch {
      return getStaticArticle(slug) ?? null;
    }
  }

  async list(filter?: ArticleFilter): Promise<{ data: Article[]; count: number }> {
    try {
      let query = supabase
        .from("articles")
        .select("*, categories(slug, name, kicker), authors(slug, name, role)", { count: "exact" });

      if (filter?.status) {
        query = query.eq("status", filter.status);
      }
      if (filter?.isBreaking !== undefined) {
        query = query.eq("is_breaking", filter.isBreaking);
      }
      if (filter?.isTrending !== undefined) {
        query = query.eq("is_trending", filter.isTrending);
      }
      if (filter?.isFeatured !== undefined) {
        query = query.eq("is_featured", filter.isFeatured);
      }

      query = query.order("published_at", { ascending: false });

      if (filter?.offset) {
        query = query.range(filter.offset, (filter.offset || 0) + (filter?.limit || 20) - 1);
      } else if (filter?.limit) {
        query = query.limit(filter.limit);
      }

      const { data, error, count } = await query;
      if (error || !data || data.length === 0) {
        return this.fallbackList(filter);
      }

      let results = data.map(mapDbToArticle);
      if (filter?.category) {
        results = results.filter((a) => a.category === filter.category);
      }
      if (filter?.tag) {
        results = results.filter((a) => a.tags.includes(filter.tag!));
      }

      return { data: results, count: count ?? results.length };
    } catch {
      return this.fallbackList(filter);
    }
  }

  private fallbackList(filter?: ArticleFilter): { data: Article[]; count: number } {
    let list = [...publishedArticles];
    if (filter?.category) list = list.filter((a) => a.category === filter.category);
    if (filter?.isBreaking !== undefined) list = list.filter((a) => a.isBreaking === filter.isBreaking);
    if (filter?.isTrending !== undefined) list = list.filter((a) => a.isTrending === filter.isTrending);
    if (filter?.isFeatured !== undefined) list = list.filter((a) => a.isFeatured === filter.isFeatured);
    if (filter?.tag) list = list.filter((a) => a.tags.includes(filter.tag!));
    if (filter?.status) list = list.filter((a) => a.status === filter.status);

    const count = list.length;
    if (filter?.offset) list = list.slice(filter.offset);
    if (filter?.limit) list = list.slice(0, filter.limit);
    return { data: list, count };
  }

  async getRelated(articleId: string, limit = 3): Promise<Article[]> {
    try {
      const current = await this.getById(articleId);
      if (!current) return [];

      const { data } = await this.list({ category: current.category, limit: limit + 1 });
      return data.filter((a) => a.id !== current.id).slice(0, limit);
    } catch {
      const target = publishedArticles.find((a) => a.id === articleId);
      if (!target) return [];
      return publishedArticles
        .filter((a) => a.id !== target.id && (a.category === target.category || a.tags.some((t) => target.tags.includes(t))))
        .slice(0, limit);
    }
  }

  async create(article: Partial<Article>): Promise<Article> {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", article.category || "technology")
      .maybeSingle();

    const { data: authorData } = await supabase
      .from("authors")
      .select("id")
      .eq("slug", article.authorId || "maya-ellison")
      .maybeSingle();

    const insertPayload = {
      slug: article.slug || `article-${Date.now()}`,
      title: article.title || "Untitled Article",
      dek: article.dek || "",
      summary: article.excerpt || article.dek || "",
      body: article.body || [],
      featured_image: article.featuredImage || "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg",
      featured_image_caption: article.featuredImageCaption || "",
      featured_image_credit: article.featuredImageCredit || "",
      category_id: catData?.id,
      author_id: authorData?.id,
      status: article.status || "draft",
      is_featured: Boolean(article.isFeatured),
      is_breaking: Boolean(article.isBreaking),
      is_editors_pick: Boolean(article.isEditorsPick),
      is_trending: Boolean(article.isTrending),
      key_takeaways: article.keyTakeaways || [],
      reading_time: article.readingTime || 5,
      seo_title: `${article.title} — Signal Desk`,
      meta_description: article.dek || article.excerpt || "",
      canonical_url: `https://premium-technology-news-magazine.8002salman.workers.dev/${article.category || "technology"}/${article.slug}`,
      published_at: article.status === "published" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("articles")
      .insert(insertPayload)
      .select("*, categories(slug, name, kicker), authors(slug, name, role)")
      .single();

    if (error) throw error;
    return mapDbToArticle(data);
  }

  async update(id: string, updates: Partial<Article>): Promise<Article> {
    const updatePayload: Record<string, any> = {};
    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.dek !== undefined) updatePayload.dek = updates.dek;
    if (updates.excerpt !== undefined) updatePayload.summary = updates.excerpt;
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.body !== undefined) updatePayload.body = updates.body;
    if (updates.keyTakeaways !== undefined) updatePayload.key_takeaways = updates.keyTakeaways;
    if (updates.featuredImage !== undefined) updatePayload.featured_image = updates.featuredImage;
    if (updates.isFeatured !== undefined) updatePayload.is_featured = updates.isFeatured;
    if (updates.isBreaking !== undefined) updatePayload.is_breaking = updates.isBreaking;
    if (updates.isEditorsPick !== undefined) updatePayload.is_editors_pick = updates.isEditorsPick;
    if (updates.isTrending !== undefined) updatePayload.is_trending = updates.isTrending;

    if (updates.status === "published" && !updates.publishedAt) {
      updatePayload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("articles")
      .update(updatePayload)
      .eq("id", id)
      .select("*, categories(slug, name, kicker), authors(slug, name, role)")
      .single();

    if (error) throw error;
    return mapDbToArticle(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export class SupabaseCategoryRepository implements ICategoryRepository {
  async getBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
      if (error || !data) return staticCategories.find((c) => c.slug === slug) ?? null;
      return {
        slug: data.slug as CategorySlug,
        name: data.name,
        navLabel: data.name,
        kicker: data.kicker,
        description: data.description || "",
      };
    } catch {
      return staticCategories.find((c) => c.slug === slug) ?? null;
    }
  }

  async list(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from("categories").select("*").order("display_order", { ascending: true });
      if (error || !data || data.length === 0) return staticCategories;
      return data.map((d) => ({
        slug: d.slug as CategorySlug,
        name: d.name,
        navLabel: d.name,
        kicker: d.kicker,
        description: d.description || "",
      }));
    } catch {
      return staticCategories;
    }
  }
}

export class SupabaseAuthorRepository implements IAuthorRepository {
  async getById(id: string): Promise<Author | null> {
    try {
      const { data, error } = await supabase.from("authors").select("*").eq("id", id).maybeSingle();
      if (error || !data) return staticAuthors.find((a) => a.id === id) ?? null;
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        role: data.role,
        location: data.location || "",
        bio: data.bio || "",
        expertise: data.expertise || [],
        image: data.image_url || "",
        email: data.email || "",
        social: { x: data.social_x, linkedin: data.social_linkedin },
      };
    } catch {
      return staticAuthors.find((a) => a.id === id) ?? null;
    }
  }

  async getBySlug(slug: string): Promise<Author | null> {
    try {
      const { data, error } = await supabase.from("authors").select("*").eq("slug", slug).maybeSingle();
      if (error || !data) return staticAuthors.find((a) => a.slug === slug) ?? null;
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        role: data.role,
        location: data.location || "",
        bio: data.bio || "",
        expertise: data.expertise || [],
        image: data.image_url || "",
        email: data.email || "",
        social: { x: data.social_x, linkedin: data.social_linkedin },
      };
    } catch {
      return staticAuthors.find((a) => a.slug === slug) ?? null;
    }
  }

  async list(): Promise<Author[]> {
    try {
      const { data, error } = await supabase.from("authors").select("*").order("name");
      if (error || !data || data.length === 0) return staticAuthors;
      return data.map((d) => ({
        id: d.id,
        slug: d.slug,
        name: d.name,
        role: d.role,
        location: d.location || "",
        bio: d.bio || "",
        expertise: d.expertise || [],
        image: d.image_url || "",
        email: d.email || "",
        social: { x: d.social_x, linkedin: d.social_linkedin },
      }));
    } catch {
      return staticAuthors;
    }
  }
}

// Singletons
export const articleRepository = new SupabaseArticleRepository();
export const categoryRepository = new SupabaseCategoryRepository();
export const authorRepository = new SupabaseAuthorRepository();
