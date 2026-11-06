// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";
import { isAppDocument, isBackendRequest } from "./src/lib/pwa-policy";

export default defineConfig({
  plugins: [VitePWA({
    strategies: "generateSW",
    outDir: "dist/client",
    filename: "sw.js",
    manifest: false,
    injectRegister: null,
    registerType: "autoUpdate",
    devOptions: { enabled: false },
    workbox: {
      navigateFallback: null,
      globPatterns: ["assets/**/*.{js,css,woff,woff2}", "icons/*.png", "manifest.webmanifest", "favicon.ico"],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        { urlPattern: isBackendRequest, handler: "NetworkOnly" },
        {
          urlPattern: isAppDocument,
          handler: "NetworkFirst",
          options: { cacheName: "lumina-documents-v1", cacheableResponse: { statuses: [200] }, expiration: { maxEntries: 100, maxAgeSeconds: 604800 } },
        },
        {
          urlPattern: ({ url, sameOrigin }) => sameOrigin && /^\/assets\/.+-[a-zA-Z0-9_-]{8,}\.(?:js|css|woff2?)$/.test(url.pathname),
          handler: "CacheFirst",
          options: { cacheName: "lumina-assets-v1", cacheableResponse: { statuses: [200] }, expiration: { maxEntries: 200, maxAgeSeconds: 2592000 } },
        },
      ],
    },
  })],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
