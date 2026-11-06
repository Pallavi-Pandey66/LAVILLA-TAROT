import { shouldDisableAppWorker } from "./pwa-policy";

/** Only registrar for the app-shell worker. Messaging workers are untouched. */
export async function registerAppWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const disabled = shouldDisableAppWorker(import.meta.env.PROD, window.location.hostname, window.self !== window.top, window.location.search);
  if (disabled) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter((registration) =>
      [registration.active, registration.waiting, registration.installing].some((worker) => worker && new URL(worker.scriptURL).origin === window.location.origin && new URL(worker.scriptURL).pathname === "/sw.js")
    ).map((registration) => registration.unregister()));
    return;
  }
  await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
  await navigator.serviceWorker.ready;
  // clientsClaim makes the current tab controlled, including its first visit.
  if (!navigator.serviceWorker.controller) {
    await new Promise<void>((resolve) => {
      const finish = () => { navigator.serviceWorker.removeEventListener("controllerchange", finish); resolve(); };
      navigator.serviceWorker.addEventListener("controllerchange", finish, { once: true });
      if (navigator.serviceWorker.controller) finish();
    });
  }
  // Warm the public SSR home document through NetworkFirst, never precache HTML.
  await fetch("/", { credentials: "omit" });
}