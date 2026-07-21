"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * Wraps a single element and lets it follow the cursor within its bounds.
 * Only active with a fine pointer and no reduced-motion preference.
 */
export default function MagneticButton({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      },
    );
    return () => mm.revert();
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ""}`}>
      {children}
    </span>
  );
}
