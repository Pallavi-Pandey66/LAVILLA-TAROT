// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, cp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { generateSW } from "workbox-build";

const { capture } = vi.hoisted(() => ({ capture: vi.fn() }));
vi.mock("@lovable.dev/vite-tanstack-config", () => ({ defineConfig: (config: unknown) => config }));
vi.mock("vite-plugin-pwa", () => ({ VitePWA: capture }));
import "../../vite.config";

describe("Lumina generated PWA", () => {
  it("uses the exact installable manifest and locally generated PNG dimensions", async () => {
    const manifest = JSON.parse(await readFile("public/manifest.webmanifest", "utf8"));
    expect(manifest).toMatchObject({ name: "Lumina", short_name: "Lumina", display: "standalone", theme_color: "#07070D", background_color: "#07070D" });
    expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual(["192x192", "512x512"]);
    for (const size of [192, 512]) {
      const png = await readFile(`public/icons/lumina-${size}.png`);
      expect(png.readUInt32BE(16)).toBe(size);
      expect(png.readUInt32BE(20)).toBe(size);
    }
  });
  it("generates a valid Workbox worker with network-first shell and network-only backend", async () => {
    const options = capture.mock.calls[0]?.[0];
    expect(options.strategies).toBe("generateSW");
    expect(options.injectRegister).toBeNull();
    expect(options.devOptions.enabled).toBe(false);
    expect(options.workbox.navigateFallback).toBeNull();
    expect(options.workbox.runtimeCaching.map((rule: { handler: string }) => rule.handler)).toEqual(["NetworkOnly", "NetworkFirst", "CacheFirst"]);
    const directory = await mkdtemp(join(tmpdir(), "lumina-workbox-"));
    try {
      await cp("public", directory, { recursive: true });
      const result = await generateSW({ ...options.workbox, mode: "production", globDirectory: directory, swDest: join(directory, "sw.js") });
      expect(result.count).toBeGreaterThanOrEqual(4);
      const worker = await readFile(join(directory, "sw.js"), "utf8");
      expect(worker).toContain("NetworkOnly");
      expect(worker).toContain("NetworkFirst");
      expect(worker).toContain("lumina-512.png");
      // Keep a temporary generated copy for a browser-level offline check.
      await cp(directory, "/tmp/browser/lumina-pwa/generated", { recursive: true });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});