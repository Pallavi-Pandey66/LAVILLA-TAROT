import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { OracleCard } from "@/components/oracle/OracleCard";
import { PageIntro, Reveal } from "@/components/site/Reveal";
import { CARDS_BY_ID } from "@/data/catalog";
import { useAuth } from "@/lib/auth";
import { useDeleteReading, useReadings, useUpdateNote, type Reading } from "@/lib/journal";
import { SPREADS } from "@/lib/oracle";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Lumina Oracle" },
      { name: "description", content: "Your saved oracle readings and reflections, in one quiet place." },
      { property: "og:title", content: "Journal — Lumina Oracle" },
      { property: "og:description", content: "Keep your readings and notes over time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const { user, loading } = useAuth();
  return (
    <div className="px-5 pb-10 pt-32 sm:px-8">
      <PageIntro eyebrow="Your readings" title="Journal">
        A quiet record of the cards you have drawn and what they stirred in you.
      </PageIntro>
      <div className="mx-auto mt-16 max-w-3xl">
        {loading ? <TimelineSkeleton /> : user ? <Timeline /> : <SignInInvite />}
      </div>
    </div>
  );
}

function SignInInvite() {
  return (
    <Reveal className="surface-panel mx-auto max-w-md p-10 text-center">
      <h2 className="text-3xl text-champagne">Sign in to keep a journal</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        You can draw freely as a guest. Sign in to save readings and add your own notes.
      </p>
      <Button asChild className="mt-8">
        <Link to="/auth" search={{ redirect: "/journal" }}>
          Sign in
        </Link>
      </Button>
    </Reveal>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-10" aria-label="Loading your journal">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-6">
          <div className="h-3 w-3 shrink-0 rounded-full skeleton-shimmer" />
          <div className="flex-1 space-y-4">
            <div className="h-3 w-40 skeleton-shimmer rounded" />
            <div className="flex gap-3">
              <div className="h-24 w-16 skeleton-shimmer rounded-md" />
              <div className="h-24 w-16 skeleton-shimmer rounded-md" />
            </div>
            <div className="h-16 w-full skeleton-shimmer rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const readings = useReadings();
  if (readings.isLoading) return <TimelineSkeleton />;
  if (readings.isError) {
    return (
      <div className="text-center">
        <h2 className="text-3xl text-champagne">Your journal is out of reach</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          We could not open your readings just now. Please try again in a moment.
        </p>
        <Button variant="ritual" className="mt-8" onClick={() => readings.refetch()}>
          Try again
        </Button>
      </div>
    );
  }
  const list = readings.data ?? [];
  if (list.length === 0) {
    return (
      <Reveal className="text-center">
        <div className="mx-auto h-24 w-16 rounded-[6px] border border-dashed border-gold/25" aria-hidden />
        <h2 className="mt-8 text-3xl text-champagne">No readings yet</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          When you save a reading, it will appear here with space for your thoughts.
        </p>
        <Button asChild className="mt-8">
          <Link to="/draw">Draw a card</Link>
        </Button>
      </Reveal>
    );
  }
  return (
    <ol className="relative border-l border-hairline pl-8 sm:pl-10">
      {list.map((r, i) => (
        <Reveal as="li" key={r.id} delay={Math.min(i, 4) * 0.08} className="relative pb-16 last:pb-0">
          <span className="absolute -left-[37px] top-1 h-2.5 w-2.5 rounded-full border border-gold bg-ink sm:-left-[45px]" aria-hidden />
          <ReadingEntry reading={r} />
        </Reveal>
      ))}
    </ol>
  );
}

function ReadingEntry({ reading }: { reading: Reading }) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(reading.note ?? "");
  const update = useUpdateNote();
  const del = useDeleteReading();
  const cards = reading.card_ids
    .map((id) => CARDS_BY_ID[id])
    .filter((c): c is NonNullable<typeof c> => !!c);
  const positions = SPREADS[reading.spread_type]?.positions ?? [];
  const date = new Date(reading.created_at);

  return (
    <article aria-label={`Reading from ${date.toLocaleDateString()}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <time dateTime={reading.created_at} className="font-display text-2xl text-champagne">
          {date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
        </time>
        <span className="eyebrow text-[0.62rem]">
          {SPREADS[reading.spread_type]?.label ?? reading.spread_type}
        </span>
      </header>
      {reading.intention && (
        <p className="mt-2 font-display text-lg italic text-muted-foreground">“{reading.intention}”</p>
      )}

      <ul className="mt-6 flex flex-wrap gap-5">
        {cards.map((c, i) => (
          <li key={`${c.id}-${i}`}>
            <Link to="/deck/$slug" params={{ slug: c.slug }} className="group block w-20">
              <OracleCard card={c} size="xs" className="transition-transform duration-700 group-hover:-translate-y-1" />
              <span className="mt-2 block text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                {positions.length > 1 ? positions[i] : c.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update.mutate(
                { id: reading.id, note },
                {
                  onSuccess: () => {
                    setEditing(false);
                    toast("Note saved.");
                  },
                  onError: () => toast("Your note could not be saved. Please try again."),
                },
              );
            }}
          >
            <label htmlFor={`note-${reading.id}`} className="sr-only">
              Your note
            </label>
            <Textarea
              id={`note-${reading.id}`}
              autoFocus
              value={note}
              maxLength={2000}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What came up for you?"
            />
            <div className="mt-3 flex gap-2">
              <Button type="submit" size="sm" disabled={update.isPending}>
                {update.isPending ? "Saving…" : "Save note"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNote(reading.note ?? "");
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : reading.note ? (
          <p className="whitespace-pre-line border-l border-gold/30 pl-5 leading-relaxed text-champagne/85">
            {reading.note}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground/70">No note yet.</p>
        )}
      </div>

      {!editing && (
        <div className="mt-4 flex gap-1">
          <Button size="sm" variant="ghost" className="px-2" onClick={() => setEditing(true)}>
            {reading.note ? "Edit note" : "Add a note"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="px-2">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-hairline bg-surface">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-2xl font-normal text-champagne">
                  Release this reading?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This reading and its note will be removed from your journal. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-lg border-hairline bg-transparent text-champagne hover:bg-accent">
                  Keep it
                </AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-lg bg-primary text-primary-foreground hover:bg-champagne"
                  onClick={() =>
                    del.mutate(reading.id, {
                      onSuccess: () => toast("Reading removed."),
                      onError: () => toast("That reading could not be removed. Please try again."),
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </article>
  );
}
