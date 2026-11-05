import { starPoints } from "@/components/card-art/primitives";

export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`card-art ${className}`} fill="none" stroke="currentColor" strokeWidth={1} aria-hidden="true">
      <circle cx="16" cy="16" r="14" opacity={0.6} />
      <circle cx="16" cy="16" r="9" opacity={0.35} />
      <polygon points={starPoints(16, 16, 8, 8, 3)} fill="currentColor" fillOpacity={0.15} />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-3 text-gold">
      <LogoMark />
      <span className="font-display text-xl tracking-[0.22em] text-champagne">
        LUMINA <span className="text-gold">ORACLE</span>
      </span>
    </span>
  );
}
