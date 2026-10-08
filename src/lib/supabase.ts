import { createClient } from "@supabase/supabase-js";

interface CustomImportMeta {
  env?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  };
}

const meta = import.meta as CustomImportMeta;

const supabaseUrl =
  meta.env?.VITE_SUPABASE_URL ||
  "https://sxwvyidbawcontujulhc.supabase.co";

const supabaseAnonKey =
  meta.env?.VITE_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "placeholder-anon-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
