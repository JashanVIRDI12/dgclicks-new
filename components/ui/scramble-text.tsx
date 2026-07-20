"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/* ————————————————————————————————————————————————————————————————
   SCRAMBLE TEXT — decodes from a run of random glyphs into the real
   word when it scrolls into view, and (optionally) re-scrambles on a
   quiet loop to stay alive. Static under reduced motion.
   ———————————————————————————————————————————————————————————————— */

interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Glyph pool: a GSAP keyword ("upperCase") or a literal string. */
  chars?: string;
  /** Decode duration, seconds. */
  duration?: number;
  /** Re-scramble interval in seconds; 0 disables the loop. */
  loop?: number;
  /** Hold each real character before the next resolves (0–1). */
  revealDelay?: number;
  ariaHidden?: boolean;
}

export default function ScrambleText({
  text,
  className = "",
  style,
  chars = "upperCase",
  duration = 1.6,
  loop = 0,
  revealDelay = 0.4,
  ariaHidden = false,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = text;
        return;
      }

      const decode = (speed = 0.8) =>
        gsap.to(el, {
          duration,
          ease: "none",
          scrambleText: { text, chars, speed, revealDelay },
        });

      // First decode when it enters the viewport.
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => decode(),
      });

      // Quiet re-scramble loop, paused when the tab or element is hidden.
      let intervalId: number | undefined;
      if (loop > 0) {
        intervalId = window.setInterval(() => {
          if (
            document.visibilityState === "visible" &&
            el.getBoundingClientRect().bottom > 0 &&
            el.getBoundingClientRect().top < window.innerHeight
          ) {
            decode(1);
          }
        }, loop * 1000);
      }

      return () => {
        st.kill();
        if (intervalId) clearInterval(intervalId);
      };
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <span ref={ref} className={className} style={style} aria-hidden={ariaHidden}>
      {text}
    </span>
  );
}
