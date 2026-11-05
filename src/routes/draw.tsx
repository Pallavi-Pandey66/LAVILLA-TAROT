import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardBack } from "@/components/oracle/CardBack";
import { CardReading } from "@/components/oracle/CardReading";
import { FlipCard } from "@/components/oracle/FlipCard";
import { PageIntro } from "@/components/site/Reveal";
import { DECK, type OracleCardData } from "@/data/deck";
import { useAuth } from "@/lib/auth";
import { stashPendingReading, useSaveReading } from "@/lib/journal";
import { SPREADS, shuffle, toRoman, type SpreadType } from "@/lib/oracle";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/draw")({
  head: () => ({
    meta: [
      { title: "Draw a card — Lumina Oracle" },
      {
        name: "description",
        content:
          "Choose a single card or a Past, Present, Future spread, set an intention and draw from the Lumina Oracle deck.",
      },
      { property: "og:title", content: "Draw a card — Lumina Oracle" },
      {
        property: "og:description",
        content: "A calm, guided card draw with a message and a question to reflect on.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DrawPage,
});

type Step = "spread" | "intention" | "choose" | "reveal";
const STEP_ORDER: Step[] = ["spread", "intention", "choose", "reveal"];
const STEP_LABEL: Record<Step, string> = {
  spread: "Spread",
  intention: "Intention",
  choose: "Choose",
  reveal: "Reveal",
};
const EASE = [0.22, 1, 0.36, 1] as const;
const FAN_SIZE = 13;

function StepMarks({ step }: { step: Step }) {
  const idx = STEP_ORDER.indexOf(step);
  return (
    <ol className="mx-auto flex max-w-md items-center justify-center gap-3" aria-label="Progress">
      {STEP_ORDER.map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          <span
            className={cn(
              "font-display text-sm tracking-[0.2em] transition-colors duration-700",
              i <= idx ? "text-gold" : "text-muted-foreground/50",
            )}
            aria-current={i === idx ? "step" : undefined}
          >
            {toRoman(i + 1)}
            <span className="sr-only"> {STEP_LABEL[s]}</span>
          </span>
          {i < STEP_ORDER.length - 1 && (
            <span
              className={cn(
                "h-px w-8 transition-colors duration-700 sm:w-12",
                i < idx ? "bg-gold/50" : "bg-hairline",
              )}
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function DrawPage() {
  const [step, setStep] = useState<Step>("spread");
  const [spread, setSpread] = useState<SpreadType>("single");
  const [intention, setIntention] = useState("");
  const [drawn, setDrawn] = useState<OracleCardData[]>([]);
  const [round, setRound] = useState(0);

  const reset = () => {
    setStep("spread");
    setDrawn([]);
    setIntention("");
    setRound((r) => r + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="px-5 pb-10 pt-32 sm:px-8">
      <PageIntro eyebrow="The ritual" title="Draw a card" />
      <div className="mt-10">
        <StepMarks step={step} />
      </div>

      <div className="mx-auto mt-14 max-w-5xl">
        <AnimatePresence mode="wait">
          {step === "spread" && (
            <Panel key="spread">
              <SpreadStep
                value={spread}
                onChange={setSpread}
                onNext={() => setStep("intention")}
              />
            </Panel>
          )}
          {step === "intention" && (
            <Panel key="intention">
              <IntentionStep
                value={intention}
                onChange={setIntention}
                onBack={() => setStep("spread")}
                onNext={() => setStep("choose")}
              />
            </Panel>
          )}
          {step === "choose" && (
            <Panel key={`choose-${round}`}>
              <ChooseStep
                spread={spread}
                onDone={(cards) => {
                  setDrawn(cards);
                  setStep("reveal");
                }}
              />
            </Panel>
          )}
          {step === "reveal" && (
            <Panel key="reveal">
              <RevealStep
                spread={spread}
                cards={drawn}
                intention={intention.trim() || null}
                onAgain={reset}
              />
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      {...(reduce ? {} : { exit: { opacity: 0, y: -10 } })}
      transition={{ duration: 0.8, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function SpreadStep({
  value,
  onChange,
  onNext,
}: {
  value: SpreadType;
  onChange: (v: SpreadType) => void;
  onNext: () => void;
}) {
  const options: { id: SpreadType; title: string; sub: string; count: number }[] = [
    { id: "single", title: "Single Card", sub: "One clear message for this moment", count: 1 },
    { id: "three", title: "Three Card", sub: "Past · Present · Future", count: 3 },
  ];
  return (
    <div className="text-center">
      <h2 className="text-3xl text-champagne">Choose your spread</h2>
      <div role="radiogroup" aria-label="Spread" className="mx-auto mt-10 grid max-w-2xl gap-5 sm:grid-cols-2">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.id)}
              className={cn(
                "group rounded-lg border px-8 py-10 text-center transition-all duration-700",
                active
                  ? "border-gold/60 bg-gold/[0.05] shadow-[var(--glow-gold-soft)]"
                  : "border-hairline bg-surface/40 hover:border-gold/30",
              )}
            >
              <div className="flex h-16 items-end justify-center gap-2" aria-hidden>
                {Array.from({ length: o.count }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "block h-14 w-9 rounded-[4px] border transition-colors duration-700",
                      active ? "border-gold/70" : "border-gold/25",
                    )}
                  />
                ))}
              </div>
              <span className="mt-6 block font-display text-2xl text-champagne">{o.title}</span>
              <span className="mt-2 block text-sm text-muted-foreground">{o.sub}</span>
            </button>
          );
        })}
      </div>
      <Button size="lg" className="mt-12" onClick={onNext}>
        Continue
      </Button>
    </div>
  );
}

function IntentionStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <form
      className="mx-auto max-w-xl text-center"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <label htmlFor="intention" className="block font-display text-3xl text-champagne">
        What would you like clarity on?
      </label>
      <p className="mt-3 text-sm text-muted-foreground">
        Optional. A few words are enough — or simply hold a feeling in mind.
      </p>
      <Input
        id="intention"
        autoFocus
        maxLength={200}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="My work, a relationship, a decision…"
        className="mt-8 text-center"
      />
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          {value.trim() ? "Shuffle the deck" : "Skip and shuffle"}
        </Button>
      </div>
    </form>
  );
}

function ChooseStep({
  spread,
  onDone,
}: {
  spread: SpreadType;
  onDone: (cards: OracleCardData[]) => void;
}) {
  const reduce = useReducedMotion();
  const positions = SPREADS[spread].positions;
  const need = positions.length;
  const deck = useMemo(() => shuffle(DECK), []);
  const [phase, setPhase] = useState<"shuffle" | "fan">(reduce ? "fan" : "shuffle");
  const [picked, setPicked] = useState<number[]>([]);

  useEffect(() => {
    if (phase !== "shuffle") return;
    const t = setTimeout(() => setPhase("fan"), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (picked.length !== need) return;
    const t = setTimeout(() => onDone(picked.map((i) => deck[i]!)), reduce ? 200 : 900);
    return () => clearTimeout(t);
  }, [picked, need, deck, onDone, reduce]);

  const pick = (i: number) => {
    if (phase !== "fan" || picked.includes(i) || picked.length >= need) return;
    setPicked((p) => [...p, i]);
  };

  const spreadAngle = 64;
  return (
    <div className="text-center">
      <h2 className="text-3xl text-champagne" aria-live="polite">
        {phase === "shuffle"
          ? "Shuffling the deck…"
          : picked.length < need
            ? need === 1
              ? "Choose the card that calls to you"
              : `Choose your ${(positions[picked.length] ?? "").toLowerCase()} card`
            : "Your cards are chosen"}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        {phase === "shuffle" ? "Breathe slowly while the cards settle." : `${picked.length} of ${need} chosen`}
      </p>

      <div className="relative mx-auto mt-14 h-[300px] w-full max-w-3xl sm:h-[340px]">
        <div className="absolute bottom-10 left-1/2 h-40 w-72 -translate-x-1/2 glow-violet" aria-hidden />
        {Array.from({ length: FAN_SIZE }, (_, i) => {
          const angle = -spreadAngle / 2 + (spreadAngle * i) / (FAN_SIZE - 1);
          const isPicked = picked.includes(i);
          const jitter = ((i * 37) % 11) - 5;
          return (
            <motion.button
              key={i}
              type="button"
              aria-label={`Card ${i + 1} of ${FAN_SIZE}`}
              disabled={phase !== "fan" || isPicked || picked.length >= need}
              onClick={() => pick(i)}
              className="absolute bottom-0 left-1/2 -ml-8 w-16 rounded-[10px] focus-visible:ring-1 focus-visible:ring-gold sm:-ml-11 sm:w-22 disabled:cursor-default"
              style={{ transformOrigin: "50% 240%", zIndex: i }}
              initial={reduce ? false : { rotate: 0, x: 0, y: 0, opacity: 0 }}
              animate={
                phase === "shuffle"
                  ? {
                      opacity: 1,
                      rotate: [0, jitter, -jitter / 2, 0],
                      x: [0, jitter * 6, -jitter * 4, 0],
                      y: [0, -Math.abs(jitter) * 2, 0, 0],
                    }
                  : {
                      opacity: isPicked ? 0 : 1,
                      rotate: angle,
                      x: 0,
                      y: isPicked ? -60 : 0,
                    }
              }
              {...(phase === "fan" && !isPicked ? { whileHover: { y: -14 } } : {})}
              transition={
                phase === "shuffle"
                  ? { duration: 1.8, ease: "easeInOut", delay: (i % 4) * 0.05 }
                  : { duration: 1.1, ease: EASE, delay: isPicked ? 0 : i * 0.035 }
              }
            >
              <div className="aspect-[2/3] shadow-[0_8px_30px_-12px_var(--ink)]">
                <CardBack />
              </div>
            </motion.button>
          );
        })}
      </div>

      {need > 1 && (
        <div className="mx-auto mt-12 flex max-w-md justify-center gap-6">
          {positions.map((pos, i) => (
            <div key={pos} className="flex flex-col items-center gap-3">
              <div
                className={cn(
                  "aspect-[2/3] w-14 rounded-[6px] border transition-all duration-700",
                  picked[i] !== undefined
                    ? "border-gold/60 shadow-[var(--glow-gold-soft)]"
                    : "border-dashed border-gold/20",
                )}
              >
                {picked[i] !== undefined && <CardBack />}
              </div>
              <span className="text-[0.65rem] uppercase tracking-[0.26em] text-muted-foreground">
                {pos}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RevealStep({
  spread,
  cards,
  intention,
  onAgain,
}: {
  spread: SpreadType;
  cards: OracleCardData[];
  intention: string | null;
  onAgain: () => void;
}) {
  const reduce = useReducedMotion();
  const positions = SPREADS[spread].positions;
  const [shown, setShown] = useState(0);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const save = useSaveReading();
  const navigate = useNavigate();

  useEffect(() => {
    if (shown >= cards.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 500 : reduce ? 300 : 1700);
    return () => clearTimeout(t);
  }, [shown, cards.length, reduce]);

  const reading = { spread_type: spread, card_ids: cards.map((c) => c.id), intention };
  const done = shown >= cards.length;

  const onSave = () => {
    if (!user) {
      stashPendingReading(reading);
      toast("Sign in and your reading will be saved to your journal.");
      navigate({ to: "/auth", search: { redirect: "/journal" } });
      return;
    }
    save.mutate(reading, {
      onSuccess: () => {
        setSaved(true);
        toast("Saved to your journal.");
      },
      onError: () => toast("Your reading could not be saved just now. Please try again."),
    });
  };

  return (
    <div>
      {intention && (
        <p className="mx-auto mb-12 max-w-xl text-center font-display text-xl italic text-muted-foreground">
          “{intention}”
        </p>
      )}

      {cards.length === 1 ? (
        <div className="grid items-center gap-14 md:grid-cols-[auto_1fr] md:gap-20">
          <div className="mx-auto">
            <FlipCard card={cards[0]!} revealed={shown > 0} size="lg" />
          </div>
          <AnimatePresence>
            {shown > 0 && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: reduce ? 0 : 0.9, ease: EASE }}
              >
                <CardReading card={cards[0]!} className="text-center md:text-left" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="grid gap-16 md:grid-cols-3 md:gap-10">
          {cards.map((card, i) => (
            <div key={card.id} className="flex flex-col items-center">
              <p className="eyebrow mb-6">{positions[i]}</p>
              <FlipCard card={card} revealed={shown > i} size="md" />
              <div className="mt-10 min-h-[4rem] w-full">
                <AnimatePresence>
                  {shown > i && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.1, delay: reduce ? 0 : 0.8, ease: EASE }}
                    >
                      <CardReading card={card} align="center" headingLevel="h3" className="[&_h3]:text-3xl [&_h3]:sm:text-4xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      <motion.div
        className="mt-20 flex flex-wrap items-center justify-center gap-4"
        initial={false}
        animate={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}
        transition={{ duration: 1, delay: done && !reduce ? 1.4 : 0 }}
        aria-hidden={!done}
      >
        <Button size="lg" onClick={onSave} disabled={save.isPending || saved}>
          {saved ? "Saved to journal" : save.isPending ? "Saving…" : "Save to journal"}
        </Button>
        <Button size="lg" variant="ritual" onClick={onAgain}>
          Draw again
        </Button>
      </motion.div>
      {saved && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/journal" className="text-gold underline-offset-4 hover:underline">
            Open your journal
          </Link>
        </p>
      )}
    </div>
  );
}
