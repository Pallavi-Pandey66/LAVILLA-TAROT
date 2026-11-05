/** Public browser configuration; never add a service-role key here. */
export const externalBackend = {
  url: "https://jfxwenzpxhrpacgodrer.supabase.co",
  publishableKey: "sb_publishable_8RtwvLR-sXi-awodeCTvHg_OyfOoexo",
  storageKey: "lumina.external.jfxwenzpxhrpacgodrer.auth",
} as const;

/** Opaque publishable keys belong in apikey, not a JWT Authorization header. */
export const externalBackendFetch: typeof fetch = (input, init) => {
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers).forEach((value, name) => headers.set(name, value));
  if (headers.get("Authorization") === `Bearer ${externalBackend.publishableKey}`) {
    headers.delete("Authorization");
  }
  headers.set("apikey", externalBackend.publishableKey);
  return fetch(input, { ...init, headers });
};