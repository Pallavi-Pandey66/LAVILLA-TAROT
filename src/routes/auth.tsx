import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/site/Logo";
import { Reveal } from "@/components/site/Reveal";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

type Search = { redirect?: string | undefined };

const safePath = (p?: string) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/journal");

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Lumina Oracle" },
      { name: "description", content: "Sign in to save your readings and keep a personal oracle journal." },
      { property: "og:title", content: "Sign in — Lumina Oracle" },
      { property: "og:description", content: "Save readings and keep a personal journal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20 12.2c0-.6-.1-1.2-.2-1.7H12v3.3h4.5a3.9 3.9 0 0 1-1.7 2.5v2h2.7c1.6-1.4 2.5-3.6 2.5-6.1Z" />
      <path d="M12 20.5c2.3 0 4.2-.8 5.5-2.1l-2.7-2a5 5 0 0 1-7.5-2.7H4.5v2.1A8.5 8.5 0 0 0 12 20.5Z" />
      <path d="M7.3 13.7a5 5 0 0 1 0-3.4V8.2H4.5a8.5 8.5 0 0 0 0 7.6l2.8-2.1Z" />
      <path d="M12 6.9c1.3 0 2.4.4 3.3 1.3l2.4-2.4A8.5 8.5 0 0 0 4.5 8.2l2.8 2.1A5 5 0 0 1 12 6.9Z" />
    </svg>
  );
}

function AuthPage() {
  const { redirect } = Route.useSearch();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      const stored = window.localStorage.getItem("lumina.auth.redirect") ?? undefined;
      window.localStorage.removeItem("lumina.auth.redirect");
      navigate({ to: safePath(redirect ?? stored), replace: true });
    }
  }, [user, loading, redirect, navigate]);

  // Surface errors returned in the link (expired or already-used link).
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
    const desc = params.get("error_description");
    if (desc) {
      setError(`Sign-in link problem: ${desc.replace(/\+/g, " ")}. Please request a new link.`);
    }
  }, []);

  // A plain /auth return address is easiest to allow in the backend's redirect list.
  const returnUrl = () => {
    window.localStorage.setItem("lumina.auth.redirect", safePath(redirect));
    return `${window.location.origin}/auth`;
  };

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const { error } = await getSupabase().auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: returnUrl(),
        data: { display_name: displayName.trim() },
      },
    });
    if (error) {
      setStatus("error");
      setError(
        error.status === 429 || /rate limit/i.test(error.message)
          ? "Too many sign-in emails were sent recently. Please wait about an hour and try again."
          : `We could not send your link: ${error.message}`,
      );
    } else {
      setStatus("sent");
    }
  };

  const google = async () => {
    setError(null);
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: returnUrl() },
    });
    if (error) {
      setError(
        /not enabled|unsupported provider/i.test(error.message)
          ? "Google sign-in hasn't been turned on for this app yet. Please use your email instead."
          : `Google sign-in failed: ${error.message}`,
      );
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-5 pb-10 pt-32">
      <Reveal className="relative w-full max-w-md">
        <div className="absolute -inset-16 glow-violet opacity-60" aria-hidden />
        <div className="surface-panel relative px-8 py-12 text-center sm:px-12">
          <span className="inline-block text-gold">
            <LogoMark className="h-10 w-10" />
          </span>
          {status === "sent" ? (
            <div aria-live="polite">
              <h1 className="mt-6 text-4xl text-champagne">Check your inbox</h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                We sent a sign-in link to <span className="text-champagne">{email}</span>. Open it on
                this device to continue.
              </p>
              <Button variant="ghost" className="mt-8" onClick={() => setStatus("idle")}>
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <h1 className="mt-6 text-4xl text-champagne">Welcome</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sign in to save readings and keep your journal. No password needed.
              </p>
              <form onSubmit={sendLink} className="mt-10 space-y-3 text-left">
                <label htmlFor="display-name" className="eyebrow block text-[0.62rem]">
                  Display name (optional)
                </label>
                <Input id="display-name" autoComplete="nickname" value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" />
                <label htmlFor="email" className="eyebrow block text-[0.62rem]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Button type="submit" className="w-full" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send magic link"}
                </Button>
              </form>
              <div className="my-8 flex items-center gap-4" aria-hidden>
                <span className="hairline-rule flex-1" />
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">or</span>
                <span className="hairline-rule flex-1" />
              </div>
              <Button type="button" variant="ritual" className="w-full" onClick={google}>
                <GoogleMark /> Continue with Google
              </Button>
              {error && (
                <p role="alert" className="mt-6 text-sm text-destructive">
                  {error}
                </p>
              )}
            </>
          )}
          <p className="mt-10 text-xs text-muted-foreground/70">
            Prefer to stay a guest?{" "}
            <Link to="/draw" className="text-gold underline-offset-4 hover:underline">
              Draw without signing in
            </Link>
          </p>
        </div>
      </Reveal>
    </div>
  );
}
