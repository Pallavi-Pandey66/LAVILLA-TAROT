import type { OracleCardData } from "@/data/deck";
import { toRoman } from "@/lib/oracle";
import { cn } from "@/lib/utils";

/** Name, keywords, message and reflection for a card. */
export function CardReading({
  card,
  label,
  align = "left",
  className,
  headingLevel = "h2",
}: {
  card: OracleCardData;
  label?: string;
  align?: "left" | "center";
  className?: string;
  headingLevel?: "h1" | "h2" | "h3";
}) {
  const H = headingLevel;
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <p className="eyebrow">
        {label ? `${label} · ` : ""}
        {card.numeral ?? toRoman(card.number)}
      </p>
      <H className="mt-3 text-4xl text-champagne sm:text-5xl">{card.name}</H>
      <ul
        className={cn(
          "mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] uppercase tracking-[0.26em] text-muted-foreground",
          align === "center" && "justify-center",
        )}
        aria-label="Keywords"
      >
        {card.keywords.map((k, i) => (
          <li key={k} className="flex items-center gap-4">
            {i > 0 && <span className="h-1 w-1 rounded-full bg-gold/50" aria-hidden />}
            {k}
          </li>
        ))}
      </ul>
      {card.message && <div className={cn("hairline-rule my-7 w-24", align === "center" && "mx-auto")} />}
      <p className="text-lg leading-relaxed text-champagne/85">{card.message}</p>
      {card.reflection && <div className="mt-8">
        <p className="eyebrow text-[0.62rem]">Reflection</p>
        <p className="mt-3 font-display text-2xl italic leading-snug text-gold">
          {card.reflection}
        </p>
      </div>}
    </div>
  );
}
