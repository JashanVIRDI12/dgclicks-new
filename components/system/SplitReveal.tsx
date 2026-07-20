"use client";

import { createElement, useRef } from "react";
import { gsap, SplitText, useIsoLayoutEffect } from "@/lib/gsap";

export type SplitVariant = "chars-up" | "words-slide" | "lines-rise" | "chars-fan";

/**
 * Reusable heading reveal built on SplitText. Each variant has its own
 * split unit, direction, and easing so section headings never feel
 * copy-pasted. Text renders fully visible for no-JS / reduced motion;
 * GSAP only ever animates *from* the hidden state after fonts load.
 */
export default function SplitReveal({
  children,
  as = "h2",
  variant = "chars-up",
  className,
  delay = 0,
  start = "top 82%",
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  variant?: SplitVariant;
  className?: string;
  delay?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
      let split: SplitText | null = null;
      let cancelled = false;

      // Splitting before webfonts settle produces wrong line breaks.
      document.fonts.ready.then(() => {
        if (cancelled) return;
        split = SplitText.create(el, {
          type: variant.startsWith("lines") ? "lines" : "lines,words,chars",
          mask: variant.startsWith("lines") ? "lines" : "chars",
          aria: "auto",
          autoSplit: true,
          onSplit(self) {
            const base = {
              ease: "expo.out",
              delay,
              scrollTrigger: { trigger: el, start, once: true },
            };
            switch (variant) {
              case "words-slide":
                return gsap.from(self.words, {
                  ...base,
                  xPercent: 45,
                  opacity: 0,
                  duration: 0.9,
                  ease: "power4.out",
                  stagger: 0.045,
                });
              case "lines-rise":
                return gsap.from(self.lines, {
                  ...base,
                  yPercent: 110,
                  duration: 1.1,
                  ease: "power4.out",
                  stagger: 0.09,
                });
              case "chars-fan":
                return gsap.from(self.chars, {
                  ...base,
                  yPercent: 100,
                  rotation: 8,
                  duration: 0.8,
                  ease: "back.out(1.4)",
                  stagger: { each: 0.02, from: "end" },
                });
              case "chars-up":
              default:
                return gsap.from(self.chars, {
                  ...base,
                  yPercent: 120,
                  duration: 0.9,
                  stagger: 0.016,
                });
            }
          },
        });
      });

      return () => {
        cancelled = true;
        split?.revert();
      };
      },
    );

    return () => mm.revert();
  }, [variant, delay, start]);

  return createElement(as, { ref, className }, children);
}
