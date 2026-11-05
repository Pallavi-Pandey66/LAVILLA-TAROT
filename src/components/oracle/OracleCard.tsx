import { CARD_ART, FallbackArt } from "@/components/card-art";
import { polar, starPoints } from "@/components/card-art/primitives";
import type { OracleCardData } from "@/data/deck";
import { toRoman } from "@/lib/oracle";
import { cn } from "@/lib/utils";
import { CardBack } from "./CardBack";
import { CardFrame } from "./CardFrame";

export type CardSize = "xs" | "sm" | "md" | "lg" | "xl" | "fluid";

export const CARD_SIZES: Record<CardSize, string> = {
  xs: "w-20",
  sm: "w-28 sm:w-32",
  md: "w-44 sm:w-52",
  lg: "w-56 sm:w-64",
  xl: "w-64 sm:w-80",
  fluid: "w-full",
};

const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

/** Front of a card. */
export function CardFace({ card }: { card: OracleCardData }) {
  const ArtComp = CARD_ART[card.slug] ?? FallbackArt;
  return (
    <CardFrame label={`${card.name}, card ${toRoman(card.number)}`}>
      <text
        x="100"
        y="46"
        textAnchor="middle"
        className="fill-gold font-display"
        stroke="none"
        fontSize="15"
        letterSpacing="3"
      >
        {toRoman(card.number)}
      </text>
      <path d="M86 56 H96 M104 56 H114" opacity={0.45} />
      <circle cx="100" cy="56" r="1.2" className="fill-gold" stroke="none" />

      {/* Sacred-geometry frame */}
      <g opacity={0.9}>
        <circle cx="100" cy="146" r="64" opacity={0.55} />
        <circle cx="100" cy="146" r="59" opacity={0.25} />
        <polygon points={starPoints(100, 146, 4, 64, 64 * Math.SQRT1_2, -90)} opacity={0.08} />
        <polygon points={starPoints(100, 146, 4, 64, 64 * Math.SQRT1_2, -45)} opacity={0.08} />
        {TICKS.map((a) => {
          const [x, y] = polar(100, 146, 64, a);
          return (
            <circle
              key={a}
              cx={x}
              cy={y}
              r={a % 90 === 0 ? 1.6 : 0.7}
              className="fill-gold"
              stroke="none"
              opacity={a % 90 === 0 ? 0.9 : 0.45}
            />
          );
        })}
      </g>
      <ArtComp x={52} y={98} width={96} height={96} strokeWidth={1.5} />

      <path d="M70 238 H130" opacity={0.3} />
      <text
        x="100"
        y="262"
        textAnchor="middle"
        className="fill-champagne font-display smallcaps"
        stroke="none"
        fontSize="16"
        letterSpacing="2.5"
      >
        {card.name}
      </text>
    </CardFrame>
  );
}

export function OracleCard({
  card,
  faceUp = true,
  size = "md",
  className,
}: {
  card?: OracleCardData | undefined;
  faceUp?: boolean | undefined;
  size?: CardSize | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("relative aspect-[2/3] text-gold", CARD_SIZES[size], className)}>
      {faceUp && card ? <CardFace card={card} /> : <CardBack />}
    </div>
  );
}
