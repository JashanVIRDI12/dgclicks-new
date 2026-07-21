"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Lenis smooth scroll driven by GSAP's ticker (one RAF loop for the whole
 * site). Native scroll position is preserved, so position:fixed, ScrollTrigger
 * pinning, and framer-motion's useScroll in the hero all keep working.
 * Reduced motion: no Lenis instance, the page scrolls natively.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.1,
        smoothWheel: true,
        syncTouch: false,
      });
      setLenis(lenis);

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setLenis(null);
      };
    });
    return () => mm.revert();
  }, []);

  return <>{children}</>;
}
