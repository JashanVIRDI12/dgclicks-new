"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FRAME_COUNT, FRAME_PATH } from "@/lib/frame-count";
import { prefersReducedMotion } from "@/lib/gsap";

function frameUrl(index: number) {
  return FRAME_PATH.replace("%04d", String(index + 1).padStart(4, "0"));
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = cw / ch;
  let dw: number;
  let dh: number;
  if (cr > ir) {
    dw = cw;
    dh = cw / ir;
  } else {
    dh = ch;
    dw = ch * ir;
  }
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

type Options = {
  enabled?: boolean;
};

/**
 * Loads the WebP frame sequence and exposes `drawFrame(i)`.
 * Reveals early (gate = ~40% of frames) and streams the rest;
 * drawing falls back to the nearest loaded frame so scrubbing never stalls.
 */
export function useScrollSequence(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: Options = {},
) {
  const { enabled = true } = options;

  const images = useRef<(HTMLImageElement | null)[]>([]);
  const lastIndex = useRef(0);
  const rafId = useRef(0);
  const size = useRef({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  const gate = Math.max(1, Math.round(FRAME_COUNT * 0.4));

  const nearestLoaded = useCallback((i: number) => {
    if (images.current[i]) return i;
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (i - d >= 0 && images.current[i - d]) return i - d;
      if (i + d < FRAME_COUNT && images.current[i + d]) return i + d;
    }
    return -1;
  }, []);

  const paint = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const best = nearestLoaded(index);
      if (best < 0) return;
      const img = images.current[best];
      if (!img?.complete) return;
      const { w, h } = size.current;
      coverDraw(ctx, img, w, h);
    },
    [canvasRef, nearestLoaded],
  );

  /** rAF-batched draw; safe to call on every scrub tick. */
  const drawFrame = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      lastIndex.current = clamped;
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => paint(clamped));
    },
    [paint],
  );

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    // Cap DPR at 1.5: full retina doubles the pixels pushed per scrub tick
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    size.current = { w, h };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(lastIndex.current);
  }, [canvasRef, paint]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    images.current = new Array(FRAME_COUNT).fill(null);
    let loaded = 0;
    let gateHit = false;

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        const done = (ok: boolean) => {
          if (cancelled) return resolve();
          if (ok) images.current[i] = img;
          loaded += 1;
          if (!gateHit) {
            setLoadPct(Math.min(100, Math.round((loaded / gate) * 100)));
            if (loaded >= gate) {
              gateHit = true;
              setReady(true);
            }
          }
          resolve();
        };
        img.onload = () => done(true);
        img.onerror = () => done(false);
        img.src = frameUrl(i);
      });

    const run = async () => {
      await loadOne(0);
      if (cancelled) return;
      resize();

      if (prefersReducedMotion()) {
        setLoadPct(100);
        setReady(true);
        return;
      }

      // Sparse pass first so early scrubs always have a nearby frame,
      // then fill the gaps in order.
      const sparse: number[] = [];
      const rest: number[] = [];
      for (let i = 1; i < FRAME_COUNT; i++) {
        (i % 4 === 0 ? sparse : rest).push(i);
      }
      const queue = [...sparse, ...rest];

      const batch = 16;
      for (let i = 0; i < queue.length; i += batch) {
        if (cancelled) return;
        await Promise.all(queue.slice(i, i + batch).map(loadOne));
      }
    };

    void run();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { ready, loadPct, drawFrame, resize, frameCount: FRAME_COUNT };
}
