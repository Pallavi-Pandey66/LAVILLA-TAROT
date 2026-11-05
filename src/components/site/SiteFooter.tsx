import { Link } from "@tanstack/react-router";
import { LogoMark } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-14 text-center">
        <span className="text-gold">
          <LogoMark className="h-8 w-8" />
        </span>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {(
            [
              ["/draw", "Draw"],
              ["/daily", "Daily card"],
              ["/deck", "The deck"],
              ["/journal", "Journal"],
            ] as const
          ).map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="text-[0.7rem] uppercase tracking-[0.26em] text-muted-foreground transition-colors hover:text-champagne"
            >
              {label}
            </Link>
          ))}
        </nav>
        <p className="font-display text-lg italic text-muted-foreground">
          For reflection and inspiration.
        </p>
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/60">
          Lumina Oracle · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
