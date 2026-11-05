import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardReading } from "@/components/oracle/CardReading";
import { OracleCard } from "@/components/oracle/OracleCard";
import { Reveal } from "@/components/site/Reveal";
import { DECK, TAROT_DECK, CARDS_BY_SLUG } from "@/data/catalog";
import { useAuth } from "@/lib/auth";
import { useFavorites, useToggleFavorite } from "@/lib/journal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/deck/$slug")({
  loader: ({ params }) => {
    const card = CARDS_BY_SLUG[params.slug];
    if (!card) throw notFound();
    return { card };
  },
  head: ({ loaderData }) => {
    const card = loaderData?.card;
    if (!card) return { meta: [{ title: "Card not found — Lumina Oracle" }, { name: "robots", content: "noindex" }] };
    const title = `${card.name} — Lumina Oracle`;
    return {
      meta: [
        { title },
        { name: "description", content: card.message || `${card.name}: ${card.motif}.` },
        { property: "og:title", content: title },
        { property: "og:description", content: card.message || `${card.name}: ${card.motif}.` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CardDetail,
});

function BookmarkToggle({ cardId }: { cardId: string }) {
  const { user, loading } = useAuth();
  const favs = useFavorites();
  const toggle = useToggleFavorite();
  if (loading) return <div className="h-11 w-36 skeleton-shimmer rounded-lg" aria-hidden />;
  if (!user) {
    return (
      <Button asChild variant="ghost">
        <Link to="/auth">
          <Bookmark /> Sign in to bookmark
        </Link>
      </Button>
    );
  }
  const on = favs.data?.has(cardId) ?? false;
  return (
    <Button
      variant="ritual"
      aria-pressed={on}
      disabled={favs.isLoading}
      onClick={() => toggle.mutate({ cardId, on: !on })}
    >
      <Bookmark className={cn(on && "fill-gold text-gold")} />
      {on ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}

function CardDetail() {
  const { card } = Route.useLoaderData();
  const deck = card.deck === "tarot" ? TAROT_DECK : DECK;
  const idx = deck.findIndex((c) => c.id === card.id);
  const prev = deck[(idx - 1 + deck.length) % deck.length];
  const next = deck[(idx + 1) % deck.length];
  if (!prev || !next) return null;

  return (
    <div className="px-5 pb-10 pt-32 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/deck"
          className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.26em] text-muted-foreground transition-colors hover:text-champagne"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> The deck
        </Link>

        <div key={card.id} className="mt-12 grid items-center gap-14 md:grid-cols-[auto_1fr] md:gap-20">
          <Reveal className="relative mx-auto">
            <div className="absolute -inset-14 glow-violet" aria-hidden />
            <OracleCard card={card} size="xl" className="relative rounded-[10px] shadow-[var(--glow-gold-soft)]" />
          </Reveal>
          <Reveal delay={0.15}>
            <CardReading card={card} headingLevel="h1" label={card.theme} className="text-center md:text-left [&_.eyebrow]:capitalize" />
            <p className="mt-8 text-center text-xs text-muted-foreground/70 md:text-left">
              Symbol · {card.motif}
            </p>
            <div className="mt-10 flex justify-center md:justify-start">
              <BookmarkToggle cardId={card.id} />
            </div>
          </Reveal>
        </div>

        <nav aria-label="Card navigation" className="mt-24 grid grid-cols-2 gap-4 border-t border-hairline pt-10">
          <Link
            to="/deck/$slug"
            params={{ slug: prev.slug }}
            className="group flex items-center gap-4 rounded-lg p-2"
          >
            <ArrowLeft className="h-4 w-4 text-gold transition-transform duration-500 group-hover:-translate-x-1" />
            <span>
              <span className="block text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground">Previous</span>
              <span className="mt-1 block font-display text-xl text-champagne sm:text-2xl">{prev.name}</span>
            </span>
          </Link>
          <Link
            to="/deck/$slug"
            params={{ slug: next.slug }}
            className="group flex items-center justify-end gap-4 rounded-lg p-2 text-right"
          >
            <span>
              <span className="block text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground">Next</span>
              <span className="mt-1 block font-display text-xl text-champagne sm:text-2xl">{next.name}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-gold transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
