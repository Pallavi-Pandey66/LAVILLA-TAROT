import {
  Art,
  Dot,
  MirrorX,
  Rays,
  SOFT,
  Sparkle,
  crescentPath,
  starPoints,
  type ArtProps,
} from "./primitives";

export function MoonArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d={crescentPath(50, 52, 24, 9, 22, -90)} {...SOFT} />
      <circle cx="50" cy="44" r="7" />
      <Dot x={50} y={44} r={1.2} />
      <Dot x={28} y={28} />
      <Dot x={73} y={30} />
      <Sparkle x={50} y={22} s={2.6} />
      <Dot x={20} y={52} r={0.7} o={0.6} />
      <Dot x={80} y={52} r={0.7} o={0.6} />
    </Art>
  );
}

export function SunArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="50" cy="50" r="13" />
      <circle cx="50" cy="50" r="7" {...SOFT} />
      <Rays cx={50} cy={50} r1={18} r2={34} alt={27} count={12} from={-90} />
      <Dot x={50} y={50} r={1.2} />
    </Art>
  );
}

export function StarArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="50" cy="50" r="33" />
      <polygon points={starPoints(50, 50, 8, 27, 11)} {...SOFT} />
      <circle cx="50" cy="50" r="4" />
      <Dot x={50} y={50} r={1.1} />
      <Dot x={26} y={26} r={0.8} />
      <Dot x={74} y={74} r={0.8} />
    </Art>
  );
}

export function EyeArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M20 58 Q50 34 80 58 Q50 82 20 58 Z" />
      <circle cx="50" cy="58" r="9" {...SOFT} />
      <circle cx="50" cy="58" r="3" fill="currentColor" stroke="none" />
      <Rays cx={50} cy={58} r1={26} r2={36} count={5} from={-150} to={-30} />
      <Dot x={50} y={84} r={0.8} o={0.7} />
    </Art>
  );
}

export function KeyArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="50" cy="28" r="12" />
      <circle cx="50" cy="28" r="5" {...SOFT} />
      <Dot x={50} y={19} r={0.8} />
      <Dot x={50} y={37} r={0.8} />
      <Dot x={41} y={28} r={0.8} />
      <Dot x={59} y={28} r={0.8} />
      <path d="M45 43 H55" />
      <path d="M50 40 V82" />
      <path d="M50 70 H59 V74" />
      <path d="M50 78 H56" />
      <Sparkle x={66} y={52} s={2.4} />
    </Art>
  );
}

export function DoorArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M32 76 V46 A18 18 0 0 1 68 46 V76" />
      <path d="M40 76 V48 A10 10 0 0 1 60 48 V76 Z" {...SOFT} />
      <path d="M22 76 H78" />
      <path d="M44 80 L36 87" />
      <path d="M50 80 V88" />
      <path d="M56 80 L64 87" />
      <Sparkle x={50} y={22} s={2.6} />
      <Dot x={57} y={62} r={1} />
    </Art>
  );
}

export function PathArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M20 46 H80" />
      <path d="M38 46 A12 12 0 0 1 62 46" {...SOFT} />
      <Rays cx={50} cy={46} r1={16} r2={22} count={5} from={-150} to={-30} />
      <path d="M40 86 C 66 76, 30 66, 56 58 C 64 55, 46 51, 50 48" />
      <Dot x={30} y={70} r={0.8} o={0.7} />
      <Dot x={72} y={66} r={0.8} o={0.7} />
    </Art>
  );
}

export function LanternArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="50" cy="14" r="3" />
      <path d="M50 17 V24" />
      <path d="M38 32 L50 24 L62 32 Z" />
      <path d="M40 32 H60 L62 62 H38 Z" />
      <path d="M50 40 C 45 47, 45 53, 50 56 C 55 53, 55 47, 50 40 Z" {...SOFT} />
      <path d="M36 62 H64 L60 68 H40 Z" />
      <Dot x={50} y={73} r={1.1} />
      <Dot x={28} y={44} r={0.8} o={0.7} />
      <Dot x={72} y={44} r={0.8} o={0.7} />
    </Art>
  );
}

export function FeatherArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M50 16 C 64 30, 64 56, 52 74 L50 77 L48 74 C 36 56, 36 30, 50 16 Z" {...SOFT} />
      <path d="M50 22 V86" />
      {[32, 40, 48, 56, 64].map((y) => (
        <g key={y}>
          <path d={`M50 ${y} L${43} ${y - 6}`} />
          <path d={`M50 ${y} L${57} ${y - 6}`} />
        </g>
      ))}
      <Dot x={30} y={30} r={0.8} />
      <Dot x={70} y={70} r={0.8} />
    </Art>
  );
}

export function MessengerArt(p: ArtProps) {
  return (
    <Art {...p}>
      <MirrorX>
        <path d="M47 48 C 40 34, 28 30, 15 34 C 24 40, 30 46, 33 54 C 38 51, 43 51, 47 54" />
        <path d="M24 37 C 30 40, 34 44, 36 50" opacity={0.6} />
        <path d="M47 60 L43 72 L50 67" />
      </MirrorX>
      <ellipse cx="50" cy="54" rx="4" ry="9" {...SOFT} />
      <circle cx="50" cy="40" r="3.5" />
      <Sparkle x={50} y={22} s={2.4} />
    </Art>
  );
}

export function SerpentArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path
        d="M57.25 22.95 A28 28 0 1 1 42.75 22.95 L53 26 L44.31 28.75 A22 22 0 1 0 55.69 28.75 Z"
        {...SOFT}
      />
      <ellipse cx="59" cy="25.8" rx="6.5" ry="4.5" />
      <Dot x={60.5} y={24.5} r={0.9} />
      <polygon points={starPoints(50, 54, 4, 7, 2.5)} fill="currentColor" stroke="none" opacity={0.9} />
      <Dot x={50} y={42} r={0.7} o={0.6} />
      <Dot x={50} y={66} r={0.7} o={0.6} />
    </Art>
  );
}

export function TreeArt(p: ArtProps) {
  const half = (
    <>
      <path d="M50 50 V24" />
      <path d="M50 42 C 44 36, 38 34, 32 32" />
      <path d="M50 42 C 56 36, 62 34, 68 32" />
      <path d="M50 34 C 46 30, 42 28, 40 22" />
      <path d="M50 34 C 54 30, 58 28, 60 22" />
      <Dot x={32} y={32} />
      <Dot x={68} y={32} />
      <Dot x={40} y={22} />
      <Dot x={60} y={22} />
      <Dot x={50} y={22} />
    </>
  );
  return (
    <Art {...p}>
      <circle cx="50" cy="50" r="34" />
      <path d="M26 50 H74" opacity={0.5} />
      {half}
      <g transform="translate(0 100) scale(1 -1)" opacity={0.75}>
        {half}
      </g>
    </Art>
  );
}
