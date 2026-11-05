import type { ReactNode } from "react";

/** Corner ornament drawn at the top-left; rotated for the other corners. */
function Corner({ transform }: { transform?: string }) {
  return (
    <g transform={transform}>
      <path d="M16 34 A18 18 0 0 0 34 16" opacity={0.55} />
      <path d="M22 16 V22 H16" opacity={0.4} />
      <rect x="23.5" y="23.5" width="4" height="4" transform="rotate(45 25.5 25.5)" className="fill-gold" stroke="none" opacity={0.7} />
    </g>
  );
}

/** Shared 200×300 card chrome: ink surface, thin double gold border, corner ornaments. */
export function CardFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 200 300"
      role="img"
      aria-label={label}
      className="card-art block h-auto w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
    >
      <rect x="0.5" y="0.5" width="199" height="299" rx="10" className="fill-surface" stroke="none" />
      <rect x="8" y="8" width="184" height="284" rx="6" opacity={0.55} />
      <rect x="12.5" y="12.5" width="175" height="275" rx="4" opacity={0.25} />
      <Corner />
      <Corner transform="translate(200 0) scale(-1 1)" />
      <Corner transform="translate(0 300) scale(1 -1)" />
      <Corner transform="translate(200 300) scale(-1 -1)" />
      {children}
    </svg>
  );
}
