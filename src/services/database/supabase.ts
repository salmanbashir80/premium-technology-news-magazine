/**
 * ============================================================================
 * SIGNAL DESK — SUPABASE POSTGRESQL INTEGRATION BOUNDARY (PHASE 3 PREPARATION)
 * ============================================================================
 * Defines clean repository contracts, entity schemas, and query interfaces.
 * Decouples client and edge rendering from direct database dependencies.
 */

import type { Article, Author, Category } from "../../types";

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  serviceRoleKey?: string;
}

export interface ArticleFilter {
  category?: string;
  authorId?: string;
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
  create(article: Omit<Article, "id">): Promise<Article>;
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

/**
 * Mock/Static implementation currently serving local editorial datasets.
 * In Phase 3, this will be swapped with `SupabaseArticleRepository`
 * using the `@supabase/supabase-js` client.
 */
export class StaticArticleRepository implements IArticleRepository {
  private articles: Article[];

  constructor(articles: Article[]) {
    this.articles = articles;
  }

  async getById(id: string): Promise<Article | null> {
    return this.articles.find((a) => a.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<Article | null> {
    return this.articles.find((a) => a.slug === slug) ?? null;
  }

  async list(filter?: ArticleFilter): Promise<{ data: Article[]; count: number }> {
    let list = [...this.articles];
    if (filter?.category) list = list.filter((a) => a.category === filter.category);
    if (filter?.isBreaking !== undefined) list = list.filter((a) => a.isBreaking === filter.isBreaking);
    if (filter?.isTrending !== undefined) list = list.filter((a) => a.isTrending === filter.isTrending);
    if (filter?.isFeatured !== undefined) list = list.filter((a) => a.isFeatured === filter.isFeatured);
    if (filter?.tag) list = list.filter((a) => a.tags.includes(filter.tag!));
    
    const count = list.length;
    if (filter?.offset) list = list.slice(filter.offset);
    if (filter?.limit) list = list.slice(0, filter.limit);
    return { data: list, count };
  }

  async getRelated(articleId: string, limit = 3): Promise<Article[]> {
    const target = this.articles.find((a) => a.id === articleId);
    if (!target) return [];
    return this.articles
      .filter((a) => a.id !== target.id && (a.category === target.category || a.tags.some((t) => target.tags.includes(t))))
      .slice(0, limit);
  }

  async create(): Promise<Article> {
    throw new Error("Local mock repository is read-only. Connect Supabase in Phase 3.");
  }

  async update(): Promise<Article> {
    throw new Error("Local mock repository is read-only. Connect Supabase in Phase 3.");
  }

  async delete(): Promise<boolean> {
    throw new Error("Local mock repository is read-only. Connect Supabase in Phase 3.");
  }
}
