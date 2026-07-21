"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import Reveal from "@/components/Reveal";
import {
  INDUSTRIES,
  LEDGER,
  ORIGIN,
  PROCESS,
  PROOF,
  STUDIO_PANELS,
  SYSTEMS,
  WHAT_SETS_APART,
} from "./about-data";

/* ════════════════════════════════════════════════════════════════
   ABOUT — a light-forward studio story with two short dark beats
   for rhythm (the studio/bench diptych, the numbers ledger), built
   from the same components and tokens as the homepage instead of a
   single wall-to-wall black page.
   ════════════════════════════════════════════════════════════════ */

export default function AboutExperience() {
  return (
    <div className="relative bg-cloud">
      <Hero />
      <Origin />
      <StudioBench />
      <Process />
      <WhatSetsUsApart />
      <IndustriesWeServe />
      <Proof />
      <Ledger />
      <Systems />
      <Cta />
    </div>
  );
}

/* ————————————————————————————— 1 · Hero (light) ————————————————————————————— */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !headlineRef.current) return;
      const split = new SplitText(headlineRef.current, {
        type: "words,lines",
        linesClass: "block overflow-hidden",
      });
      gsap
        .timeline({ delay: 0.2 })
        .fromTo(
          split.words,
          { yPercent: 60, opacity: 0, filter: "blur(10px)" },
          { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", stagger: 0.05 },
        )
        .from("[data-hero-fade]", { y: 20, opacity: 0, duration: 0.75, stagger: 0.09, ease: "power3.out" }, "-=0.7");
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-[#EAF0F7] via-[#DCE4EE] to-cloud pb-16 pt-32 md:pb-24 md:pt-40"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgba(42,95,217,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_95%_10%,rgba(206,219,88,0.12),transparent_55%)]" />
      </div>

      <div className="wrap relative z-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p
            data-hero-fade
            className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-slate"
          >
            <span className="h-px w-8 bg-ink/25" />
            The studio — Caledon, Ontario
          </p>

          <h1
            ref={headlineRef}
            className="max-w-xl font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink"
          >
            A small studio, run like an accountable machine.
          </h1>
          <p data-hero-fade className="mt-6 max-w-md text-base leading-relaxed text-slate sm:text-lg">
            Digi Clicks turns attention into booked work — website development,
            branding, social media, performance marketing, and creative design,
            run as one connected system.
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/contact" className="btn-primary">
              Book a discovery call
            </Link>
            <Link href="/services" className="btn-secondary">
              See what we build
            </Link>
          </div>

          <p data-hero-fade className="mt-10 flex items-center gap-3 text-sm text-slate">
            <span className="font-display text-lg font-semibold text-ink">10+</span>
            years of industry experience across Canada
          </p>
        </div>

        <div data-hero-fade className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-glass shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src="/images/generated/about-studio-team.png"
              alt="The Digi Clicks team working in the Caledon studio"
              fill
              sizes="(min-width:1024px) 42vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="glass-surface-strong absolute -bottom-6 -left-6 hidden max-w-[13rem] rounded-glass p-4 shadow-glass sm:block">
            <p className="font-display text-2xl font-semibold text-ink">93%</p>
            <p className="mt-1 text-xs leading-relaxed text-slate">
              of clients stay past year one — the weekly loop keeps finding upside.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 2 · Origin (light) ————————————————————————————— */
function Origin() {
  return (
    <section className="relative section-pad">
      <div className="wrap grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal x={-24} y={0}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-glass shadow-glass">
            <Image
              src={ORIGIN.image}
              alt={ORIGIN.alt}
              fill
              sizes="(min-width:1024px) 36vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal>
          <p className="eyebrow text-cobalt">[ {ORIGIN.eyebrow} ]</p>
          <h2 className="mt-4 max-w-lg font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            {ORIGIN.heading}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-slate">
            {ORIGIN.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <blockquote className="mt-8 max-w-lg border-l-2 border-cobalt/40 pl-5 font-display text-xl font-semibold leading-snug text-ink">
            “{ORIGIN.quote}”
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————— 3 · Studio & bench (diptych) ————————————————————————————— */
function BoltonClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const format = () =>
      setTime(
        new Intl.DateTimeFormat("en", {
          timeZone: "America/Toronto",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}

function StudioBench() {
  const [lean, setLean] = useState<number | null>(null);

  return (
    <section className="relative section-pad bg-white">
      <div className="wrap mb-14 max-w-2xl text-center mx-auto">
        <p className="eyebrow text-cobalt">[ Where the work happens ]</p>
        <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
          One studio. One accountable queue.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate">
          Digi Clicks runs from Caledon, Ontario, with a remote bench working
          from different locations — strategy in the room, execution around
          the clock.
        </p>
      </div>

      <div className="wrap">
        <div className="flex flex-col overflow-hidden rounded-glass shadow-glass lg:h-[62vh] lg:min-h-[420px] lg:flex-row">
          {STUDIO_PANELS.map((panel, i) => (
            <div key={panel.key} className="contents">
              <article
                onPointerEnter={() => setLean(i)}
                onPointerLeave={() => setLean(null)}
                onFocus={() => setLean(i)}
                onBlur={() => setLean(null)}
                tabIndex={0}
                aria-label={`${panel.kicker}: ${panel.heading}`}
                className="group relative min-h-[320px] overflow-hidden outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:min-h-0"
                style={{ flexGrow: lean === null ? 1 : lean === i ? 1.7 : 1 }}
              >
                <Image
                  src={panel.image}
                  alt={panel.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/35 to-night/10" />
                <div className="relative flex h-full min-h-[320px] flex-col justify-end p-7 text-white sm:p-9">
                  {i === 0 ? (
                    <p className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-none">
                      <BoltonClock />
                    </p>
                  ) : (
                    <p className="flex items-center gap-3 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-bold leading-none">
                      <span aria-hidden="true" className="relative inline-flex h-[0.32em] w-[0.32em]">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-sky opacity-60 motion-safe:animate-ping" />
                        <span className="relative inline-flex h-full w-full rounded-full bg-sky" />
                      </span>
                      Online
                    </p>
                  )}
                  <h3 className="mt-3 font-display text-2xl font-bold !text-white sm:text-3xl">
                    {panel.heading}
                    <span className="ml-3 text-sm font-medium text-fog">{panel.kicker}</span>
                  </h3>
                  <p className="mt-2 text-sm font-medium text-white/85">{panel.roles}</p>
                  <p className="mt-1 max-w-md text-sm text-fog">{panel.note}</p>
                </div>
              </article>
              {i === 0 && (
                <div
                  aria-hidden="true"
                  className="relative z-10 hidden w-1.5 shrink-0 bg-cobalt lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————— 4 · Process (light cards) ————————————————————————————— */
function Process() {
  return (
    <section id="process" className="relative section-pad bg-gradient-to-b from-cloud to-mistpanel">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="eyebrow text-cobalt">[ Our process ]</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            How we turn ideas into results.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate">
            Our process is built to create clarity, accountability, and
            measurable progress at every stage.
          </p>
        </div>

        <Reveal
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          selector="[data-proc-card]"
          stagger={0.1}
        >
          {PROCESS.map((p) => (
            <article
              key={p.num}
              data-proc-card
              className="group flex flex-col overflow-hidden rounded-glass border border-ink/8 bg-white shadow-glass transition-transform duration-glass hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width:640px) 92vw, 24vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className="absolute left-3 top-3 rounded-full border border-white/40 bg-black/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-md"
                >
                  {p.num} · {p.meta}
                </span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1" style={{ background: p.accent }} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{p.line}</p>
                <p className="mt-4 pt-4 text-xs font-medium uppercase tracking-[0.1em] text-slate/80 border-t border-ink/8">
                  {p.deliverable}
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————— 4b · What sets us apart (light) ————————————————————————————— */
function WhatSetsUsApart() {
  return (
    <section className="relative section-pad bg-mistpanel">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="eyebrow text-cobalt">[ What sets us apart ]</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            Every agency can promise great design or marketing.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate">
            What truly makes the difference is the process, expertise, and
            commitment behind every project. We combine industry experience,
            market intelligence, and a client-first approach to deliver
            solutions that create lasting business value.
          </p>
        </div>

        <Reveal
          className="mt-12 grid gap-5 sm:grid-cols-2"
          selector="[data-apart-card]"
          stagger={0.08}
        >
          {WHAT_SETS_APART.map((point) => (
            <article
              key={point.title}
              data-apart-card
              className="rounded-glass border border-ink/8 bg-white p-6 shadow-glass"
            >
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                {point.note}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————— 4c · Industries we serve (light) ————————————————————————————— */
function IndustriesWeServe() {
  return (
    <section className="relative section-pad bg-white">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="eyebrow text-cobalt">[ Industries we serve ]</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            Every industry is different.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate">
            Whether you&apos;re a startup or an established business, we build
            digital solutions tailored to your industry&apos;s unique
            challenges — around your audience, competition, and objectives.
          </p>
        </div>

        <Reveal
          className="mt-12 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"
          selector="[data-industry-row]"
          stagger={0.05}
        >
          {INDUSTRIES.map((name, i) => (
            <div key={name} data-industry-row className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-mint font-mono text-sm font-semibold text-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-base font-medium text-ink">
                {name}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————— 5 · Proof (light gallery) ————————————————————————————— */
function Proof() {
  return (
    <section className="relative section-pad bg-mistpanel">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-cobalt">[ Proof — real work, real people ]</p>
            <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              Not a stock photo in sight.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate">
            The bench, the whiteboard, the builds, and the client dashboards that
            actually moved — shot in the room where the work happens.
          </p>
        </div>

        <Reveal
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12"
          selector="[data-proof-tile]"
          stagger={0.08}
        >
          {PROOF.map((shot, i) => (
            <figure
              key={i}
              data-proof-tile
              className={`group relative overflow-hidden rounded-glass bg-ink shadow-glass ${shot.span}`}
              style={{ aspectRatio: shot.ratio }}
            >
              <Image
                src={shot.image}
                alt={shot.label}
                fill
                sizes="(max-width:768px) 92vw, 55vw"
                className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
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
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————— 6 · Ledger (dark beat) ————————————————————————————— */
function Ledger() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = parseFloat(el.dataset.count || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(decimals);
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0b2a52] py-20 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(111,184,242,0.28),transparent_60%)]" />
      </div>

      <div className="wrap relative z-10">
        <p className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-sky">
          [ The numbers we're judged on ]
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {LEDGER.map((n) => (
            <div key={n.label} className="text-center md:text-left">
              <p className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tabular-nums text-white">
                <span data-count={n.value} data-decimals={n.decimals ?? 0}>
                  {(0).toFixed(n.decimals ?? 0)}
                </span>
                <span className="text-sky">{n.suffix}</span>
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                {n.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-lg text-center font-display text-xl font-semibold leading-snug text-white/90 sm:text-2xl">
          If it can't be measured, it didn't happen.
        </p>
      </div>
    </section>
  );
}

/* ————————————————————————————— 7 · Systems (light) ————————————————————————————— */
function Systems() {
  return (
    <section className="relative section-pad bg-white">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="eyebrow text-cobalt">[ How it's actually built ]</p>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
            Artifacts, not adjectives.
          </h2>
        </div>

        <Reveal
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          selector="[data-sys-card]"
          stagger={0.1}
        >
          {SYSTEMS.map((s) => (
            <article
              key={s.title}
              data-sys-card
              className="group flex flex-col overflow-hidden rounded-glass border border-ink/8 bg-mistpanel shadow-glass"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width:640px) 92vw, 24vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-1" style={{ background: s.accent }} />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate/70">{s.spec}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate">{s.note}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ————————————————————————————— 8 · Closing CTA (light) ————————————————————————————— */
function Cta() {
  return (
    <section className="relative section-pad">
      <div className="wrap max-w-3xl text-center">
        <h2 className="font-display text-headline-sm text-ink">
          Now let's build yours.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-body text-slate">
          Every successful business begins with a strong foundation. Let&apos;s
          build a digital presence that reflects the quality of your business.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/contact" className="btn-primary">
            Book a discovery call
          </Link>
          <Link href="/services" className="btn-secondary">
            Explore services
          </Link>
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-slate">
          Caledon, Ontario · replies in 1 business day
        </p>
      </div>
    </section>
  );
}
