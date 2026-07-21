"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * Fades content up on scroll into view. Children are visible by default
 * (no-JS and reduced-motion safe) — GSAP animates *from* the hidden state.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 44,
  stagger,
  selector,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  /** With `selector`, staggers matching children instead of the wrapper. */
  stagger?: number;
  selector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = selector ? el.querySelectorAll(selector) : el;
      gsap.from(targets, {
        x,
        y,
        opacity: 0,
        duration: 0.68,
        ease: "power3.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, [delay, x, y, stagger, selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
