"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, isTouchDevice, prefersReducedMotion } from "@/lib/gsap";

type ParallaxTargets = {
  canvas?: HTMLElement | null;
  ui?: HTMLElement | null;
};

/**
 * Damped cursor parallax. Canvas drifts ~16px; UI layer ~8px for depth.
 * Disabled on touch and prefers-reduced-motion.
 */
export function useCursorParallax(
  scope: React.RefObject<HTMLElement | null>,
  getTargets: () => ParallaxTargets,
  enabled = true,
) {
  const xToCanvas = useRef<gsap.QuickToFunc | null>(null);
  const yToCanvas = useRef<gsap.QuickToFunc | null>(null);
  const xToUi = useRef<gsap.QuickToFunc | null>(null);
  const yToUi = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(
    () => {
      if (!enabled || prefersReducedMotion() || isTouchDevice()) return;

      const { canvas, ui } = getTargets();
      if (!canvas && !ui) return;

      if (canvas) {
        xToCanvas.current = gsap.quickTo(canvas, "x", { duration: 0.9, ease: "power3.out" });
        yToCanvas.current = gsap.quickTo(canvas, "y", { duration: 0.9, ease: "power3.out" });
      }
      if (ui) {
        xToUi.current = gsap.quickTo(ui, "x", { duration: 0.7, ease: "power3.out" });
        yToUi.current = gsap.quickTo(ui, "y", { duration: 0.7, ease: "power3.out" });
      }

      const onMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        xToCanvas.current?.(nx * 16);
        yToCanvas.current?.(ny * 12);
        xToUi.current?.(nx * -8);
        yToUi.current?.(ny * -6);
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope, dependencies: [enabled] },
  );
}
