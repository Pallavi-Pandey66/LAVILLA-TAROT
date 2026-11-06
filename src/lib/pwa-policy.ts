/** Pure policy shared by the browser registrar and focused regression tests. */
export function shouldDisableAppWorker(production: boolean, hostname: string, framed: boolean, search: string): boolean {
  const host = hostname.toLowerCase();
  const lovableDomain = /\.(lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(host);
  const firstLabel = host.split(".")[0] ?? "";
  return !production || framed || new URLSearchParams(search).get("sw") === "off" ||
    (lovableDomain && (/^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/.test(firstLabel) || /^project--.+-dev$/.test(firstLabel))) ||
    /(^|\.)(lovableproject\.com|lovableproject-dev\.com|beta\.lovable\.dev)$/.test(host);
}

/** This callback is serialized by Workbox; keep it self-contained. */
export function isBackendRequest({ url }: { url: URL }): boolean {
  return /(^|\.)supabase\.(co|in)$/.test(url.hostname) || /^\/api\//.test(url.pathname) ||
    /^\/(auth|rest|storage|realtime|functions)\/v1(?:\/|$)/.test(url.pathname);
}

/** Cache only documents without authentication callback material. */
export function isAppDocument({ request, url, sameOrigin }: { request: Request; url: URL; sameOrigin: boolean }): boolean {
  return sameOrigin && !/^\/(?:api|~oauth|auth)(?:\/|$)/.test(url.pathname) &&
    !["code", "token", "token_hash", "access_token", "error"].some((key) => url.searchParams.has(key)) &&
    (request.mode === "navigate" || (url.pathname === "/" && request.method === "GET"));
}