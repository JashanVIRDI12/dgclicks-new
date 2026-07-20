"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * Slim reading-progress rail pinned to the right edge of the viewport.
 * Driven straight from document scroll (transform only), works with or
 * without Lenis, and stays honest under reduced motion — it's information,
 * not decoration.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const usesRouteProgress =
    pathname === "/services" || pathname === "/about" || pathname === "/contact";

  useIsoLayoutEffect(() => {
    if (usesRouteProgress) return;
    const bar = barRef.current;
    if (!bar) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => gsap.set(bar, { scaleY: self.progress }),
    });
    return () => st.kill();
  }, [pathname, usesRouteProgress]);

  if (usesRouteProgress) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-4 right-2 top-4 z-[70] hidden w-[3px] overflow-hidden rounded-full bg-ink/10 md:block"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-top rounded-full bg-sky-deep will-change-transform"
        style={{ transform: "scaleY(0)" }}
      />
    </div>
  );
}
