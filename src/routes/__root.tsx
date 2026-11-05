import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { usePendingReadingSync } from "@/lib/journal";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Starfield } from "@/components/site/Starfield";
import { CardBack } from "@/components/oracle/CardBack";

function NotFoundComponent() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <div className="relative w-32 opacity-70 -rotate-6">
        <div className="absolute -inset-10 glow-violet" aria-hidden />
        <div className="relative aspect-[2/3]">
          <CardBack />
        </div>
      </div>
      <p className="eyebrow mt-12">Error · CDIV</p>
      <h1 className="mt-4 text-4xl text-champagne sm:text-5xl">This path is unwritten</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you were looking for has drifted beyond the edge of the deck.
      </p>
      <Button asChild variant="ritual" className="mt-10">
        <Link to="/">Return home</Link>
      </Button>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="eyebrow">A quiet interruption</p>
      <h1 className="mt-4 text-4xl text-champagne">This page did not load</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Something went wrong on our side. You can try again or return home.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
        <Button asChild variant="outline">
          <a href="/">Return home</a>
        </Button>
      </div>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#07070D" },
      { title: "Lumina Oracle" },
      { name: "description", content: "A calm oracle card ritual for reflection and inspiration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Jost:wght@300;400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PendingSync() {
  usePendingReadingSync();
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PendingSync />
        <Starfield />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-champagne"
        >
          Skip to content
        </a>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
