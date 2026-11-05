import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; r: number; a: number; vx: number; vy: number; tw: number };

/** Slow-drifting star dust behind all content. ~30fps, pauses when hidden, static for reduced motion. */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gold = getComputedStyle(document.documentElement).getPropertyValue("--champagne").trim();
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(140, (w * h) / 9000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.9 + 0.2,
        a: Math.random() * 0.5 + 0.1,
        vx: (Math.random() - 0.5) * 0.05,
        vy: -(Math.random() * 0.06 + 0.01),
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = gold || "#E8D9B5";
      for (const m of motes) {
        const alpha = m.a * (0.65 + 0.35 * Math.sin(m.tw + t * 0.0006));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 33) return;
      const dt = Math.min(t - last, 100) / 16;
      last = t;
      for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.y < -2) m.y = h + 2;
        if (m.x < -2) m.x = w + 2;
        if (m.x > w + 2) m.x = -2;
      }
      draw(t);
    };

    resize();
    draw(0);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };
    if (!reduce) raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}
