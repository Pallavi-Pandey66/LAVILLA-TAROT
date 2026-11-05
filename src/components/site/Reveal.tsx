import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Fade-and-rise as content enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/** Small centred heading block used at the top of every page. */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-5 text-4xl leading-tight text-champagne sm:text-5xl md:text-6xl">{title}</h1>
      {children ? (
        <div className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          {children}
        </div>
      ) : null}
    </Reveal>
  );
}
