import { Link, useNavigate } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { LogoMark, Wordmark } from "./Logo";

const NAV = [
  { to: "/draw", label: "Draw" },
  { to: "/daily", label: "Daily" },
  { to: "/deck", label: "Deck" },
  { to: "/journal", label: "Journal" },
] as const;

const linkClass =
  "text-[0.75rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-500 hover:text-champagne data-[status=active]:text-gold";

function ProfileButton() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  if (loading) return <div className="h-9 w-24 skeleton-shimmer rounded-lg" aria-hidden />;
  if (!user) {
    return (
      <Button asChild variant="ritual" size="sm">
        <Link to="/auth">Sign in</Link>
      </Button>
    );
  }
  const initial = (user.email ?? "L").charAt(0).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 font-display text-lg text-champagne transition-colors hover:border-gold"
        aria-label="Account menu"
      >
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52 border-hairline bg-surface">
        <DropdownMenuLabel className="truncate font-light text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate({ to: "/journal" })}>Journal</DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="Lumina Oracle, home" className="rounded-md">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={linkClass}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <ProfileButton />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[82%] border-l border-hairline bg-ink p-8">
            <SheetTitle className="flex items-center gap-3 font-display text-lg font-normal tracking-[0.2em] text-champagne">
              <span className="text-gold">
                <LogoMark />
              </span>
              LUMINA
            </SheetTitle>
            <nav aria-label="Mobile" className="mt-14 flex flex-col gap-7">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl text-champagne/80 transition-colors hover:text-champagne data-[status=active]:text-gold"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="hairline-rule mt-12" />
            <div className="mt-8" onClick={() => setOpen(false)}>
              <ProfileButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
