"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa6";
import {
  SiFacebook,
  SiFigma,
  SiGoogleads,
  SiGoogleanalytics,
  SiGooglesearchconsole,
  SiGoogletagmanager,
  SiInstagram,
  SiNextdotjs,
  SiReact,
  SiShopify,
  SiSketch,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";
import { gsap, Draggable, prefersReducedMotion } from "@/lib/gsap";

/* ————————————————————————————————————————————————————————————————
   TECHNOLOGY STACK — a magnetic constellation. Every platform we
   run floats in a loose cluster, threads light to its neighbours,
   shies away from the cursor, and can be thrown around (it springs
   home). Static grid on touch and reduced-motion.
   ———————————————————————————————————————————————————————————————— */

type Tech = {
  name: string;
  role: string;
  x: number;
  y: number;
  big?: boolean;
  icon: IconType;
  brand: string;
};

const TECHS: Tech[] = [
  { name: "Google Ads", role: "paid search", x: 9, y: 17, big: true, icon: SiGoogleads, brand: "#4285F4" },
  { name: "Facebook", role: "paid social", x: 28, y: 8, icon: SiFacebook, brand: "#0866FF" },
  { name: "Instagram", role: "social reach", x: 49, y: 7, icon: SiInstagram, brand: "#E4405F" },
  { name: "LinkedIn", role: "B2B social", x: 40, y: 22, icon: FaLinkedin, brand: "#0A66C2" },
  { name: "TikTok", role: "short video", x: 69, y: 10, icon: SiTiktok, brand: "#FFFFFF" },
  { name: "YouTube", role: "video ads", x: 88, y: 21, icon: SiYoutube, brand: "#FF0000" },
  { name: "Figma", role: "design system", x: 92, y: 45, big: true, icon: SiFigma, brand: "#F24E1E" },
  { name: "Sketch", role: "graphic design", x: 75, y: 52, icon: SiSketch, brand: "#F7B500" },
  { name: "Shopify", role: "commerce", x: 84, y: 67, icon: SiShopify, brand: "#95BF47" },
  { name: "Next.js", role: "web builds", x: 65, y: 81, big: true, icon: SiNextdotjs, brand: "#FFFFFF" },
  { name: "React", role: "interfaces", x: 45, y: 86, icon: SiReact, brand: "#61DAFB" },
  { name: "GA4", role: "measurement", x: 24, y: 80, icon: SiGoogleanalytics, brand: "#E37400" },
  { name: "Search Console", role: "SEO health", x: 8, y: 60, big: true, icon: SiGooglesearchconsole, brand: "#458CF5" },
  { name: "GTM", role: "tracking", x: 13, y: 39, icon: SiGoogletagmanager, brand: "#246FDB" },
];

const LINK_DIST = 300;
const CURSOR_DIST = 260;
const REPEL_R = 190;

export default function TechStack() {
  const ref = useRef<HTMLElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const ok = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setInteractive(ok.matches && !reduced.matches);
    update();
    ok.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      ok.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = ref.current;
      if (!section) return;

      gsap.from("[data-ts-head]", {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 74%" },
      });
      gsap.from("[data-ts-chip]", {
        scale: 0.6,
        autoAlpha: 0,
        duration: 0.7,
        stagger: { each: 0.05, from: "random" },
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: section, start: "top 64%" },
      });

      if (!interactive) return;

      const arena = arenaRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!arena || !canvas || !ctx) return;

      const chips = gsap.utils.toArray<HTMLElement>("[data-ts-chip]");
      type Body = {
        el: HTMLElement;
        hx: number;
        hy: number;
        x: number;
        y: number;
        phase: number;
        speed: number;
        dragging: boolean;
        set: (x: number, y: number) => void;
      };

      let aw = 0;
      let ah = 0;
      const bodies: Body[] = chips.map((el, i) => {
        const setX = gsap.quickSetter(el, "x", "px") as (v: number) => void;
        const setY = gsap.quickSetter(el, "y", "px") as (v: number) => void;
        return {
          el,
          hx: 0,
          hy: 0,
          x: 0,
          y: 0,
          phase: i * 1.7,
          speed: 0.6 + (i % 4) * 0.18,
          dragging: false,
          set: (x, y) => {
            setX(x);
            setY(y);
          },
        };
      });

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const resize = () => {
        const r = arena.getBoundingClientRect();
        aw = r.width;
        ah = r.height;
        canvas.width = Math.round(aw * dpr);
        canvas.height = Math.round(ah * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        bodies.forEach((b, i) => {
          b.hx = (TECHS[i].x / 100) * aw;
          b.hy = (TECHS[i].y / 100) * ah;
        });
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(arena);

      let mx = -9999;
      let my = -9999;
      const onMove = (e: PointerEvent) => {
        const r = arena.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
      };
      const onLeave = () => {
        mx = -9999;
        my = -9999;
      };
      arena.addEventListener("pointermove", onMove, { passive: true });
      arena.addEventListener("pointerleave", onLeave);

      const draggables = bodies.map((b, i) =>
        Draggable.create(b.el, {
          type: "x,y",
          inertia: true,
          bounds: arena,
          onPress() {
            b.dragging = true;
          },
          onRelease() {
            // Hand position back to the spring — it drifts home on its own.
            b.dragging = false;
            b.x = gsap.getProperty(b.el, "x") as number;
            b.y = gsap.getProperty(b.el, "y") as number;
          },
          onThrowComplete() {
            b.dragging = false;
            b.x = gsap.getProperty(b.el, "x") as number;
            b.y = gsap.getProperty(b.el, "y") as number;
          },
        })[0],
      );

      let visible = false;
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries.some((e) => e.isIntersecting);
        },
        { threshold: 0.02 },
      );
      io.observe(section);

      // Home offsets are baked into layout via left/top %, so x/y start at 0.
      const centers: Array<[number, number]> = bodies.map(() => [0, 0]);

      const tick = () => {
        if (!visible || document.visibilityState !== "visible") return;
        const t = performance.now() / 1000;

        bodies.forEach((b, i) => {
          const homeX = 0;
          const homeY = 0;
          if (!b.dragging && !draggables[i].isThrowing) {
            // Cursor repulsion measured from the chip's resting spot.
            const cx = b.hx + b.x;
            const cy = b.hy + b.y;
            let tx = homeX;
            let ty = homeY;
            const dx = cx - mx;
            const dy = cy - my;
            const d = Math.hypot(dx, dy);
            if (d < REPEL_R && d > 0.01) {
              const f = ((REPEL_R - d) / REPEL_R) * 70;
              tx += (dx / d) * f;
              ty += (dy / d) * f;
            }
            b.x += (tx - b.x) * 0.06;
            b.y += (ty - b.y) * 0.06;
            const bobX = Math.sin(t * b.speed + b.phase) * 7;
            const bobY = Math.cos(t * b.speed * 1.3 + b.phase) * 9;
            b.set(b.x + bobX, b.y + bobY);
            centers[i] = [
              b.hx + b.x + bobX + b.el.offsetWidth / 2,
              b.hy + b.y + bobY + b.el.offsetHeight / 2,
            ];
          } else {
            centers[i] = [
              b.hx + (gsap.getProperty(b.el, "x") as number) + b.el.offsetWidth / 2,
              b.hy + (gsap.getProperty(b.el, "y") as number) + b.el.offsetHeight / 2,
            ];
          }
        });

        // Threads of light between neighbours and toward the cursor.
        ctx.clearRect(0, 0, aw, ah);
        for (let i = 0; i < centers.length; i++) {
          for (let j = i + 1; j < centers.length; j++) {
            const dx = centers[i][0] - centers[j][0];
            const dy = centers[i][1] - centers[j][1];
            const d = Math.hypot(dx, dy);
            if (d < LINK_DIST) {
              ctx.strokeStyle = `rgba(111,184,242,${0.16 * (1 - d / LINK_DIST)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(centers[i][0], centers[i][1]);
              ctx.lineTo(centers[j][0], centers[j][1]);
              ctx.stroke();
            }
          }
          const dm = Math.hypot(centers[i][0] - mx, centers[i][1] - my);
          if (dm < CURSOR_DIST) {
            ctx.strokeStyle = `rgba(206,219,88,${0.22 * (1 - dm / CURSOR_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centers[i][0], centers[i][1]);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        ro.disconnect();
        arena.removeEventListener("pointermove", onMove);
        arena.removeEventListener("pointerleave", onLeave);
        draggables.forEach((d) => d.kill());
      };
    },
    { scope: ref, dependencies: [interactive], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="stack"
      aria-labelledby="ts-heading"
      className="relative overflow-hidden bg-[#060d18] py-24 text-white sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt/[0.12] blur-[140px]"
      />

      <div className="wrap relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              data-ts-head
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-sky/85"
            >
              [ Technology stack ]
            </p>
            <h2
              data-ts-head
              id="ts-heading"
              className="mt-4 max-w-xl font-display text-[clamp(2.2rem,4.6vw,4.2rem)] font-medium leading-[0.98] tracking-[-0.045em] !text-white"
            >
              The constellation we operate.
            </h2>
          </div>
          <p
            data-ts-head
            className="max-w-xs text-sm leading-relaxed text-white/55 md:pb-1 md:text-right"
          >
            {interactive
              ? "Push them around — every platform snaps back to its place in the system."
              : "Every platform has one job in the measurement loop."}
          </p>
        </div>

        {/* Arena */}
        <div
          ref={arenaRef}
          className={
            interactive
              ? "relative mt-12 h-[64vh] min-h-[30rem]"
              : "relative mt-12 flex flex-wrap items-center justify-center gap-3 py-8"
          }
        >
          {interactive && (
            <>
              <canvas
                ref={canvasRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
              <p
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 text-center font-display text-2xl font-medium leading-snug tracking-tight text-white/[0.16] sm:text-3xl"
              >
                Fourteen platforms.
                <br />
                One measurement loop.
              </p>
            </>
          )}

          {TECHS.map((t) => (
            <button
              key={t.name}
              type="button"
              data-ts-chip
              className={`group cursor-grab touch-none select-none rounded-pill border border-white/[0.14] bg-white/[0.06] backdrop-blur-md transition-colors duration-glass hover:border-sky/60 hover:bg-sky/10 active:cursor-grabbing ${
                t.big ? "px-6 py-3.5" : "px-5 py-3"
              } ${interactive ? "absolute" : "relative"}`}
              style={
                interactive
                  ? { left: `${t.x}%`, top: `${t.y}%` }
                  : undefined
              }
              aria-label={`${t.name} — ${t.role}`}
            >
              <span className="flex items-center gap-2.5">
                <t.icon
                  aria-hidden
                  className={t.big ? "h-5 w-5 shrink-0" : "h-4 w-4 shrink-0"}
                  style={{
                    color: t.brand,
                    filter: `drop-shadow(0 0 6px ${t.brand}55)`,
                  }}
                />
                <span
                  className={`block font-display font-medium leading-none tracking-tight text-white ${
                    t.big ? "text-lg" : "text-base"
                  }`}
                >
                  {t.name}
                </span>
              </span>
              {/* Role rides below the pill so the chip itself stays centered */}
              <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill border border-white/10 bg-[#0a1424]/90 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-sky/80 opacity-0 transition-opacity duration-glass group-hover:opacity-100">
                {t.role}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-8 border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/35">
          Certified partners · ad platforms audited weekly · analytics wired before launch
        </p>
      </div>
    </section>
  );
}
