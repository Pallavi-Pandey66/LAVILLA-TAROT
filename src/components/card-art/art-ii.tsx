import {
  Art,
  Dot,
  MirrorX,
  SOFT,
  Sparkle,
  crescentPath,
  polar,
  type ArtProps,
} from "./primitives";

export function SeedArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M50 84 C 36 78, 34 60, 50 52 C 66 60, 64 78, 50 84 Z" {...SOFT} />
      <path d="M50 54 L47 60 L52 66 L48 72" />
      <path d="M50 52 V28" />
      <MirrorX>
        <path d="M50 40 C 44 40, 37 36, 34 29 C 41 28, 47 32, 50 40 Z" />
      </MirrorX>
      <Dot x={50} y={22} r={1.1} />
      <Dot x={30} y={60} r={0.8} o={0.7} />
      <Dot x={70} y={60} r={0.8} o={0.7} />
    </Art>
  );
}

export function MountainArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M14 74 L33 50 L41 59 L50 36 L59 59 L67 50 L86 74 Z" {...SOFT} />
      <path d="M45 48 L50 44 L55 48" />
      <path d="M14 74 H86" />
      <path d={crescentPath(50, 22, 7, 3.5, 6.2, -45)} fill="currentColor" fillOpacity={0.25} />
      <Dot x={30} y={30} r={0.8} />
      <Dot x={70} y={28} r={0.8} />
      <Dot x={50} y={82} r={0.7} o={0.6} />
    </Art>
  );
}

export function RiverArt(p: ArtProps) {
  return (
    <Art {...p}>
      {[-11, 0, 11].map((o) => (
        <path
          key={o}
          d={`M${36 + o} 16 C ${62 + o} 30, ${38 + o} 50, ${50 + o} 60 C ${60 + o} 68, ${44 + o} 78, ${54 + o} 86`}
        />
      ))}
      <Dot x={24} y={40} r={0.9} />
      <Dot x={78} y={56} r={0.9} />
      <Sparkle x={76} y={26} s={2.2} />
    </Art>
  );
}

export function TideArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path
        d="M16 66 C 28 66, 32 58, 36 50 C 42 36, 62 32, 72 42 C 78 50, 74 60, 64 60 C 57 60, 56 51, 62 49"
        {...SOFT}
      />
      <path d="M16 74 H84" />
      <path d="M26 80 H74" opacity={0.6} />
      <path d={crescentPath(70, 22, 7, 3.5, 6.2, 135)} />
      <Dot x={30} y={30} r={0.8} />
      <Dot x={50} y={22} r={0.8} />
    </Art>
  );
}

export function FlameArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M50 16 C 62 32, 70 46, 70 58 C 70 72, 60 80, 50 80 C 40 80, 30 72, 30 58 C 30 46, 38 32, 50 16 Z" />
      <path
        d="M50 44 C 56 52, 60 58, 60 64 C 60 71, 55 74, 50 74 C 45 74, 40 71, 40 64 C 40 58, 44 52, 50 44 Z"
        {...SOFT}
      />
      <path d="M40 86 H60" />
      <Dot x={24} y={36} r={0.8} />
      <Dot x={76} y={36} r={0.8} />
    </Art>
  );
}

export function WindArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M16 38 H56 C 64 38, 68 32, 64 27 C 60 23, 54 26, 56 31" />
      <path d="M22 52 H70 C 78 52, 82 58, 78 63 C 74 67, 68 64, 70 60" />
      <path d="M16 66 H44 C 52 66, 54 72, 50 76 C 46 79, 42 76, 44 73" />
      <Dot x={30} y={28} r={0.8} />
      <Dot x={80} y={40} r={0.8} />
      <Dot x={64} y={76} r={0.8} />
    </Art>
  );
}

