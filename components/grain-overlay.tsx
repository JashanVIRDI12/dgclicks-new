"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  className?: string;
  /** 0–1 opacity. Hero default ~0.06; page-wide keep ≤0.03 */
  opacity?: number;
};

export default function GrainOverlay({ className = "", opacity = 0.06 }: Props) {
  const reduced = useReducedMotion();
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = grainRef.current;
    if (!el) return;

    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 1;
      if (frame % 3 === 0) {
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        el.style.backgroundPosition = `${x}% ${y}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={grainRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[2] mix-blend-overlay ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }}
    />
  );
}
