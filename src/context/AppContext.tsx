import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { AdminItem, Article, ArticleStatus, UserEditorialRole, UserProfile } from "../types";
import { initialAdminItems } from "../data/admin";
import { publishedArticles } from "../data/articles";
import { articleRepository, mapDbToArticle } from "../services/database/supabase";

interface AppContextValue {
  newsletterJoined: boolean;
  subscribe: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  // Auth state
  user: User | null;
  profile: UserProfile | null;
  role: UserEditorialRole | null;
  authLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  // Editorial Admin items
  adminItems: AdminItem[];
  updateAdminStatus: (id: string, status: ArticleStatus) => Promise<void>;
  assignAdmin: (id: string, assignee: string) => void;
  // CMS Articles
  liveArticles: Article[];
  refreshData: () => Promise<void>;
  createArticle: (draft: Partial<Article>) => Promise<Article>;
  updateArticle: (id: string, updates: Partial<Article>) => Promise<Article>;
  deleteArticle: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [newsletterJoined, setNewsletterJoined] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminItems, setAdminItems] = useState<AdminItem[]>(initialAdminItems);
  const [liveArticles, setLiveArticles] = useState<Article[]>(publishedArticles);

  // 1. Listen for Supabase Auth state changes
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!mounted) return;

        if (sessionData?.session?.user) {
          const currentUser = sessionData.session.user;
          setUser(currentUser);
          await fetchProfile(currentUser.id, currentUser.email || "");
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (mounted) setAuthLoading(false);
      }
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
        setProfile(null);
      }
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string, email: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          role: data.role as UserEditorialRole,
        });
      } else {
        // Default to RESEARCHER if no profile found
        setProfile({
          id: userId,
          email,
          full_name: email.split("@")[0],
          role: "RESEARCHER",
        });
      }
    } catch {
      setProfile({
        id: userId,
        email,
        full_name: email.split("@")[0],
        role: "RESEARCHER",
      });
    }
  }

  // 2. Fetch live articles & candidates from Supabase
  const refreshData = async () => {
    try {
      // Query published articles (and drafts if authenticated staff)
      const { data: artRows, error: artErr } = await supabase
        .from("articles")
        .select("*, categories(slug, name, kicker), authors(slug, name, role)")
        .order("published_at", { ascending: false });

      if (!artErr && artRows && artRows.length > 0) {
        setLiveArticles(artRows.map(mapDbToArticle));
      }

      // Query story candidates for admin queue
      const { data: candRows, error: candErr } = await supabase
        .from("story_candidates")
        .select("*")
        .order("discovered_at", { ascending: false });

      if (!candErr && candRows && candRows.length > 0) {
        const mappedItems: AdminItem[] = candRows.map((c) => ({
          id: c.id,
          headline: c.title,
          source: c.source,
          category: (c.raw_data?.category || "ai") as any,
          status: (c.status === "discovered" ? "discovered" : "researching") as ArticleStatus,
          assignee: c.raw_data?.assignee || "Unassigned",
          discoveredAt: c.discovered_at || c.created_at,
          updatedAt: c.created_at,
          notes: c.raw_data?.notes || "",
          score: Math.round(Number(c.relevance_score || 0.8) * 100),
        }));

        setAdminItems(mappedItems);
      }
    } catch {
      // Resilient local fallback maintains full UI continuity
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  // Auth Actions
  const signIn = async (email: string, pass: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) return { error: new Error(error.message) };
      await refreshData();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch {
      // ignore
    }
  };

  // Status transitions
  const updateAdminStatus = async (id: string, status: ArticleStatus) => {
    // 1. Optimistic update
    setAdminItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      ),
    );

    // 2. Persist to Supabase if authenticated
    try {
      await supabase
        .from("story_candidates")
        .update({
          status: status === "discovered" ? "discovered" : "evaluating",
        })
        .eq("id", id);
    } catch {
      // ignore
    }
  };

  const assignAdmin = (id: string, assignee: string) => {
    setAdminItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, assignee, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  };

  const createArticle = async (draft: Partial<Article>) => {
    const created = await articleRepository.create(draft);
    await refreshData();
    return created;
  };

  const updateArticle = async (id: string, updates: Partial<Article>) => {
    const updated = await articleRepository.update(id, updates);
    await refreshData();
    return updated;
  };

  const deleteArticle = async (id: string) => {
    const ok = await articleRepository.delete(id);
    await refreshData();
    return ok;
  };

  const value = useMemo<AppContextValue>(
    () => ({
      newsletterJoined,
      subscribe: () => setNewsletterJoined(true),
      searchQuery,
      setSearchQuery,
      user,
      profile,
      role: profile?.role ?? null,
      authLoading,
      signIn,
      signOut,
      adminItems,
      updateAdminStatus,
      assignAdmin,
      liveArticles,
      refreshData,
      createArticle,
      updateArticle,
      deleteArticle,
    }),
    [newsletterJoined, searchQuery, user, profile, authLoading, adminItems, liveArticles],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
