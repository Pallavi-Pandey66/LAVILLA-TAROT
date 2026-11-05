import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Lovable Cloud browser client. Row Level Security protects every table. */
export function getSupabase(): SupabaseClient {
  return supabase as unknown as SupabaseClient;
}