export function CrystalArt(p: ArtProps) {
  const outer = [0, 1, 2, 3, 4, 5].map((i) => polar(50, 50, 32, -90 + i * 60));
  const inner = [0, 1, 2, 3, 4, 5].map((i) => polar(50, 50, 14, -90 + i * 60));
  const pts = (a: [number, number][]) => a.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <Art {...p}>
      <polygon points={pts(outer)} />
      <polygon points={pts(inner)} {...SOFT} />
      {outer.map(([x, y], i) => (
        <line key={i} x1={inner[i]![0]} y1={inner[i]![1]} x2={x} y2={y} />
      ))}
      <Sparkle x={44} y={44} s={2.2} />
    </Art>
  );
}

export function MirrorArt(p: ArtProps) {
  return (
    <Art {...p}>
      <ellipse cx="50" cy="40" rx="18" ry="22" />
      <ellipse cx="50" cy="40" rx="13" ry="17" {...SOFT} />
      <path d="M46 62 L47 82 Q50 86 53 82 L54 62" />
      <circle cx="50" cy="66" r="2" />
      <Sparkle x={44} y={33} s={4} />
      <Dot x={56} y={44} r={0.8} o={0.7} />
    </Art>
  );
}

export function VeilArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="50" cy="50" r="16" {...SOFT} />
      <path d="M22 80 C 22 44, 36 26, 50 26 C 64 26, 78 44, 78 80" />
      <path d="M32 82 C 32 52, 40 36, 50 36 C 60 36, 68 52, 68 82" opacity={0.75} />
      <path d="M42 84 C 42 60, 46 46, 50 46 C 54 46, 58 60, 58 84" opacity={0.5} />
      <Sparkle x={50} y={16} s={2.4} />
    </Art>
  );
}

export function BridgeArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M18 38 H82" />
      <path d="M28 60 A22 22 0 0 1 72 60" />
      {[36, 43, 50, 57, 64].map((x) => {
        const y = 60 - Math.sqrt(Math.max(22 * 22 - (x - 50) * (x - 50), 0));
        return <line key={x} x1={x} y1={38} x2={x} y2={y} opacity={0.7} />;
      })}
      <path d="M16 60 H84" />
      <path d="M28 60 A22 22 0 0 0 72 60" opacity={0.35} strokeDasharray="2 3" />
      <path d="M30 70 H40 M60 70 H70" opacity={0.4} />
      <Dot x={50} y={24} r={0.9} />
    </Art>
  );
}

export function CompassArt(p: ArtProps) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 4 === 0 ? 34 : i % 4 === 2 ? 19 : 6;
    const [x, y] = polar(50, 50, r, -90 + i * 22.5);
    pts.push(`${x},${y}`);
  }
  return (
    <Art {...p}>
      <circle cx="50" cy="50" r="24" opacity={0.5} />
      <polygon points={pts.join(" ")} {...SOFT} />
      {[0, 90, 180, 270].map((a) => {
        const [x, y] = polar(50, 50, 34, -90 + a);
        return <line key={a} x1={50} y1={50} x2={x} y2={y} opacity={0.6} />;
      })}
      <circle cx="50" cy="50" r="3" />
      <Dot x={50} y={50} r={1} />
    </Art>
  );
}

export function HourglassArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M30 18 H70 M30 82 H70" />
      <path d="M33 18 V82 M67 18 V82" opacity={0.5} />
      <path d="M38 22 C 38 38, 48 44, 48 50 C 48 56, 38 62, 38 78" />
      <path d="M62 22 C 62 38, 52 44, 52 50 C 52 56, 62 62, 62 78" />
      <path d="M41 32 Q50 42 59 32 Z" {...SOFT} />
      <path d="M50 46 V70" strokeWidth={0.75} opacity={0.8} />
      <path d="M40 77 Q50 64 60 77 Z" fill="currentColor" fillOpacity={0.18} />
      <Dot x={22} y={50} r={0.8} />
      <Dot x={78} y={50} r={0.8} />
      <Sparkle x={50} y={11} s={2.2} />
    </Art>
  );
}
