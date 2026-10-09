import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://sxwvyidbawcontujulhc.supabase.co";

const publicAnonKeyFallback =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4d3Z5aWRiYXdjb250dWp1bGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0OTI0NzMsImV4cCI6MjEwNzA2ODQ3M30.vYUaYp_-0inEn5VAcoLMGYcj2b8OBZwDInJcmYwsaLQ";

const supabaseAnonKey =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  publicAnonKeyFallback;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseAnonKey !== "placeholder-anon-key"
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
