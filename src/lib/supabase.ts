import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { externalBackend, externalBackendFetch } from "./external-backend";

let client: SupabaseClient | undefined;

/** External browser client, initialized only from effects or event handlers. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(externalBackend.url, externalBackend.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: externalBackend.storageKey,
        flowType: "implicit",
      },
      global: { fetch: externalBackendFetch },
    });
  }
  return client;
}
