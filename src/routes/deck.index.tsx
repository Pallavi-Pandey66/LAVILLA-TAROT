import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OracleCard } from "@/components/oracle/OracleCard";
import { PageIntro, Reveal } from "@/components/site/Reveal";
import { DECK, TAROT_DECK } from "@/data/catalog";
import { DeckSelector } from "@/components/oracle/DeckSelector";
import { useAuth } from "@/lib/auth";
import { useFavorites } from "@/lib/journal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deck/")({
  head: () => ({
    meta: [
      { title: "The deck — Lumina Oracle" },
      {
        name: "description",
        content: "Explore 36 Lumina Oracle cards and the complete 78-card tarot deck, including Major Arcana and all four suits.",
      },
      { property: "og:title", content: "The deck — Lumina Oracle" },
      { property: "og:description", content: "Explore the Lumina Oracle and complete 78-card tarot decks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeckPage,
});

function DeckPage() {
  const [deckType, setDeckType] = useState<"oracle" | "tarot">("oracle");
  const deck = deckType === "tarot" ? TAROT_DECK : DECK;
  const themes = Array.from(new Set(deck.map((c) => c.theme)));
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("all");
  const [onlyFav, setOnlyFav] = useState(false);
  const { user } = useAuth();
  const favs = useFavorites();

  const cards = useMemo(() => {
    const term = q.trim().toLowerCase();
    return deck.filter((c) => {
      if (theme !== "all" && c.theme !== theme) return false;
      if (onlyFav && !favs.data?.has(c.id)) return false;
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        c.theme.includes(term) ||
        c.keywords.some((k) => k.toLowerCase().includes(term))
      );
    });
  }, [deck, q, theme, onlyFav, favs.data]);

  return (
    <div className="px-5 pb-10 pt-32 sm:px-8">
      <PageIntro eyebrow={deckType === "tarot" ? "Seventy-eight cards" : "Thirty-six cards"} title="The deck">
        Each card holds a single symbol. Wander through them, or search for what you need.
      </PageIntro>
      <div className="mt-8"><DeckSelector value={deckType} onChange={(value) => { setDeckType(value); setTheme("all"); }} /></div>

      <Reveal className="mx-auto mt-14 flex max-w-3xl flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search the deck</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or keyword"
            className="pl-11"
          />
        </label>
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger
            aria-label="Filter by theme"
            className="h-12 rounded-lg border-input bg-surface/60 px-4 font-light text-champagne sm:w-56"
          >
            <SelectValue placeholder="All themes" />
          </SelectTrigger>
          <SelectContent className="max-h-80 border-hairline bg-surface">
            <SelectItem value="all">All themes</SelectItem>
            {themes.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {user ? (
          <button
            type="button"
            aria-pressed={onlyFav}
            onClick={() => setOnlyFav((v) => !v)}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-lg border px-5 text-[0.72rem] uppercase tracking-[0.2em] transition-colors duration-500",
              onlyFav
                ? "border-gold/60 bg-gold/[0.07] text-gold"
                : "border-input text-muted-foreground hover:text-champagne",
            )}
          >
            <Bookmark className={cn("h-4 w-4", onlyFav && "fill-gold")} />
            Bookmarked
          </button>
        ) : (
          <Link
            to="/auth"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-input px-5 text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-champagne"
          >
            <Bookmark className="h-4 w-4" />
            Bookmarked
          </Link>
        )}
      </Reveal>

      <p className="mt-6 text-center text-xs uppercase tracking-[0.26em] text-muted-foreground/70" aria-live="polite">
        {onlyFav && favs.isLoading ? "Gathering your bookmarks…" : `${cards.length} ${cards.length === 1 ? "card" : "cards"}`}
      </p>

      {onlyFav && favs.isError ? (
        <EmptyState
          title="Bookmarks are out of reach"
          body="We could not load your bookmarks just now. Please try again in a moment."
        />
      ) : cards.length === 0 ? (
        <EmptyState
          title={onlyFav ? "No bookmarks yet" : "Nothing found"}
          body={
            onlyFav
              ? "Open any card and tap the bookmark to keep it close."
              : "Try a different word, or clear the theme filter."
          }
        />
      ) : (
        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {cards.map((c) => (
            <li key={c.id}>
              <Link
                to="/deck/$slug"
                params={{ slug: c.slug }}
                className="group block rounded-[10px] focus-visible:outline-none"
              >
                <div className="relative transition-transform duration-700 ease-[var(--ease-ritual)] group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
                  <div className="absolute -inset-4 glow-violet opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
                  <OracleCard
                    card={c}
                    size="fluid"
                    className="rounded-[10px] transition-shadow duration-700 group-hover:shadow-[var(--glow-gold-soft)] group-focus-visible:shadow-[var(--glow-gold)]"
                  />
                </div>
                <p className="mt-3 text-center text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-champagne">
                  {c.theme}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto mt-16 max-w-sm text-center">
      <div className="mx-auto h-24 w-16 rounded-[6px] border border-dashed border-gold/25" aria-hidden />
      <h2 className="mt-8 text-3xl text-champagne">{title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
