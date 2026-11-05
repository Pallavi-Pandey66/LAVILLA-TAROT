import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser client for the user's own backend project. Only the publishable key
 * is ever used here; Row Level Security protects every table.
 */
const URL =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ??
  "https://jfxwenzpxhrpacgodrer.supabase.co";
const KEY =
  (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) ??
  "sb_publishable_8RtwvLR-sXi-awodeCTvHg_OyfOoexo";

let client: SupabaseClient | null = null;

/** Lazily created so SSR never touches browser storage. Call only in the browser. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(URL, KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}
