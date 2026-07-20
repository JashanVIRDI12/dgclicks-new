"use client";

import { useRef } from "react";
import { prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

type Blob = {
  el: HTMLDivElement;
  x: number;
  y: number;
  // How strongly this blob chases the pointer (0..1 per frame)
  chase: number;
  // Pointer influence and idle-drift personality
  pull: number;
  driftX: number;
  driftY: number;
  speed: number;
  scrollShift: number;
};

/**
 * Signature element: "Liquid Light" — three blurred gradient blobs that
 * chase the pointer at different speeds and drift with scroll, so every
 * glass panel has living color to refract. Static under reduced motion.
 */
export default function LiquidField() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const els = Array.from(
      root.querySelectorAll<HTMLDivElement>("[data-blob]"),
    );
    if (els.length === 0) return;

    const personalities = [
      { chase: 0.045, pull: 1, driftX: 0.22, driftY: 0.16, speed: 0.00022, scrollShift: -0.12 },
      { chase: 0.028, pull: -0.55, driftX: 0.3, driftY: 0.24, speed: 0.00017, scrollShift: 0.08 },
      { chase: 0.016, pull: 0.4, driftX: 0.26, driftY: 0.3, speed: 0.00013, scrollShift: -0.05 },
    ];

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const blobs: Blob[] = els.map((el, i) => ({
      el,
      x: vw / 2,
      y: vh / 2,
      ...personalities[i % personalities.length],
    }));

    let pointerX = vw / 2;
    let pointerY = vh * 0.4;
    let hasPointer = false;
    let opaqueSceneVisible = false;
    let pageVisible = document.visibilityState === "visible";

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      hasPointer = true;
    };
    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    };
    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    const opaqueObserver = new IntersectionObserver(
      (entries) => {
        opaqueSceneVisible = entries.some((entry) => entry.isIntersecting);
        root.style.visibility = opaqueSceneVisible ? "hidden" : "visible";
      },
      { threshold: 0.01 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-opaque-scene]")
      .forEach((section) => opaqueObserver.observe(section));

    let raf = 0;
    const tick = (t: number) => {
      if (!pageVisible || opaqueSceneVisible) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const scroll = window.scrollY;
      for (const b of blobs) {
        // Idle wander keeps the field alive on touch devices too
        const wanderX = vw / 2 + Math.sin(t * b.speed) * vw * b.driftX;
        const wanderY = vh / 2 + Math.cos(t * b.speed * 1.3) * vh * b.driftY;
        const targetX = hasPointer
          ? pointerX * Math.abs(b.pull) + wanderX * (1 - Math.abs(b.pull) * 0.6)
          : wanderX;
        const targetY =
          (hasPointer ? pointerY * Math.abs(b.pull) * 0.7 : wanderY) +
          wanderY * (hasPointer ? 0.3 : 0) +
          scroll * b.scrollShift;
        const tx = b.pull >= 0 ? targetX : vw - targetX;
        b.x += (tx - b.x) * b.chase;
        b.y += (targetY - b.y) * b.chase;
        b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      opaqueObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      root.style.visibility = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="grain fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #eef4fa 0%, #f7f9fb 38%, #f6f8ea 100%)",
      }}
    >
      <div
        data-blob
        className="absolute left-[30%] top-[28%] h-[58vmax] w-[58vmax] rounded-full opacity-50 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(74,137,200,0.7), rgba(74,137,200,0) 65%)",
          filter: "blur(70px)",
        }}
      />
      <div
        data-blob
        className="absolute left-[68%] top-[55%] h-[48vmax] w-[48vmax] rounded-full opacity-45 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 55% 45%, rgba(206,219,88,0.75), rgba(206,219,88,0) 65%)",
          filter: "blur(80px)",
        }}
      />
      <div
        data-blob
        className="absolute left-[55%] top-[15%] h-[40vmax] w-[40vmax] rounded-full opacity-40 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(46,107,168,0.6), rgba(46,107,168,0) 62%)",
          filter: "blur(85px)",
        }}
      />
    </div>
  );
}
