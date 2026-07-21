"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion, scrollToSection } from "@/lib/gsap";
import { bigNumbers } from "@/lib/data";
import {
  ACCENT,
  MANIFESTO,
  PROCESS,
  PROOF,
  STATEMENT_PHOTO,
  SYSTEMS,
} from "./about-data";

/* ════════════════════════════════════════════════════════════════
   ABOUT — an alternating dark → white → dark narrative. Each chapter
   is a distinct surface so scroll has rhythm, and every section is
   carried by real photography instead of mockups or empty panels.
   ════════════════════════════════════════════════════════════════ */

export default function AboutExperience() {
  return (
    <div className="relative bg-[#070707]">
      <Hero />
      <Process />
      <Proof />
      <Systems />
      <Statement />
      <Closing />
    </div>
  );
}

/* grain, dark sections only */
function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] mix-blend-soft-light"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ————————————————————————————— 1 · Hero (dark) ————————————————————————————— */
function Hero() {
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
        .from(split.words, { yPercent: 120, duration: 1.1, ease: "power4.out", stagger: 0.05 })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.75");

      gsap.to("[data-chrome]", {
        yPercent: 30,
        rotate: 20,
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
      className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#070707] pt-32 text-white md:pt-40"
    >
      <Grain />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_20%_0%,rgba(77,159,255,0.28),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_95%_20%,rgba(206,219,88,0.09),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

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
        <p data-hero-fade className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
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
        <p data-hero-fade className="max-w-md text-lg leading-snug text-white/60">
          A small studio and a distributed bench, run as one accountable queue.
          We turn attention into booked work and file the proof every Friday.
        </p>
        <button
          data-hero-fade
          onClick={() => scrollToSection("#process")}
          className="group flex items-center gap-4"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
            Scroll to enter
          </span>
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
            <span className="h-2 w-2 rounded-full bg-[#4D9FFF] transition-transform duration-500 group-hover:translate-y-1" />
          </span>
        </button>
      </div>
    </section>
  );
}

/* ————————————————————————————— 2 · Process (dark) ————————————————————————————— */
function Process() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-proc-step]").forEach((el) => {
        const q = gsap.utils.selector(el);
        gsap.from(q("[data-proc-media]"), {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
        gsap.from(q("[data-proc-img]"), {
          scale: 1.25,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
        gsap.from(q("[data-proc-in]"), {
          y: 34,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 72%" },
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
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="process" ref={ref} className="relative overflow-hidden bg-[#070707] py-24 text-white md:py-32">
      <Grain />
      <div className="wrap relative z-10 lg:grid lg:grid-cols-[290px_1fr] lg:gap-16">
        {/* sticky nav rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
              [ Inside the process ]
            </p>
            <h2 className="mt-5 font-display text-[clamp(2rem,3vw,3rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
              How the work
              <br />
              actually moves.
            </h2>

            <nav className="mt-12 flex flex-col gap-1">
              {PROCESS.map((p, i) => (
                <button
                  key={p.num}
                  onClick={() => scrollToSection(`#process-${p.num}`, -110)}
                  className="group flex items-center gap-4 py-2 text-left"
                >
                  <span
                    className="h-px transition-all duration-500"
                    style={{ width: active === i ? 44 : 18, background: active === i ? p.accent : "rgba(255,255,255,0.22)" }}
                  />
                  <span
                    className="font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-500"
                    style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.4)" }}
                  >
                    {p.num} · {p.title}
                  </span>
                </button>
              ))}
            </nav>

            <p className="mt-12 max-w-[16rem] text-sm leading-relaxed text-white/40">
              One accountable queue from first audit to the Friday report — no
              handoffs, no black boxes.
            </p>
          </div>
        </aside>

        {/* steps with real photography */}
        <div className="flex flex-col gap-20 md:gap-28">
          {PROCESS.map((p, i) => (
            <article key={p.num} id={`process-${p.num}`} data-proc-step data-idx={i} className="scroll-mt-28">
              <figure
                data-proc-media
                className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10"
                style={{ boxShadow: `inset 0 0 0 1px ${p.accent}20` }}
              >
                <div data-proc-img className="absolute inset-0">
                  <Image
                    src={p.image}
                    alt={p.shot}
                    fill
                    sizes="(max-width:1023px) 92vw, 60vw"
                    className="object-cover grayscale-[0.35]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/25 to-transparent" />
                {/* number label — small, not the hero */}
                <span
                  className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur-md"
                  style={{ color: p.accent }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent }} />
                  {p.num} · {p.meta}
                </span>
                <figcaption className="absolute bottom-5 left-5 right-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                  {p.shot}
                </figcaption>
              </figure>

              <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <h3 data-proc-in className="font-display text-4xl font-semibold tracking-tight lg:text-6xl">
                    {p.title}
                  </h3>
                  <p data-proc-in className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
                    {p.line}
                  </p>
                </div>
                <div
                  data-proc-in
                  className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  style={{ boxShadow: `inset 0 0 0 1px ${p.accent}18` }}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">Deliverable</span>
                  <span className="h-3 w-px bg-white/15" />
                  <span className="text-sm font-medium text-white/85">{p.deliverable}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 3 · Proof (white) ————————————————————————————— */
function Proof() {
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
      gsap.utils.toArray<HTMLElement>("[data-proof-tile]").forEach((el) => {
        const q = gsap.utils.selector(el);
        gsap.from(el, {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
        // subtle parallax on the inner image
        gsap.fromTo(
          q("[data-proof-img]"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative bg-[#f2f1ec] py-24 text-[#0e0f12] md:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#2A5FD9]">
              [ Proof — real work, real people ]
            </p>
            <h2
              ref={headingRef}
              className="mt-4 max-w-[16ch] font-display text-[clamp(2.2rem,5.4vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-[#0b0c0f]"
            >
              Not a stock photo in sight.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#4a4e57]">
            The bench, the whiteboard, the builds, and the client dashboards that
            actually moved — shot in the room where the work happens.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12">
          {PROOF.map((shot, i) => (
            <figure
              key={i}
              data-proof-tile
              className={`group relative overflow-hidden rounded-2xl bg-black ${shot.span}`}
              style={{ aspectRatio: shot.ratio }}
            >
              <div data-proof-img className="absolute inset-[-8%]">
                <Image
                  src={shot.image}
                  alt={shot.label}
                  fill
                  sizes="(max-width:768px) 92vw, 55vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-white">{shot.label}</span>
                <span
                  className="rounded-full border border-white/25 bg-black/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-md"
                  style={{ color: shot.accent }}
                >
                  {shot.meta}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 4 · Systems (light gray) ————————————————————————————— */
function Systems() {
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
      gsap.from("[data-sys-card]", {
        y: 48,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-sys-grid]", start: "top 82%" },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative border-y border-black/5 bg-[#e8e7e1] py-24 text-[#0e0f12] md:py-32">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#2A5FD9]">
            [ How it's actually built ]
          </p>
          <h2
            ref={headingRef}
            className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-[#0b0c0f]"
          >
            Artifacts, not adjectives.
          </h2>
        </div>

        <div data-sys-grid className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SYSTEMS.map((s) => (
            <article
              key={s.title}
              data-sys-card
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width:640px) 92vw, 24vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1"
                  style={{ background: s.accent }}
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-[#0b0c0f]">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#7a7e87" }}>
                  {s.spec}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#4a4e57]">{s.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 5 · Statement (dark, photo break) ————————————————————————————— */
function Statement() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-statement]").forEach((el) => {
        const split = new SplitText(el, { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 120,
          opacity: 0.15,
          duration: 1,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });
      gsap.from("[data-statement-img]", {
        scale: 1.2,
        ease: "none",
        scrollTrigger: { trigger: "[data-statement-photo]", start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#070707] text-white">
      <Grain />
      {/* statement 1 */}
      <div className="wrap relative z-10 py-28 md:py-40">
        <p className="mb-14 font-mono text-[10px] uppercase tracking-[0.3em] text-[#CEDB58]">
          [ How we think ]
        </p>
        <p
          data-statement
          className="max-w-[18ch] font-display text-[clamp(2rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
        >
          {renderAccent(MANIFESTO[0].text, MANIFESTO[0].accentWord)}
        </p>
      </div>

      {/* full-bleed photo break */}
      <div data-statement-photo className="relative h-[60vh] w-full overflow-hidden md:h-[80vh]">
        <div data-statement-img className="absolute inset-0">
          <Image
            src={STATEMENT_PHOTO}
            alt="Inside the Bolton studio"
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/60" />
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/70">
          The room where the work happens
        </p>
      </div>

      {/* statements 2 & 3 */}
      <div className="wrap relative z-10 flex flex-col gap-16 py-28 md:gap-24 md:py-40">
        <p
          data-statement
          className="max-w-[18ch] self-end text-right font-display text-[clamp(2rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
        >
          {renderAccent(MANIFESTO[1].text, MANIFESTO[1].accentWord)}
        </p>
        <p
          data-statement
          className="max-w-[18ch] font-display text-[clamp(2rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.04em]"
        >
          {renderAccent(MANIFESTO[2].text, MANIFESTO[2].accentWord)}
        </p>
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

/* ————————————————————————————— 6 · Closing (brand blue) ————————————————————————————— */
function Closing() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const h = ref.current?.querySelector("h2");
      if (h) {
        const split = new SplitText(h, { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 120,
          duration: 0.9,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = parseFloat(el.dataset.count || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0b2a52] py-28 text-white md:py-40"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(77,159,255,0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_100%,rgba(206,219,88,0.14),transparent_60%)]" />
      </div>

      <div className="wrap relative z-10">
        {/* metrics band */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-b border-white/15 pb-14 md:grid-cols-4">
          {bigNumbers.map((n) => (
            <div key={n.label}>
              <p className="font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-none tabular-nums text-white">
                <span data-count={n.value} data-decimals={n.decimals ?? 0}>
                  {(0).toFixed(n.decimals ?? 0)}
                </span>
                <span className="text-[#CEDB58]">{n.suffix}</span>
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                {n.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <h2 className="max-w-[16ch] font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
            Now let's build yours.
          </h2>
          <div className="shrink-0">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-white py-4 pl-7 pr-4 text-sm font-semibold text-[#0b2a52] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Free growth audit
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0b2a52] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              Bolton, Ontario · replies in 1 business day
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
