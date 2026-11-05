import { afterEach, describe, expect, it, vi } from "vitest";
import { externalBackend, externalBackendFetch } from "./external-backend";

afterEach(() => vi.unstubAllGlobals());

describe("external backend connection", () => {
  it("targets the supplied API project and isolates its session", () => {
    expect(externalBackend.url).toBe("https://jfxwenzpxhrpacgodrer.supabase.co");
    expect(externalBackend.storageKey).toBe("lumina.external.jfxwenzpxhrpacgodrer.auth");
  });

  it("sends the publishable key as apikey instead of a JWT", async () => {
    const request = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", request);
    await externalBackendFetch(`${externalBackend.url}/rest/v1/cards`, {
      headers: { Authorization: `Bearer ${externalBackend.publishableKey}` },
    });
    const headers = request.mock.calls[0]?.[1].headers as Headers;
    expect(headers.get("apikey")).toBe(externalBackend.publishableKey);
    expect(headers.has("Authorization")).toBe(false);
  });

  it("preserves a real signed-in bearer for owner-scoped reads", async () => {
    const request = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", request);
    await externalBackendFetch(`${externalBackend.url}/rest/v1/profiles`, {
      headers: { Authorization: "Bearer test-user-session" },
    });
    const headers = request.mock.calls[0]?.[1].headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer test-user-session");
  });
});