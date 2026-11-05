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

export function CrownArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M28 66 L24 38 L38 52 L50 30 L62 52 L76 38 L72 66 Z" {...SOFT} />
      <path d="M28 72 H72" />
      <circle cx="24" cy="34" r="2.6" />
      <circle cx="50" cy="26" r="2.6" />
      <circle cx="76" cy="34" r="2.6" />
      <Dot x={40} y={62} r={1} />
      <Dot x={50} y={62} r={1} />
      <Dot x={60} y={62} r={1} />
      <Dot x={50} y={82} r={0.7} o={0.6} />
    </Art>
  );
}

export function OpenHeartArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M50 78 C 30 64, 18 52, 20 38 C 22 28, 32 23, 41 27 C 45 29, 48 33, 50 37 C 52 33, 55 29, 59 27 C 68 23, 78 28, 80 38 C 82 52, 70 64, 50 78 Z" />
      <polygon points={starPoints(50, 50, 8, 9, 3.5)} {...SOFT} />
      <Dot x={50} y={50} r={1} />
      <Dot x={24} y={72} r={0.8} />
      <Dot x={76} y={72} r={0.8} />
    </Art>
  );
}

export function HandsArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="50" cy="42" r="9" {...SOFT} />
      <Dot x={50} y={42} r={1.1} />
      <Rays cx={50} cy={42} r1={13} r2={17} count={5} from={-150} to={-30} />
      <MirrorX>
        <path d="M50 68 C 40 68, 30 62, 24 52 C 22 48, 26 46, 29 49 L36 56" />
        <path d="M28 45 C 30 42, 34 44, 38 52" />
        <path d="M50 68 C 44 72, 40 78, 38 86" />
      </MirrorX>
    </Art>
  );
}

export function AnchorArt(p: ArtProps) {
  return (
    <Art {...p}>
      <circle cx="50" cy="50" r="36" opacity={0.6} />
      <circle cx="50" cy="24" r="4" />
      <path d="M50 28 V76" />
      <path d="M40 36 H60" />
      <MirrorX>
        <path d="M30 60 C 32 72, 42 76, 50 76" />
        <path d="M26 64 L30 58 L35 63" />
      </MirrorX>
      <Dot x={50} y={50} r={0.9} />
    </Art>
  );
}

export function ButterflyArt(p: ArtProps) {
  return (
    <Art {...p}>
      <MirrorX>
        <path d="M49 44 C 40 26, 22 22, 20 34 C 18 46, 32 52, 48 50" {...SOFT} />
        <path d="M48 53 C 34 55, 26 64, 32 72 C 38 78, 46 68, 49 58" />
        <circle cx="31" cy="37" r="2.4" />
        <path d="M49 34 C 47 28, 44 24, 41 21" />
        <Dot x={41} y={21} r={1} />
      </MirrorX>
      <path d="M50 34 V70" />
    </Art>
  );
}

export function OwlArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M28 28 L37 37 C 43 33, 57 33, 63 37 L72 28 L70 50 C 70 66, 60 76, 50 78 C 40 76, 30 66, 30 50 Z" />
      <path d="M33 41 L50 47 L67 41" opacity={0.7} />
      <circle cx="41" cy="51" r="7" {...SOFT} />
      <circle cx="59" cy="51" r="7" {...SOFT} />
      <circle cx="41" cy="51" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="59" cy="51" r="2.4" fill="currentColor" stroke="none" />
      <path d="M47 59 L50 65 L53 59 Z" />
      <path d="M43 70 L46 72 M50 71 V73 M57 70 L54 72" opacity={0.6} />
    </Art>
  );
}

export function LotusArt(p: ArtProps) {
  const petal = "M50 70 C 43 58, 43 44, 50 30 C 57 44, 57 58, 50 70 Z";
  return (
    <Art {...p}>
      {[-72, -48, -24, 24, 48, 72].map((a) => (
        <path key={a} d={petal} transform={`rotate(${a} 50 70)`} opacity={0.8} />
      ))}
      <path d={petal} {...SOFT} />
      <path d="M22 76 Q50 82 78 76" />
      <Dot x={50} y={22} r={1.1} />
    </Art>
  );
}

function spiralPath() {
  const b = Math.log(1.618) / (Math.PI / 2);
  const a = 0.42;
  const turns = 4.5 * Math.PI;
  const pts: string[] = [];
  for (let t = 0; t <= turns; t += 0.08) {
    const r = a * Math.exp(b * t);
    const x = 52 + r * Math.cos(t + Math.PI);
    const y = 54 + r * Math.sin(t + Math.PI);
    pts.push(`${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`);
  }
  return `M${pts.join(" L")}`;
}
const SPIRAL = spiralPath();

export function SpiralArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d={SPIRAL} />
      <Dot x={52} y={54} r={1.2} />
      <Dot x={24} y={26} r={0.8} />
      <Dot x={78} y={78} r={0.8} />
    </Art>
  );
}

export function EclipseArt(p: ArtProps) {
  return (
    <Art {...p}>
      <Rays cx={50} cy={50} r1={25} r2={34} alt={30} count={24} />
      <circle cx="50" cy="50" r="20" />
      <path d={crescentPath(50, 50, 20, 6, 19, 180)} fill="currentColor" fillOpacity={0.3} />
      <circle cx="56" cy="50" r="19" {...SOFT} opacity={0.6} />
    </Art>
  );
}

export function DawnArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M30 60 A20 20 0 0 1 70 60" {...SOFT} />
      <Rays cx={50} cy={60} r1={25} r2={34} alt={30} count={11} from={-165} to={-15} />
      <path d="M14 60 H86" />
      <path d="M34 68 H66" opacity={0.7} />
      <path d="M40 74 H60" opacity={0.5} />
      <path d="M46 80 H54" opacity={0.35} />
    </Art>
  );
}

export function ChaliceArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M32 40 H68 C 68 54, 60 62, 50 62 C 40 62, 32 54, 32 40 Z" {...SOFT} />
      <path d="M50 62 V74" />
      <ellipse cx="50" cy="68" rx="4" ry="2" />
      <path d="M37 82 C 41 75, 59 75, 63 82 Z" />
      <Sparkle x={50} y={22} s={5} />
      <Dot x={50} y={32} r={0.9} />
      <Dot x={44} y={28} r={0.6} o={0.7} />
      <Dot x={56} y={28} r={0.6} o={0.7} />
    </Art>
  );
}

export function ThreadArt(p: ArtProps) {
  return (
    <Art {...p}>
      <path d="M16 64 C 24 64, 28 46, 36 50 C 44 54, 34 68, 28 62 C 22 56, 38 44, 48 48 C 58 52, 48 66, 42 60 C 36 54, 52 42, 62 46 C 70 50, 66 40, 72 33" />
      <path d="M66 44 L82 20" />
      <ellipse cx="79.5" cy="24" rx="1.4" ry="3" transform="rotate(34 79.5 24)" />
      <Dot x={24} y={36} r={0.8} />
      <Dot x={56} y={76} r={0.8} />
      <Sparkle x={34} y={78} s={2} />
    </Art>
  );
}
