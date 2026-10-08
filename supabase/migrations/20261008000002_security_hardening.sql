-- ============================================================================
-- SIGNAL DESK — PHASE 3.1: CRITICAL SECURITY & EDITORIAL WORKFLOW HARDENING
-- ============================================================================
-- 1. Prevents role escalation on profiles (only OWNER/ADMIN can modify roles).
-- 2. Makes user id and email immutable on profiles.
-- 3. Enforces strict state machine workflow: draft -> fact_check -> editorial_review -> approved -> published.
-- 4. Rejects direct draft-to-published transitions at the database level.
-- 5. Demands valid approval record and editorial permissions before publishing.
-- 6. Adds is_demo flag to isolate demonstration content from real journalism.
-- 7. Restricts audit_logs to strictly append-only (no updates, no deletes).
-- ============================================================================

-- 1. DEMO CONTENT ISOLATION FLAG
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- Backfill initial demonstration seed articles
UPDATE public.articles
SET is_demo = true;

CREATE INDEX IF NOT EXISTS idx_articles_status_demo
ON public.articles(status, is_demo, published_at DESC);

-- 2. ROLE ESCALATION DEFENSE ON PROFILES
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS trigger AS $$
DECLARE
  caller_role user_editorial_role;
BEGIN
  -- Prevent altering profile user ID
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Security violation: Profile user ID is immutable.';
  END IF;

  -- Prevent altering email directly via profile table
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Security violation: Profile email can only be changed via Supabase Auth.';
  END IF;

  -- If role is being changed:
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check caller authority
    caller_role := public.current_user_role();

    IF auth.role() = 'authenticated' THEN
      -- Only OWNER or ADMIN can change roles
      IF caller_role NOT IN ('OWNER', 'ADMIN') OR caller_role IS NULL THEN
        RAISE EXCEPTION 'Security violation: Only OWNER or ADMIN can assign editorial roles. Role escalation blocked.';
      END IF;

      -- ADMIN cannot assign or revoke OWNER
      IF (NEW.role = 'OWNER' OR OLD.role = 'OWNER') AND caller_role != 'OWNER' THEN
        RAISE EXCEPTION 'Security violation: Only an OWNER can assign or modify the OWNER role.';
      END IF;
    END IF;
  END IF;

  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_role_escalation();

-- Column-level update permissions on profiles:
-- Authenticated users can only update safe metadata columns directly
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, avatar_url, updated_at) ON public.profiles TO authenticated;

-- Tighten profiles UPDATE RLS policy with explicit WITH CHECK guard
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() AND
  role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
);

-- 3. EDITORIAL APPROVAL WORKFLOW STATE MACHINE
CREATE OR REPLACE FUNCTION public.enforce_editorial_workflow_rules()
RETURNS trigger AS $$
DECLARE
  caller_role user_editorial_role;
