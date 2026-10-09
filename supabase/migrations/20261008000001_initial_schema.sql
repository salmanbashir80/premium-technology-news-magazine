-- SIGNAL DESK: PRODUCTION DATABASE MIGRATION 20261008000001
-- Phase 3: Supabase Normalized Schema, Row Level Security, Workflow Enforcements & Audit Triggers

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & TYPES
DO $$ BEGIN
  CREATE TYPE user_editorial_role AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'RESEARCHER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Staff Accounts linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_editorial_role NOT NULL DEFAULT 'RESEARCHER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  kicker TEXT NOT NULL,
  description TEXT,
  accent_color TEXT DEFAULT '#0D5C46',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. AUTHORS TABLE
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  bio TEXT,
  expertise TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  email TEXT,
  social_x TEXT,
  social_linkedin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. ARTICLE TAGS TABLE
CREATE TABLE IF NOT EXISTS public.article_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 7. ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  dek TEXT NOT NULL,
  summary TEXT,
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured_image TEXT NOT NULL,
  featured_image_caption TEXT,
  featured_image_credit TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES public.authors(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN (
      'discovered',
      'researching',
      'draft',
      'fact_check',
      'editorial_review',
      'approved',
      'scheduled',
      'published',
      'rejected',
      'archived'
    )
  ),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  is_editors_pick BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  key_takeaways TEXT[] NOT NULL DEFAULT '{}',
  reading_time INTEGER NOT NULL DEFAULT 5,
  seo_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. ARTICLE REVISIONS TABLE (Full version history)
CREATE TABLE IF NOT EXISTS public.article_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  dek TEXT NOT NULL,
  summary TEXT,
  body JSONB NOT NULL,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  change_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. ARTICLE SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL,
  url TEXT,
  verification_notes TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. STORY CANDIDATES TABLE
CREATE TABLE IF NOT EXISTS public.story_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  relevance_score NUMERIC(3,2),
  status TEXT NOT NULL DEFAULT 'discovered' CHECK (
    status IN ('discovered', 'evaluating', 'assigned', 'dismissed')
  ),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. RESEARCH BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.research_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.story_candidates(id) ON DELETE SET NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  key_findings TEXT[] NOT NULL DEFAULT '{}',
  data_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  risks_and_challenges TEXT,
  recommended_angle TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 12. EDITORIAL REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.editorial_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stage TEXT NOT NULL CHECK (stage IN ('fact_check', 'editorial_review', 'legal_review', 'final_approval')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'changes_requested', 'rejected')),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 13. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  credit TEXT,
  caption TEXT,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 14. NEWSLETTERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_confirmed BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 15. AUTOMATION JOBS TABLE
CREATE TABLE IF NOT EXISTS public.automation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL CHECK (job_type IN ('rss_scan', 'hermes_research', 'fact_check', 'social_syndicate', 'newsletter_digest')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 16. PUBLICATION EVENTS TABLE (Audit trail of publication, corrections, retractions)
CREATE TABLE IF NOT EXISTS public.publication_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('published', 'updated', 'correction', 'retraction', 'unpublish')),
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'STATUS_CHANGE')),
  previous_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 18. INDEXES FOR PERFORMANCE & HIGH FREQUENCY QUERIES
