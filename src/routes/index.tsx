import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardBack } from "@/components/oracle/CardBack";
import { OracleCard } from "@/components/oracle/OracleCard";
import { Reveal } from "@/components/site/Reveal";
import { useDailyCard } from "@/lib/daily";
import { toRoman } from "@/lib/oracle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumina Oracle — A quiet ritual of reflection" },
      {
        name: "description",
        content:
          "Draw an oracle card, receive a gentle message and a question to sit with. A calm ritual for reflection and inspiration.",
      },
      { property: "og:title", content: "Lumina Oracle — A quiet ritual of reflection" },
      {
        property: "og:description",
        content: "Draw an oracle card and receive a gentle message for reflection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function BreatheIcon() {
  return (
    <svg viewBox="0 0 48 48" className="card-art h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
      <circle cx="24" cy="24" r="20" opacity={0.3} />
      <circle cx="24" cy="24" r="13" opacity={0.6} />
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="24" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function ChooseIcon() {
  return (
    <svg viewBox="0 0 48 48" className="card-art h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
      <rect x="10" y="12" width="14" height="22" rx="2" transform="rotate(-14 17 23)" opacity={0.45} />
      <rect x="24" y="12" width="14" height="22" rx="2" transform="rotate(14 31 23)" opacity={0.45} />
      <rect x="17" y="10" width="14" height="22" rx="2" />
      <circle cx="24" cy="21" r="3" />
    </svg>
  );
}
function ReflectIcon() {
  return (
    <svg viewBox="0 0 48 48" className="card-art h-12 w-12" fill="none" stroke="currentColor" strokeWidth={1.25} aria-hidden>
      <path d="M8 26 Q24 12 40 26 Q24 40 8 26 Z" />
      <circle cx="24" cy="26" r="4" />
      <path d="M24 6 V10 M14 9 L16 12.5 M34 9 L32 12.5" opacity={0.6} />
    </svg>
  );
}

const STEPS = [
  { n: 1, title: "Breathe", body: "Pause for a moment. Let your shoulders soften and your thoughts slow.", Icon: BreatheIcon },
  { n: 2, title: "Choose", body: "Hold a question lightly, then let your hand find the card that calls to you.", Icon: ChooseIcon },
  { n: 3, title: "Reflect", body: "Read the message and sit with its question. Keep what resonates.", Icon: ReflectIcon },
];

function Home() {
  const reduce = useReducedMotion();
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center px-6 pt-24 pb-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 md:grid-cols-[1.1fr_1fr]">
          <div className="order-2 text-center md:order-1 md:text-left">
            <motion.p
              className="eyebrow"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Thirty-six cards · One quiet moment
            </motion.p>
            <motion.h1
              className="mt-6 text-5xl leading-[1.05] text-champagne sm:text-6xl lg:text-7xl"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              Still the mind.
              <br />
              <span className="italic text-gold">Let a card speak.</span>
            </motion.h1>
            <motion.p
              className="mx-auto mt-7 max-w-md text-base leading-relaxed text-muted-foreground md:mx-0"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.4 }}
            >
              A gentle ritual of symbols and questions, made for the in-between moments of your day.
            </motion.p>
            <motion.div
              className="mt-11"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button asChild size="lg">
                <Link to="/draw">Draw a card</Link>
              </Button>
            </motion.div>
          </div>
          <div className="order-1 flex justify-center md:order-2">
            <div className="relative">
              <div className="absolute -inset-20 glow-violet" aria-hidden />
              <motion.div
                className="relative w-52 animate-float sm:w-64 lg:w-72"
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aspect-[2/3] rounded-[10px] shadow-[var(--glow-gold-soft)]">
                  <CardBack />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how" className="px-6 py-24">
        <Reveal className="text-center">
          <p className="eyebrow">The ritual</p>
          <h2 id="how" className="mt-4 text-4xl text-champagne sm:text-5xl">
            How it works
          </h2>
        </Reveal>
        <ol className="mx-auto mt-20 grid max-w-5xl gap-14 sm:grid-cols-3 sm:gap-10">
          {STEPS.map(({ n, title, body, Icon }, i) => (
            <Reveal as="li" key={n} delay={i * 0.15} className="flex flex-col items-center text-center">
              <span className="text-gold">
                <Icon />
              </span>
              <span className="mt-6 font-display text-sm tracking-[0.3em] text-gold/80">
                {toRoman(n)}
              </span>
              <h3 className="mt-2 text-3xl text-champagne">{title}</h3>
              <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      <TodayTeaser />
    </>
  );
}

function TodayTeaser() {
  const { card } = useDailyCard();
  return (
    <section aria-labelledby="today" className="px-6 py-24">
      <Reveal className="surface-panel mx-auto grid max-w-4xl items-center gap-12 p-10 sm:p-14 md:grid-cols-[auto_1fr]">
        <div className="relative mx-auto">
          <div className="absolute -inset-10 glow-violet" aria-hidden />
          <OracleCard card={card ?? undefined} faceUp={!!card} size="md" className="relative" />
        </div>
        <div className="text-center md:text-left">
          <p id="today" className="eyebrow">Today's card</p>
          {card ? (
            <>
              <h2 className="mt-4 text-4xl text-champagne sm:text-5xl">
                {card.name}
              </h2>
              <p className="mt-3 text-[0.7rem] uppercase tracking-[0.26em] text-muted-foreground">
                {card.keywords.join(" · ")}
              </p>
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                {card.message.split(". ")[0]}.
              </p>
            </>
          ) : (
            <div className="mt-4 space-y-4" aria-hidden>
              <div className="h-10 w-56 skeleton-shimmer rounded-lg" />
              <div className="h-4 w-40 skeleton-shimmer rounded-lg" />
              <div className="h-16 w-full max-w-md skeleton-shimmer rounded-lg" />
            </div>
          )}
          <Button asChild variant="ritual" className="mt-9">
            <Link to="/daily">Read the full message</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
