import { describe, expect, it } from "vitest";
import { isAppDocument, isBackendRequest, shouldDisableAppWorker } from "./pwa-policy";

describe("Lumina offline policy", () => {
  it("disables workers in development, frames and all Lovable preview hosts", () => {
    expect(shouldDisableAppWorker(false, "localhost", false, "")).toBe(true);
    expect(shouldDisableAppWorker(true, "lumina.example", true, "")).toBe(true);
    for (const host of ["id-preview--abc.lovable.app", "preview-v2--abc.gpt-eng.com", "project--abc-dev.gptengineer.run", "abc.lovableproject.com", "beta.lovable.dev", "abc.lovableproject-dev.com"]) {
      expect(shouldDisableAppWorker(true, host, false, "")).toBe(true);
    }
    expect(shouldDisableAppWorker(true, "archive-to-canvas-99.lovable.app", false, "")).toBe(false);
    expect(shouldDisableAppWorker(true, "preview-v2--shop.example.com", false, "")).toBe(false);
    expect(shouldDisableAppWorker(true, "lumina.example", false, "?sw=off")).toBe(true);
  });
  it("always routes external backend requests to the network", () => {
    for (const path of ["/auth/v1/token", "/rest/v1/profiles", "/storage/v1/object/cards", "/realtime/v1/websocket", "/functions/v1/example"]) {
      expect(isBackendRequest({ url: new URL(path, "https://jfxwenzpxhrpacgodrer.supabase.co") })).toBe(true);
    }
    expect(isBackendRequest({ url: new URL("https://custom.example/rest/v1/cards") })).toBe(true);
    expect(isBackendRequest({ url: new URL("https://lumina.example/assets/app-123.js") })).toBe(false);
  });
  it("caches the public shell but excludes callbacks and cross-origin documents", () => {
    const request = { mode: "navigate", method: "GET" } as Request;
    expect(isAppDocument({ request, url: new URL("https://lumina.example/"), sameOrigin: true })).toBe(true);
    for (const path of ["/auth", "/~oauth", "/api/private", "/?code=secret"]) {
      expect(isAppDocument({ request, url: new URL(path, "https://lumina.example"), sameOrigin: true })).toBe(false);
    }
    expect(isAppDocument({ request, url: new URL("https://external.example/"), sameOrigin: false })).toBe(false);
  });
});