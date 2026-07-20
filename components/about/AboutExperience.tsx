"use client";

import Image from "next/image";
import Link from "next/link";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { bigNumbers, flagshipCurve } from "@/lib/data";
import { FeaturedViz } from "@/components/services/ShowcaseVisuals";
import {
  ACCENT,
  AUDIENCES,
  CRAFT,
  MANIFESTO,
  PROCESS,
  TECH_CORE,
  TECH_NODES,
  WALL,
} from "./about-data";

/* ════════════════════════════════════════════════════════════════
   ABOUT — a scrolling studio exhibition. Near-black, editorial, dense.
   Every section is a different composition; the work does the talking.
   ════════════════════════════════════════════════════════════════ */

export default function AboutExperience() {
  return (
    <div className="relative bg-[#070707] text-white">
      <Grain />
      <Intro />
      <Audiences />
      <Process />
      <Craft />
      <Manifesto />
      <Tech />
      <Results />
      <Wall />
    </div>
  );
}

/* ————————————————————————————— shared: grain ————————————————————————————— */
function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-soft-light"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ————————————————————————————— 1 · Intro ————————————————————————————— */
function Intro() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !headlineRef.current) return;
      const split = new SplitText(headlineRef.current, {
        type: "lines,words",
        linesClass: "block overflow-hidden",
      });
      gsap
        .timeline({ delay: 0.2 })
        .from(split.words, {
          yPercent: 120,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.05,
        })
        .from(
          "[data-intro-fade]",
          { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.75",
        );

      // chrome object parallax + drift on scroll
      gsap.to("[data-chrome]", {
        yPercent: 30,
        rotate: 24,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden pt-32 md:pt-40"
    >
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_20%_0%,rgba(77,159,255,0.28),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_95%_20%,rgba(206,219,88,0.09),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      {/* chrome sculpture */}
      <div
        data-chrome
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-[52vh] w-[52vh] rounded-full opacity-80 blur-[2px] md:right-[8%]"
        style={{
          background:
            "conic-gradient(from 210deg at 50% 50%, #2a3242, #cfd7e4, #6c7789, #eef2f7, #3b4657, #aeb8c8, #2a3242)",
          maskImage: "radial-gradient(circle at 50% 50%, #000 60%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 60%, transparent 72%)",
        }}
      />
      <div
        data-chrome
        aria-hidden
        className="pointer-events-none absolute right-[16%] top-[36%] h-24 w-24 rounded-full opacity-90 blur-[1px]"
        style={{ background: "radial-gradient(circle at 35% 30%, #fff, #8b95a6 45%, #1c222c 90%)" }}
      />

      <div className="wrap relative z-10">
        <p data-intro-fade className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          <span className="h-px w-8 bg-white/30" />
          The studio — Bolton, Ontario · est. before the hype
        </p>
        <h1
          ref={headlineRef}
          className="mt-8 max-w-[15ch] font-display text-[clamp(2.8rem,9vw,8rem)] font-semibold leading-[0.88] tracking-[-0.05em] text-white"
        >
          We build the machine, not the noise.
        </h1>
      </div>

      <div className="wrap relative z-10 mb-14 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <p data-intro-fade className="max-w-md text-lg leading-snug text-white/60">
          A small studio and a distributed bench, run as one accountable queue.
          We turn attention into booked work and file the proof every Friday.
        </p>
        <div data-intro-fade className="flex items-center gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            Scroll to enter
          </span>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
            <span className="h-2 w-2 rounded-full bg-[#4D9FFF]" />
          </span>
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 2 · Who we build for ————————————————————————————— */
function Audiences() {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-aud]").forEach((el) => {
        const q = gsap.utils.selector(el);
        gsap.from(q("[data-aud-media]"), {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
        gsap.from(q("[data-aud-img]"), {
          scale: 1.3,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
        gsap.from(q("[data-aud-fade]"), {
          y: 26,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 76%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative z-10 border-t border-white/8 py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#4D9FFF]">
              [ Not about us ]
            </p>
            <h2
              ref={headingRef}
              className="mt-4 max-w-[16ch] font-display text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
            >
              We build for the ambitious.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Three kinds of business hire us. All of them are done waiting for the
            phone to ring on its own.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {AUDIENCES.map((a, i) => (
            <article
              key={a.num}
              data-aud
              className={`group relative ${i === 1 ? "lg:mt-16" : i === 2 ? "lg:mt-8" : ""}`}
              style={{ ["--accent" as string]: a.accent }}
            >
              <div
                data-aud-media
                className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10"
              >
                <div data-aud-img className="absolute inset-0">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    sizes="(max-width:1023px) 90vw, 30vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/20 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(70% 60% at 50% 100%, ${a.accent}33, transparent 70%)` }}
                />
                <span className="absolute left-5 top-5 font-mono text-[11px] tracking-widest text-white/50">
                  {a.num}
                </span>
                <div className="absolute inset-x-5 bottom-5">
                  <span
                    className="font-mono text-[9px] uppercase tracking-[0.24em]"
                    style={{ color: a.accent }}
                  >
                    {a.tag}
                  </span>
                  <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                    {a.title}
                  </h3>
                </div>
              </div>
              <p data-aud-fade className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
                {a.line}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 3 · Process (sticky split) ————————————————————————————— */
function Process() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-proc-step]").forEach((el, i) => {
        const q = gsap.utils.selector(el);
        gsap.from(q("[data-proc-in]"), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
        });
        gsap.from(q("[data-proc-line]"), {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
        });
      });
    },
    { scope: ref },
  );

  useEffect(() => {
    const steps = gsap.utils.toArray<HTMLElement>("[data-proc-step]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const activeChapter = PROCESS[active];

  return (
    <section ref={ref} className="relative z-10 border-t border-white/8">
      <div className="wrap grid lg:grid-cols-[0.9fr_1.1fr]">
        {/* sticky left */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-screen flex-col justify-center py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
              [ Inside the process ]
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,4vw,4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              How the work
              <br />
              actually moves.
            </h2>

            <div className="mt-12 flex flex-col gap-3">
              {PROCESS.map((p, i) => (
                <div key={p.num} className="flex items-center gap-4">
                  <span
                    className="h-px transition-all duration-500"
                    style={{
                      width: active === i ? 48 : 20,
                      background: active === i ? p.accent : "rgba(255,255,255,0.2)",
                    }}
                  />
                  <span
                    className="font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-500"
                    style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.35)" }}
                  >
                    {p.num} · {p.title}
                  </span>
                </div>
              ))}
            </div>

            {/* live node echo */}
            <div className="mt-12 max-w-sm">
              <div
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                style={{ boxShadow: `inset 0 0 0 1px ${activeChapter.accent}22` }}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: activeChapter.accent }}>
                  Now · {activeChapter.title}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{activeChapter.line}</p>
              </div>
            </div>
          </div>
        </div>

        {/* scrolling right */}
        <div className="py-20 lg:py-40">
          {PROCESS.map((p, i) => (
            <div
              key={p.num}
              data-proc-step
              data-idx={i}
              className="flex min-h-[70vh] flex-col justify-center border-b border-white/8 py-14 last:border-0"
            >
              <span
                data-proc-in
                className="font-display text-[18vw] font-bold leading-none lg:text-[10vw]"
                style={{ color: p.accent, opacity: 0.12 }}
              >
                {p.num}
              </span>
              <span data-proc-line className="mt-2 block h-px w-40" style={{ background: p.accent }} />
              <h3 data-proc-in className="mt-6 font-display text-4xl font-semibold tracking-tight lg:text-5xl">
                {p.title}
              </h3>
              <p data-proc-in className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                {p.line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 4 · Craft exhibition ————————————————————————————— */
function Craft() {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
        });
      }
      gsap.from("[data-craft-tile]", {
        y: 44,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-craft-grid]", start: "top 78%" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative z-10 border-t border-white/8 py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            ref={headingRef}
            className="max-w-[14ch] font-display text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
          >
            The craft, on the wall.
          </h2>
          <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-white/40">
            Interfaces · type · engineering · measurement · material · automation
          </p>
        </div>

        <div
          data-craft-grid
          className="mt-14 grid auto-rows-[10rem] grid-cols-2 gap-4 md:grid-cols-6 md:auto-rows-[9rem]"
        >
          {CRAFT.map((tile) => (
            <CraftTile key={tile.id} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CraftTile({ tile }: { tile: (typeof CRAFT)[number] }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 6);
    rx.set(((e.clientY - b.top) / b.height - 0.5) * -6);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      data-craft-tile
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, ["--accent" as string]: tile.accent }}
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] ${tile.span} col-span-2`}
    >
      {tile.kind === "image" && tile.image ? (
        <>
          <Image
            src={tile.image}
            alt={tile.label}
            fill
            sizes="(max-width:768px) 90vw, 40vw"
            className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/80 to-transparent" />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-4">
          <div className="w-full max-w-[22rem]">
            <FeaturedViz kind={tile.kind} accent={tile.accent} />
          </div>
        </div>
      )}
      <span
        className="absolute left-4 top-4 z-10 font-mono text-[9px] uppercase tracking-[0.22em] text-white/60"
      >
        {tile.label}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${tile.accent}55` }}
      />
    </motion.div>
  );
}

/* ————————————————————————————— 5 · Manifesto ————————————————————————————— */
function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-manifesto]").forEach((el) => {
        const split = new SplitText(el, { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 120,
          opacity: 0.2,
          duration: 1,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 40%", scrub: false },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative z-10 overflow-hidden border-t border-white/8 py-28 md:py-44">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(77,159,255,0.12),transparent_65%)]" />
      </div>
      <div className="wrap relative z-10 flex flex-col gap-16 md:gap-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CEDB58]">
          [ How we think ]
        </p>
        {MANIFESTO.map((m, i) => (
          <p
            key={i}
            data-manifesto
            className={`max-w-[18ch] font-display text-[clamp(2rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] ${
              i % 2 === 1 ? "self-end text-right" : ""
            }`}
          >
            {renderAccent(m.text, m.accentWord)}
          </p>
        ))}
      </div>
    </section>
  );
}

function renderAccent(text: string, accentWord?: string) {
  if (!accentWord || !text.includes(accentWord)) return text;
  const [before, after] = text.split(accentWord);
  return (
    <>
      {before}
      <span className="text-[#4D9FFF]">{accentWord}</span>
      {after}
    </>
  );
}

/* ————————————————————————————— 6 · Technology ecosystem ————————————————————————————— */
function Tech() {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-tech-wire]", {
        drawSVG: "0%",
        duration: 1.2,
        stagger: 0.05,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 65%" },
      });
      gsap.from("[data-tech-node]", {
        scale: 0.4,
        autoAlpha: 0,
        transformOrigin: "center",
        duration: 0.7,
        stagger: 0.05,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });
      gsap.from("[data-tech-copy]", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    },
    { scope: ref },
  );

  const R = 190;
  const cx = 250;
  const cy = 250;

  return (
    <section ref={ref} className="relative z-10 border-t border-white/8 py-24 md:py-36">
      <div className="wrap grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p data-tech-copy className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#9B8CFF]">
            [ The ecosystem ]
          </p>
          <h2 data-tech-copy className="mt-4 max-w-[15ch] font-display text-[clamp(2rem,4.6vw,4rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            One connected system, not a stack of tools.
          </h2>
          <p data-tech-copy className="mt-6 max-w-md text-base leading-relaxed text-white/55">
            Next.js and GSAP on the surface, AI automation and analytics
            underneath. Every part reports into the same growth engine — so the
            number on Friday is the whole truth, not a slice of it.
          </p>
          <ul data-tech-copy className="mt-8 flex flex-wrap gap-2">
            {TECH_NODES.map((n) => (
              <li
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-default rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300"
                style={{
                  borderColor: hover === n.id ? n.accent : "rgba(255,255,255,0.12)",
                  color: hover === n.id ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {n.label}
              </li>
            ))}
          </ul>
        </div>

        {/* diagram */}
        <div className="relative mx-auto w-full max-w-[34rem]">
          <svg viewBox="0 0 500 500" className="w-full" aria-hidden>
            <defs>
              <radialGradient id="tech-core-g" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4D9FFF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#4D9FFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.06)" />
            {TECH_NODES.map((n) => {
              const rad = (n.angle * Math.PI) / 180;
              const x = cx + R * Math.cos(rad);
              const y = cy + R * Math.sin(rad);
              const on = hover === n.id;
              return (
                <g key={n.id}>
                  <path
                    data-tech-wire
                    d={`M${cx},${cy} L${x},${y}`}
                    stroke={n.accent}
                    strokeWidth={on ? 1.6 : 1}
                    strokeOpacity={on ? 0.9 : 0.35}
                  />
                  <g
                    data-tech-node
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: "default" }}
                  >
                    <circle cx={x} cy={y} r={on ? 34 : 30} fill="#0d0f15" stroke={n.accent} strokeOpacity={on ? 1 : 0.5} />
                    <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={on ? "#fff" : "rgba(255,255,255,0.7)"}>
                      {n.label.length > 8 ? n.label.slice(0, 7) + "…" : n.label}
                    </text>
                  </g>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r="70" fill="url(#tech-core-g)" />
            <circle data-tech-node cx={cx} cy={cy} r="46" fill="#0d0f15" stroke="#4D9FFF" />
            <text data-tech-node x={cx} y={cy - 2} textAnchor="middle" fontSize="12" fontFamily="var(--font-bricolage), sans-serif" fontWeight="600" fill="#fff">
              Growth
            </text>
            <text data-tech-node x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fontFamily="var(--font-bricolage), sans-serif" fontWeight="600" fill="#fff">
              Engine
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 7 · Selected results ————————————————————————————— */
function Results() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // count-ups
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = parseFloat(el.dataset.count || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });
      // chart draw
      gsap.from("[data-chart-line]", {
        drawSVG: "0%",
        duration: 1.6,
        ease: "power2.inOut",
        scrollTrigger: { trigger: "[data-chart]", start: "top 78%" },
      });
      gsap.from("[data-chart-area]", {
        autoAlpha: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-chart]", start: "top 78%" },
      });
      gsap.from("[data-results-row]", {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    },
    { scope: ref },
  );

  // build chart path
  const max = Math.max(...flagshipCurve);
  const pts = flagshipCurve.map((v, i) => {
    const x = (i / (flagshipCurve.length - 1)) * 320;
    const y = 120 - (v / max) * 108;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L320,120 L0,120 Z`;

  return (
    <section ref={ref} className="relative z-10 border-t border-white/8 py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[14ch] font-display text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
            The proof, in numbers.
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            No testimonials theatre. The lines the studio is actually judged on.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* metrics ledger */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/8">
            {bigNumbers.map((n, i) => (
              <div key={n.label} data-results-row className="bg-[#0a0b0f] p-6 md:p-8">
                <p className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-none tabular-nums text-white">
                  <span data-count={n.value} data-decimals={n.decimals ?? 0}>
                    {(0).toFixed(n.decimals ?? 0)}
                  </span>
                  <span className="text-[#4D9FFF]">{n.suffix}</span>
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  {n.label}
                </p>
                <p className="mt-2 max-w-[26ch] text-xs leading-relaxed text-white/35">{n.note}</p>
              </div>
            ))}
          </div>

          {/* growth chart */}
          <div data-chart className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b0f] p-6 md:p-8" data-results-row>
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                Active Coachlines — enquiries / mo
              </p>
              <p className="font-display text-2xl font-semibold text-[#CEDB58]">
                <span data-count="140" data-decimals="0">0</span>+
              </p>
            </div>
            <svg viewBox="0 0 320 120" className="mt-6 w-full" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CEDB58" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#CEDB58" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path data-chart-area d={area} fill="url(#chart-fill)" />
              <path data-chart-line d={line} fill="none" stroke="#CEDB58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4 flex justify-between font-mono text-[9px] uppercase tracking-widest text-white/35">
              <span>Month 1 · 8</span>
              <span style={{ color: ACCENT.lime }}>Month 11 · 140+</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 8 · Creative wall ————————————————————————————— */
function Wall() {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
        });
      }
      gsap.from("[data-wall-item]", {
        y: 60,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-wall-grid]", start: "top 82%" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative z-10 border-t border-white/8 py-24 md:py-36">
      <div className="wrap">
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            [ The wall ]
          </p>
          <h2
            ref={headingRef}
            className="mx-auto mt-5 max-w-[16ch] font-display text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
          >
            Everything we make, in one place.
          </h2>
        </div>

        <div
          data-wall-grid
          className="mt-16 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4"
        >
          {WALL.map((w, i) => (
            <figure
              key={i}
              data-wall-item
              className="group relative block break-inside-avoid overflow-hidden rounded-xl border border-white/10"
              style={{ aspectRatio: i % 3 === 0 ? "3 / 4" : i % 3 === 1 ? "1 / 1" : "4 / 5" }}
            >
              <Image
                src={w.image}
                alt={w.label}
                fill
                sizes="(max-width:768px) 45vw, 22vw"
                className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <figcaption className="absolute bottom-3 left-3 translate-y-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/80 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {w.label}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* closing */}
        <div className="mt-28 text-center">
          <p className="mx-auto max-w-[20ch] font-display text-[clamp(1.8rem,4vw,3.4rem)] font-semibold leading-[1] tracking-[-0.03em] text-white">
            Now let's build yours.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#4D9FFF] py-4 pl-7 pr-4 text-sm font-medium text-[#05070c] transition-colors duration-300 hover:bg-[#CEDB58]"
            >
              Start a free growth audit
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#05070c] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