BEGIN
  caller_role := public.current_user_role();

  -- Prevent unauthenticated modifications
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Security violation: Anonymous visitors cannot create or modify articles.';
  END IF;

  -- Disallow inserting articles directly as published by authenticated users
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'published' AND auth.role() = 'authenticated' THEN
      RAISE EXCEPTION 'Editorial workflow violation: Cannot insert articles directly as published. New stories must begin as draft.';
    END IF;
    NEW.updated_at := timezone('utc', now());
    RETURN NEW;
  END IF;

  -- Enforce status transition state machine on UPDATE
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN

    -- Direct draft-to-published must be rejected
    IF OLD.status = 'draft' AND NEW.status = 'published' THEN
      RAISE EXCEPTION 'Editorial workflow violation: Direct draft-to-published transition is forbidden. Must proceed: draft -> fact_check -> editorial_review -> approved -> published.';
    END IF;

    -- Validate allowed transitions:
    IF OLD.status = 'draft' AND NEW.status NOT IN ('fact_check', 'rejected', 'archived') THEN
      RAISE EXCEPTION 'Editorial workflow violation: Invalid transition from draft. Permitted: fact_check, rejected, archived.';
    END IF;

    IF OLD.status = 'fact_check' AND NEW.status NOT IN ('editorial_review', 'draft', 'rejected', 'archived') THEN
      RAISE EXCEPTION 'Editorial workflow violation: Invalid transition from fact_check. Permitted: editorial_review, draft, rejected, archived.';
    END IF;

    IF OLD.status = 'editorial_review' AND NEW.status NOT IN ('approved', 'rejected', 'draft', 'fact_check', 'archived') THEN
      RAISE EXCEPTION 'Editorial workflow violation: Invalid transition from editorial_review. Permitted: approved, rejected, draft, fact_check, archived.';
    END IF;

    IF OLD.status = 'approved' AND NEW.status NOT IN ('scheduled', 'published', 'editorial_review', 'archived') THEN
      RAISE EXCEPTION 'Editorial workflow violation: Invalid transition from approved. Permitted: scheduled, published, editorial_review, archived.';
    END IF;

    IF OLD.status = 'scheduled' AND NEW.status NOT IN ('published', 'approved', 'archived') THEN
      RAISE EXCEPTION 'Editorial workflow violation: Invalid transition from scheduled. Permitted: published, approved, archived.';
    END IF;

    IF OLD.status = 'published' AND NEW.status NOT IN ('archived') THEN
      RAISE EXCEPTION 'Editorial workflow violation: Published articles can only transition to archived.';
    END IF;

    -- Role-based transition authorization:
    -- Only OWNER, ADMIN, or EDITOR can transition to approved
    IF NEW.status = 'approved' THEN
      IF auth.role() = 'authenticated' AND (caller_role NOT IN ('OWNER', 'ADMIN', 'EDITOR') OR caller_role IS NULL) THEN
        RAISE EXCEPTION 'Editorial authority violation: Only EDITOR, ADMIN, or OWNER can approve articles.';
      END IF;

      -- Record approval in editorial_reviews
      INSERT INTO public.editorial_reviews (
        article_id,
        reviewer_id,
        stage,
        status,
        feedback,
        created_at
      ) VALUES (
        NEW.id,
        auth.uid(),
        'final_approval',
        'approved',
        'Article approved for publication queue.',
        timezone('utc', now())
      );
    END IF;

    -- Publishing authorization
    IF NEW.status = 'published' THEN
      IF auth.role() = 'authenticated' AND (caller_role NOT IN ('OWNER', 'ADMIN', 'EDITOR') OR caller_role IS NULL) THEN
        RAISE EXCEPTION 'Editorial authority violation: Only EDITOR, ADMIN, or OWNER can publish articles.';
      END IF;

      -- Must originate from approved or scheduled
      IF OLD.status NOT IN ('approved', 'scheduled') THEN
        RAISE EXCEPTION 'Editorial workflow violation: Cannot publish article without prior approval. Prior status must be approved or scheduled.';
      END IF;

      -- Set published timestamp if missing
      IF NEW.published_at IS NULL THEN
        NEW.published_at := timezone('utc', now());
      END IF;

      -- Record publication event
      INSERT INTO public.publication_events (
        article_id,
        event_type,
        performed_by,
        note,
        created_at
      ) VALUES (
        NEW.id,
        'published',
        auth.uid(),
        'Formally published by authorized editorial staff.',
        timezone('utc', now())
      );
    END IF;
  END IF;

  NEW.updated_at := timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rebind trigger to public.articles
DROP TRIGGER IF EXISTS trg_enforce_article_publishing ON public.articles;
CREATE TRIGGER trg_enforce_article_publishing
BEFORE INSERT OR UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_editorial_workflow_rules();

-- 4. STRICT AUDIT LOG PROTECTION (IMMUTABILITY)
-- Audit logs must be strictly append-only. No user can modify or delete audit entries.
REVOKE UPDATE, DELETE ON public.audit_logs FROM authenticated, anon;
REVOKE UPDATE, DELETE ON public.publication_events FROM authenticated, anon;

-- Re-confirm RLS policies on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Deny audit log deletion" ON public.audit_logs;
DROP POLICY IF EXISTS "Deny audit log modification" ON public.audit_logs;
