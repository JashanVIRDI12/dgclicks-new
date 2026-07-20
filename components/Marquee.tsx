"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * Infinite horizontal marquee. Content is rendered three times and shifted
 * by one copy-width per loop. Pauses on hover and keyboard focus. Under
 * reduced motion it becomes a static, natively scrollable row.
 */
export default function Marquee({
  children,
  speed = 60,
  className,
  velocityReactive = false,
}: {
  children: React.ReactNode;
  /** Pixels per second. */
  speed?: number;
  className?: string;
  /** Briefly accelerates the loop in response to document scroll velocity. */
  velocityReactive?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const firstCopy = firstCopyRef.current;
    if (!root || !track || !firstCopy) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.classList.add("marquee-mask", "overflow-hidden");
      root.classList.remove("overflow-x-auto");
      let tween: gsap.core.Tween | null = null;
      let velocityTrigger: ScrollTrigger | null = null;
      let settle: gsap.core.Tween | null = null;
      let cancelled = false;

      const buildLoop = () => {
        const copyWidth = firstCopy.getBoundingClientRect().width;
        if (copyWidth <= 0) return;
        const phase = tween?.progress() ?? 0;
        tween?.kill();
        gsap.set(track, { x: 0 });
        tween = gsap.to(track, {
          x: -copyWidth,
          duration: copyWidth / speed,
          ease: "none",
          repeat: -1,
        });
        tween.progress(phase);
      };

      void (document.fonts?.ready ?? Promise.resolve()).then(() => {
        if (!cancelled) buildLoop();
      });
      const resizeObserver = new ResizeObserver(buildLoop);
      resizeObserver.observe(firstCopy);

      if (velocityReactive) {
        velocityTrigger = ScrollTrigger.create({
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!tween) return;
            const boost = 1 + gsap.utils.clamp(0, 2.8, Math.abs(self.getVelocity()) / 1100);
            gsap.to(tween, {
              timeScale: boost,
              duration: 0.16,
              ease: "power2.out",
              overwrite: "auto",
            });
            settle?.kill();
            settle = gsap.delayedCall(0.1, () => {
              if (!tween) return;
              gsap.to(tween, {
                timeScale: 1,
                duration: 1.05,
                ease: "power3.out",
                overwrite: "auto",
              });
            });
          },
        });
      }

      const pause = () => tween?.pause();
      const play = () => tween?.play();
      root.addEventListener("pointerenter", pause);
      root.addEventListener("pointerleave", play);
      root.addEventListener("focusin", pause);
      root.addEventListener("focusout", play);
      return () => {
        cancelled = true;
        resizeObserver.disconnect();
        velocityTrigger?.kill();
        settle?.kill();
        if (tween) {
          gsap.killTweensOf(tween);
          tween.kill();
        }
        gsap.set(track, { clearProps: "transform" });
        root.removeEventListener("pointerenter", pause);
        root.removeEventListener("pointerleave", play);
        root.removeEventListener("focusin", pause);
        root.removeEventListener("focusout", play);
        root.classList.remove("marquee-mask", "overflow-hidden");
        root.classList.add("overflow-x-auto");
      };
    });
    return () => mm.revert();
  }, [speed, velocityReactive]);

  return (
    <div
      ref={rootRef}
      tabIndex={velocityReactive ? 0 : undefined}
      aria-label={
        velocityReactive
          ? "Performance statistics ticker. Focus to pause the motion."
          : undefined
      }
      className={`overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint ${className ?? ""}`}
    >
      <div ref={trackRef} className="flex w-max">
        <div ref={firstCopyRef} className="flex shrink-0 items-stretch">{children}</div>
        <div className="flex shrink-0 items-stretch motion-reduce:hidden" aria-hidden="true">
          {children}
        </div>
        <div className="flex shrink-0 items-stretch motion-reduce:hidden" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
