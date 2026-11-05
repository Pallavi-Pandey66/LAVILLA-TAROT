import { motion, useReducedMotion } from "framer-motion";
import type { OracleCardData } from "@/data/deck";
import { cn } from "@/lib/utils";
import { CardBack } from "./CardBack";
import { CARD_SIZES, CardFace, type CardSize } from "./OracleCard";

/** A card that turns over in 3D with a soft golden glow on reveal. */
export function FlipCard({
  card,
  revealed,
  size = "lg",
  className,
}: {
  card: OracleCardData;
  revealed: boolean;
  size?: CardSize;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("relative aspect-[2/3] [perspective:1400px]", CARD_SIZES[size], className)}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[2rem] glow-violet"
        initial={false}
        animate={{ opacity: revealed ? 1 : 0.35 }}
        transition={{ duration: reduce ? 0 : 1.6 }}
      />
      <motion.div
        className="relative h-full w-full rounded-[10px] [transform-style:preserve-3d]"
        initial={false}
        animate={{
          rotateY: revealed ? 180 : 0,
          boxShadow: revealed ? "var(--glow-gold)" : "0 0 0 0 transparent",
        }}
        transition={{ duration: reduce ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <CardBack />
        </div>
        <div className="absolute inset-0 text-gold [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardFace card={card} />
        </div>
      </motion.div>
    </div>
  );
}
