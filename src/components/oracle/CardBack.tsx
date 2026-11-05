import { polar, starPoints } from "@/components/card-art/primitives";
import { cn } from "@/lib/utils";
import { CardFrame } from "./CardFrame";

const RING_DOTS = Array.from({ length: 32 }, (_, i) => i * (360 / 32));
const RAYS = Array.from({ length: 16 }, (_, i) => i * 22.5);

function BackArt() {
  return (
    <CardFrame label="Card back">
      <g opacity={0.9}>
        <circle cx="100" cy="150" r="74" opacity={0.3} />
        <circle cx="100" cy="150" r="66" opacity={0.55} />
        <circle cx="100" cy="150" r="52" opacity={0.3} />
        <circle cx="100" cy="150" r="34" opacity={0.55} />
        <circle cx="100" cy="150" r="14" opacity={0.4} />
        {RING_DOTS.map((a) => {
          const [x, y] = polar(100, 150, 70, a);
          return <circle key={a} cx={x} cy={y} r={0.7} className="fill-gold" stroke="none" opacity={0.6} />;
        })}
        {RAYS.map((a) => {
          const [x1, y1] = polar(100, 150, 36, a);
          const [x2, y2] = polar(100, 150, a % 45 === 0 ? 64 : 50, a);
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} opacity={0.3} />;
        })}
        <polygon points={starPoints(100, 150, 8, 48, 22)} className="fill-gold" fillOpacity={0.06} />
        <polygon points={starPoints(100, 150, 4, 48, 48 * Math.SQRT1_2, -90)} opacity={0.35} />
        <polygon points={starPoints(100, 150, 4, 48, 48 * Math.SQRT1_2, -45)} opacity={0.35} />
        <circle cx="100" cy="150" r="2.4" className="fill-gold" stroke="none" />
      </g>
      <path d="M100 38 L103 46 L100 54 L97 46 Z" className="fill-gold" stroke="none" opacity={0.7} />
      <path d="M100 246 L103 254 L100 262 L97 254 Z" className="fill-gold" stroke="none" opacity={0.7} />
      <path d="M80 46 H90 M110 46 H120 M80 254 H90 M110 254 H120" opacity={0.35} />
    </CardFrame>
  );
}

export function CardBack({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-full w-full text-gold", className)}>
      <BackArt />
    </div>
  );
}
