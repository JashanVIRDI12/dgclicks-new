"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type WaterRippleProps = {
  className?: string;
  /** Peak brightness of the ripple light, 0..1 */
  intensity?: number;
  /** RGB tint of the water light */
  tint?: [number, number, number];
};

/**
 * "Water light" overlay — a classic two-buffer height-field ripple
 * simulation rendered at low resolution and blended as screen light over
 * the section behind it. Moving the pointer trails ripples; pressing down
 * throws a splash. Listens on the parent element, so content above the
 * canvas never blocks it. Disabled under reduced motion.
 */
export default function WaterRipple({
  className = "",
  intensity = 0.55,
  tint = [128, 196, 252],
}: WaterRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host || prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simulation grid — capped so the pixel loop stays cheap on wide screens.
    const MAX_CELLS_X = 300;
    let simW = 0;
    let simH = 0;
    let prev = new Float32Array(0);
    let curr = new Float32Array(0);
    let image: ImageData | null = null;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      simW = Math.min(MAX_CELLS_X, Math.max(80, Math.round(rect.width / 5)));
      simH = Math.max(40, Math.round(simW * (rect.height / rect.width)));
      canvas.width = simW;
      canvas.height = simH;
      prev = new Float32Array(simW * simH);
      curr = new Float32Array(simW * simH);
      image = ctx.createImageData(simW, simH);
    };
    resize();

    const drop = (cx: number, cy: number, radius: number, strength: number) => {
      const r2 = radius * radius;
      for (let y = Math.max(1, cy - radius); y <= Math.min(simH - 2, cy + radius); y++) {
        for (let x = Math.max(1, cx - radius); x <= Math.min(simW - 2, cx + radius); x++) {
          const dx = x - cx;
          const dy = y - cy;
          const d2 = dx * dx + dy * dy;
          if (d2 <= r2) {
            prev[y * simW + x] += strength * (1 - d2 / r2);
          }
        }
      }
    };

    const toSim = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      return {
        x: Math.round(((clientX - rect.left) / rect.width) * simW),
        y: Math.round(((clientY - rect.top) / rect.height) * simH),
        inside:
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom,
      };
    };

    let lastX: number | null = null;
    let lastY: number | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const p = toSim(e.clientX, e.clientY);
      if (!p.inside) {
        lastX = lastY = null;
        return;
      }
      // Lay droplets along the pointer path so fast moves leave a full trail.
      if (lastX !== null && lastY !== null) {
        const steps = Math.max(
          1,
          Math.min(8, Math.round(Math.hypot(p.x - lastX, p.y - lastY) / 2)),
        );
        for (let i = 1; i <= steps; i++) {
          drop(
            Math.round(lastX + ((p.x - lastX) * i) / steps),
            Math.round(lastY + ((p.y - lastY) * i) / steps),
            2,
            90,
          );
        }
      } else {
        drop(p.x, p.y, 2, 90);
      }
      lastX = p.x;
      lastY = p.y;
    };

    const onPointerDown = (e: PointerEvent) => {
      const p = toSim(e.clientX, e.clientY);
      if (p.inside) drop(p.x, p.y, 6, 480);
    };

    const onPointerLeave = () => {
      lastX = lastY = null;
    };

    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerdown", onPointerDown, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0.01 },
    );
    io.observe(host);

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const DAMPING = 0.972;
    const [tr, tg, tb] = tint;
    let idleTimer = 0;
    let raf = 0;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || !image || document.visibilityState !== "visible") return;

      // The pond stays alive with a slow ambient drip between interactions.
      if (t - idleTimer > 2600) {
        idleTimer = t;
        const x = 4 + Math.floor(Math.random() * (simW - 8));
        const y = 4 + Math.floor(Math.random() * (simH - 8));
        drop(x, y, 3, 140);
      }

      for (let y = 1; y < simH - 1; y++) {
        const row = y * simW;
        for (let x = 1; x < simW - 1; x++) {
          const i = row + x;
          const next =
            (prev[i - 1] + prev[i + 1] + prev[i - simW] + prev[i + simW]) / 2 -
            curr[i];
          curr[i] = next * DAMPING;
        }
      }
      [prev, curr] = [curr, prev];

      const data = image.data;
      for (let y = 1; y < simH - 1; y++) {
        const row = y * simW;
        for (let x = 1; x < simW - 1; x++) {
          const i = row + x;
          // Horizontal gradient reads as light refracting off the wave face.
          const shade = prev[i - 1] - prev[i + 1] + prev[i] * 0.6;
          const lum = Math.min(1, Math.abs(shade) / 220);
          const o = i * 4;
          data[o] = tr;
          data[o + 1] = tg;
          data[o + 2] = tb;
          data[o + 3] = Math.round(lum * intensity * 255);
        }
      }
      ctx.putImageData(image, 0, 0);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [intensity, tint]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-screen ${className}`}
    />
  );
}