CREATE INDEX IF NOT EXISTS idx_articles_status_pub ON public.articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON public.articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON public.articles(is_breaking) WHERE is_breaking = true;
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON public.authors(slug);
CREATE INDEX IF NOT EXISTS idx_revisions_article ON public.article_revisions(article_id, revision_number DESC);
CREATE INDEX IF NOT EXISTS idx_sources_article ON public.article_sources(article_id);
CREATE INDEX IF NOT EXISTS idx_reviews_article ON public.editorial_reviews(article_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON public.story_candidates(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.automation_jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pub_events_article ON public.publication_events(article_id);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON public.audit_logs(table_name, record_id);

-- 19. HELPER FUNCTIONS FOR ROW LEVEL SECURITY (RLS)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_editorial_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_publish()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('OWNER', 'ADMIN', 'EDITOR')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 20. STATUS TRANSITION GUARD TRIGGER
-- Only Editors, Admins, or Owners can approve or publish articles.
CREATE OR REPLACE FUNCTION public.enforce_article_publishing_rules()
RETURNS trigger AS $$
BEGIN
  -- If transitioning to 'approved' or 'published', check permissions
  IF NEW.status IN ('approved', 'published') AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    IF NOT public.can_publish() AND auth.role() = 'authenticated' THEN
      RAISE EXCEPTION 'Editorial violation: Only EDITOR, ADMIN, or OWNER can approve or publish articles.';
    END IF;
  END IF;

  -- Ensure published articles have published_at set
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := timezone('utc', now());
  END IF;

  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_article_publishing ON public.articles;
CREATE TRIGGER trg_enforce_article_publishing
BEFORE INSERT OR UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_article_publishing_rules();

-- 21. AUDIT LOG TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.log_article_audit()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status != NEW.status THEN
      INSERT INTO public.audit_logs (table_name, record_id, action, previous_data, new_data, user_id)
      VALUES (
        'articles',
        NEW.id,
        'STATUS_CHANGE',
        jsonb_build_object('status', OLD.status),
        jsonb_build_object('status', NEW.status),
        auth.uid()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_article_audit ON public.articles;
CREATE TRIGGER trg_log_article_audit
AFTER UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.log_article_audit();

-- 22. ROW LEVEL SECURITY (RLS) POLICIES ON ALL 15 TABLES

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Public can read, Staff can manage
CREATE POLICY "Public read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage categories" ON public.categories FOR ALL TO authenticated USING (public.is_staff());

-- AUTHORS: Public can read, Staff can manage
CREATE POLICY "Public read authors" ON public.authors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage authors" ON public.authors FOR ALL TO authenticated USING (public.is_staff());

-- ARTICLE TAGS: Public read, Staff manage
CREATE POLICY "Public read tags" ON public.article_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage tags" ON public.article_tags FOR ALL TO authenticated USING (public.is_staff());

-- ARTICLES:
-- CRITICAL SECURITY: Public visitors can ONLY see published articles!
CREATE POLICY "Public view published articles" ON public.articles
FOR SELECT TO anon, authenticated
USING (status = 'published' AND published_at <= timezone('utc', now()));

-- Staff can view all articles (drafts, research, reviews)
CREATE POLICY "Staff view all articles" ON public.articles
FOR SELECT TO authenticated
USING (public.is_staff());

-- Staff can insert drafts
CREATE POLICY "Staff insert articles" ON public.articles
FOR INSERT TO authenticated
WITH CHECK (public.is_staff());

-- Staff can update articles
CREATE POLICY "Staff update articles" ON public.articles
FOR UPDATE TO authenticated
USING (public.is_staff());

-- Admin/Owner can delete articles
CREATE POLICY "Admins delete articles" ON public.articles
FOR DELETE TO authenticated
USING (public.current_user_role() IN ('OWNER', 'ADMIN'));

-- ARTICLE SOURCES: Public can read published article sources, Staff can manage
CREATE POLICY "Public read published sources" ON public.article_sources
FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.articles WHERE articles.id = article_sources.article_id AND articles.status = 'published'));
CREATE POLICY "Staff manage sources" ON public.article_sources FOR ALL TO authenticated USING (public.is_staff());

-- NEWSLETTERS: Public can subscribe (INSERT only), Staff can view
CREATE POLICY "Public newsletter subscribe" ON public.newsletters FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff view newsletters" ON public.newsletters FOR SELECT TO authenticated USING (public.is_staff());

-- PROFILES: Staff can read all profiles; Users can update own profile; Owner/Admin manage
CREATE POLICY "Staff read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL TO authenticated USING (public.current_user_role() IN ('OWNER', 'ADMIN'));

-- INTERNAL EDITORIAL TABLES (Completely blocked from anonymous visitors):
-- Revisions
CREATE POLICY "Staff manage revisions" ON public.article_revisions FOR ALL TO authenticated USING (public.is_staff());

-- Story Candidates
CREATE POLICY "Staff manage candidates" ON public.story_candidates FOR ALL TO authenticated USING (public.is_staff());

-- Research Briefs
CREATE POLICY "Staff manage briefs" ON public.research_briefs FOR ALL TO authenticated USING (public.is_staff());

-- Editorial Reviews
CREATE POLICY "Staff manage reviews" ON public.editorial_reviews FOR ALL TO authenticated USING (public.is_staff());

-- Media Assets
CREATE POLICY "Public read media assets" ON public.media_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage media assets" ON public.media_assets FOR ALL TO authenticated USING (public.is_staff());

-- Automation Jobs
CREATE POLICY "Staff view automation jobs" ON public.automation_jobs FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Admins manage automation jobs" ON public.automation_jobs FOR ALL TO authenticated USING (public.current_user_role() IN ('OWNER', 'ADMIN'));

-- Publication Events
CREATE POLICY "Staff view publication events" ON public.publication_events FOR SELECT TO authenticated USING (public.is_staff());
CREATE POLICY "Staff manage publication events" ON public.publication_events FOR INSERT TO authenticated WITH CHECK (public.is_staff());

-- Audit Logs
CREATE POLICY "Staff view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_staff());
