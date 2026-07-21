"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * Number that ticks up when scrolled into view. Renders the final value in
 * markup so no-JS, SEO, and reduced-motion all see the real number.
 */
export default function Counter({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { v: from };
      gsap.to(state, {
        v: to,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate() {
          el.textContent = `${prefix}${Math.round(state.v).toLocaleString("en-CA")}${suffix}`;
        },
      });
    });
    return () => mm.revert();
  }, [to, from, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {to.toLocaleString("en-CA")}
      {suffix}
    </span>
  );
}
