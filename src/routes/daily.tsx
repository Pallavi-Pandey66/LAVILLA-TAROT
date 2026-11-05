import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardReading } from "@/components/oracle/CardReading";
import { FlipCard } from "@/components/oracle/FlipCard";
import { OracleCard } from "@/components/oracle/OracleCard";
import { PageIntro } from "@/components/site/Reveal";
import { useAuth } from "@/lib/auth";
import { useDailyCard } from "@/lib/daily";

export const Route = createFileRoute("/daily")({
  head: () => ({
    meta: [
      { title: "Today's card — Lumina Oracle" },
      {
        name: "description",
        content:
          "Your oracle card for today. One card for the whole day, renewed at your local midnight.",
      },
      { property: "og:title", content: "Today's card — Lumina Oracle" },
      { property: "og:description", content: "One gentle card to carry with you through the day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DailyPage,
});

function DailyPage() {
  const { card, dateKey } = useDailyCard();
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!card) return;
    const t = setTimeout(() => setRevealed(true), reduce ? 0 : 700);
    return () => clearTimeout(t);
  }, [card, reduce]);

  const dateLabel = dateKey
    ? new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="px-5 pb-10 pt-32 sm:px-8">
      <PageIntro eyebrow={dateLabel ?? "Today"} title="Today's card">
        One card for the whole day. Return tomorrow for a new one.
      </PageIntro>

      <div className="mx-auto mt-20 grid max-w-5xl items-center gap-14 md:grid-cols-[auto_1fr] md:gap-20">
        <div className="relative mx-auto">
          {card ? (
            <FlipCard card={card} revealed={revealed} size="lg" />
          ) : (
            <OracleCard faceUp={false} size="lg" className="opacity-60" />
          )}
        </div>
        <div className="min-h-[22rem]">
          <AnimatePresence mode="wait">
            {card && revealed ? (
              <motion.div
                key="reading"
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <CardReading card={card} className="text-center md:text-left" />
                <div className="mt-12 flex flex-wrap justify-center gap-3 md:justify-start">
                  <Button asChild variant="ritual">
                    <Link to="/deck/$slug" params={{ slug: card.slug }}>
                      About this card
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/draw">Draw another</Link>
                  </Button>
                </div>
                {!user && (
                  <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground/80 md:text-left">
                    Your daily card is kept on this device.{" "}
                    <Link to="/auth" className="text-gold underline-offset-4 hover:underline">
                      Sign in
                    </Link>{" "}
                    to carry it across devices.
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div key="skeleton" exit={{ opacity: 0 }} className="space-y-5" aria-hidden>
                <div className="h-3 w-24 skeleton-shimmer rounded" />
                <div className="h-12 w-64 skeleton-shimmer rounded-lg" />
                <div className="h-3 w-48 skeleton-shimmer rounded" />
                <div className="h-24 w-full skeleton-shimmer rounded-lg" />
                <div className="h-8 w-3/4 skeleton-shimmer rounded-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
