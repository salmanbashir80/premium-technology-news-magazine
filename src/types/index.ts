export type CategorySlug =
  | "ai"
  | "technology"
  | "startups"
  | "business"
  | "cybersecurity"
  | "ecommerce"
  | "guides";

export type UserEditorialRole = "OWNER" | "ADMIN" | "EDITOR" | "RESEARCHER";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url?: string | null;
  role: UserEditorialRole;
  created_at?: string;
  updated_at?: string;
}

export type ArticleStatus =
  | "discovered"
  | "researching"
  | "draft"
  | "fact_check"
  | "editorial_review"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "archived"
  // Legacy aliases for backward compatibility
  | "drafted"
  | "needs_review"
  | "failed";

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "callout"; title: string; text: string; variant?: "info" | "analysis" | "warning" }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption: string; credit: string };

export interface Category {
  slug: CategorySlug;
  name: string;
  navLabel: string;
  description: string;
  kicker: string;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  expertise: string[];
  image: string;
  email: string;
  social: { x?: string; linkedin?: string };
}

export interface Source {
  title: string;
  publisher: string;
  note: string;
}

export interface Correction {
  date: string;
  text: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  dek: string;
  excerpt: string;
  category: CategorySlug;
  tags: string[];
  authorId: string;
  author?: Author;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featuredImage: string;
  featuredImageCaption: string;
  featuredImageCredit: string;
  isFeatured: boolean;
  isBreaking: boolean;
  isEditorsPick: boolean;
  isTrending: boolean;
  keyTakeaways: string[];
  body: ContentBlock[];
  sources: Source[];
  corrections: Correction[];
  status: ArticleStatus;
  isDemo?: boolean;
}

export interface AdminItem {
  id: string;
  headline: string;
  source: string;
  category: CategorySlug;
  status: ArticleStatus;
  assignee: string;
  discoveredAt: string;
  updatedAt: string;
  notes: string;
  score: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: "image" | "chart" | "document";
  usedIn: string;
  uploadedAt: string;
  credit: string;
}

export interface AutomationJob {
  id: string;
  name: string;
  system: string;
  status: "healthy" | "degraded" | "paused" | "failed";
  lastRun: string;
  nextRun: string;
  note: string;
}
