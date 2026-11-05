import type { ReactNode, SVGProps } from "react";

/** Shared SVG wrapper: 100×100 canvas, gold hairline stroke. */
export function Art({ children, ...props }: { children: ReactNode } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export type ArtProps = SVGProps<SVGSVGElement>;

/** Tiny star-dot accent. */
export function Dot({ x, y, r = 0.9, o = 1 }: { x: number; y: number; r?: number; o?: number }) {
  return <circle cx={x} cy={y} r={r} fill="currentColor" stroke="none" opacity={o} />;
}

/** Concave four-point sparkle. */
export function Sparkle({ x, y, s = 3, o = 1 }: { x: number; y: number; s?: number; o?: number }) {
  const d = `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`;
  return <path d={d} fill="currentColor" stroke="none" opacity={o} />;
}

export const SOFT = { fill: "currentColor", fillOpacity: 0.08 } as const;

const rad = (deg: number) => (deg * Math.PI) / 180;
const f = (n: number) => Math.round(n * 100) / 100;

export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [f(cx + r * Math.cos(rad(deg))), f(cy + r * Math.sin(rad(deg)))];
}

/** Star polygon points (n points, alternating outer/inner radius). */
export function starPoints(
  cx: number,
  cy: number,
  n: number,
  rOuter: number,
  rInner: number,
  rot = -90,
): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const [x, y] = polar(cx, cy, r, rot + (i * 180) / n);
    pts.push(`${x},${y}`);
  }
  return pts.join(" ");
}

/**
 * Crescent path: the part of circle (cx,cy,r) not covered by a circle of
 * radius r2 offset by d. `angle` points toward the bite (0 = right, -90 = up).
 */
export function crescentPath(
  cx: number,
  cy: number,
  r: number,
  d: number,
  r2 = r * 0.92,
  angle = 0,
): string {
  const x = (d * d + r * r - r2 * r2) / (2 * d);
  const y = Math.sqrt(Math.max(r * r - x * x, 0));
  const rot = (px: number, py: number) => {
    const c = Math.cos(rad(angle));
    const s = Math.sin(rad(angle));
    return `${f(cx + px * c - py * s)} ${f(cy + px * s + py * c)}`;
  };
  return `M${rot(x, -y)} A${r} ${r} 0 1 0 ${rot(x, y)} A${r2} ${r2} 0 0 1 ${rot(x, -y)} Z`;
}

/** Radial line segments (rays). */
export function Rays({
  cx,
  cy,
  r1,
  r2,
  count,
  from = 0,
  to = 360,
  alt,
}: {
  cx: number;
  cy: number;
  r1: number;
  r2: number;
  count: number;
  from?: number;
  to?: number;
  alt?: number;
}) {
  const full = to - from === 360;
  const step = (to - from) / (full ? count : count - 1);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = from + i * step;
        const end = alt && i % 2 === 1 ? alt : r2;
        const [x1, y1] = polar(cx, cy, r1, a);
        const [x2, y2] = polar(cx, cy, end, a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </>
  );
}

/** Mirror children horizontally around x = 50. */
export function MirrorX({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform="translate(100 0) scale(-1 1)">{children}</g>
    </>
  );
}
