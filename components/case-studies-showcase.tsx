"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { img } from "@/lib/images";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ————————————————————————————————————————————————————————————————
   CASE STUDIES — each project is a mini landing page: editorial
   image, challenge, solution, results, stack. Projects swap with a
   choreographed GSAP transition (clip wipe + masked text cascade).
   ———————————————————————————————————————————————————————————————— */

type Study = {
  id: string;
  client: string;
  industry: string;
  year: string;
  challenge: string;
  solution: string;
  results: Array<{ value: string; label: string }>;
  stack: string[];
  image: string;
  alt: string;
};

const LEGACY_STUDIES = [
  {
    id: "harrier",
    client: "Harrier Transport",
    industry: "Freight & logistics",
    year: "2025",
    challenge:
      "Referrals kept the trucks half-full. No paid channel, no landing pages, no way to turn demand up when lanes went quiet.",
    solution:
      "Paid search rebuilt from a teardown of wasted spend, with landing pages that match the ad promise and weekly bid decisions documented in plain English.",
    results: [
      { value: "−41%", label: "cost per lead" },
      { value: "Paid", label: "demand, on a dial" },
      { value: "Weekly", label: "optimization loop" },
    ],
    stack: ["Google Ads", "GA4", "GTM", "Landing pages"],
    image: img.caseHarrier,
    alt: "Semi truck on an open highway at dusk",
  },
  {
    id: "activecoach",
    client: "Active Coachlines",
    industry: "Charter transport",
    year: "2024–25",
    challenge:
      "Eight enquiries a month from a site that buried fleet options, trip details, and the quote form three clicks deep.",
    solution:
      "One focused booking path from search intent to charter quote — local search, a rebuilt site, and tracking on every step of the journey.",
    results: [
      { value: "8 → 140+", label: "enquiries / month" },
      { value: "17×", label: "pipeline growth" },
      { value: "1", label: "connected route" },
    ],
    stack: ["Next.js", "Local SEO", "GA4", "CallRail"],
    image: img.caseActivecoach,
    alt: "Charter coach fleet lined up outside a depot",
  },
  {
    id: "phantom",
    client: "Phantom Logistics",
    industry: "Freight & logistics",
    year: "2025",
    challenge:
      "Shippers couldn't find them, and when they did, the services read like an internal org chart instead of an offer.",
    solution:
      "Freight services reorganized around buyer intent — SEO architecture, rewritten content, and a quote path that answers the questions shippers actually search.",
    results: [
      { value: "P1", label: "rankings, core lanes" },
      { value: "SEO", label: "as lead channel" },
      { value: "Quote", label: "conversion path" },
    ],
    stack: ["SEO", "Next.js", "Content engine", "Search Console"],
    image: img.caseSmartx,
    alt: "Warehouse and freight operations floor",
  },
  {
    id: "bistro",
    client: "Indian Bistro Barrie",
    industry: "Restaurant · Barrie, ON",
    year: "2025",
    challenge:
      "Great food, invisible online. Local diners landed on listicles and third-party apps instead of the restaurant's own tables.",
    solution:
      "A local discovery path built to move diners from search to menu, directions, and ordering without friction — plus social content with a commercial job.",
    results: [
      { value: "Top 3", label: "local map pack" },
      { value: "Menu", label: "one tap away" },
      { value: "Direct", label: "orders, not apps" },
    ],
    stack: ["Local SEO", "GBP", "WordPress", "Social content"],
    image: img.caseChw,
    alt: "Warmly lit restaurant table setting",
  },
];

const STUDIES: Study[] = [
  {
    id: "activecoach",
    client: "Active Coachlines",
    industry: "Charter transportation",
    year: "2024–25",
    challenge:
      "The website buried fleet options, trip details, and the quote form, leaving high-intent charter searches without a clear booking route.",
    solution:
      "We rebuilt the journey around charter intent: focused service pages, local search visibility, a direct quote path, and tracking across every step.",
    results: [
      { value: "8 → 140+", label: "enquiries / month" },
      { value: "17×", label: "pipeline growth" },
      { value: "1", label: "connected booking path" },
    ],
    stack: ["Web strategy", "Local SEO", "Lead generation", "Analytics"],
    image: "/activecoach.png",
    alt: "Active Coach motor coach photographed in Bolton, Ontario",
  },
  {
    id: "phantom",
    client: "Phantom Logistics",
    industry: "Freight & logistics",
    year: "2025",
    challenge:
      "A strong fleet and recognizable identity needed a digital presence that made services, coverage, and capacity immediately clear to shippers.",
    solution:
      "We organized the experience around shipper intent, sharpened the service messaging, and built a direct route from search discovery to a freight quote.",
    results: [
      { value: "Search", label: "discovery system" },
      { value: "Clear", label: "service architecture" },
      { value: "Quote", label: "primary action" },
    ],
    stack: ["SEO", "Web development", "Content strategy", "Lead capture"],
    image: "/phantom.png",
    alt: "Phantom Logistics tractor trailer at an Ontario freight terminal",
  },
  {
    id: "smartx",
    client: "SmartX Logistics",
    industry: "Transportation & logistics",
    year: "2025",
    challenge:
      "SmartX needed its digital presence to communicate the same confidence, speed, and cross-market reach visible in its fleet operation.",
    solution:
      "A sharper brand-led website structure, search-ready service pages, and a focused enquiry journey turned a broad logistics offer into a clear commercial story.",
    results: [
      { value: "Brand", label: "stronger presence" },
      { value: "Web", label: "clear service story" },
      { value: "Lead", label: "focused enquiry path" },
    ],
    stack: ["Brand strategy", "Web design", "SEO", "Lead generation"],
    image: "/smartx.png",
    alt: "SmartX Logistics truck crossing a modern city bridge at sunset",
  },
];

export default function CaseStudiesShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const busy = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });
      intro
        .from("[data-cs-heading]", { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.1 })
        .from(
          "[data-cs-stage]",
          { clipPath: "inset(6% 6% 6% 6% round 20px)", autoAlpha: 0, duration: 1 },
          0.2,
        )
        .from("[data-cs-nav]", { y: 18, autoAlpha: 0, duration: 0.6 }, 0.45);
    },
    { scope: ref },
  );

  const go = (next: number) => {
    if (busy.current || next === active) return;
    const scope = ref.current;
    if (!scope) return;

    if (prefersReducedMotion()) {
      setActive(next);
      return;
    }

    busy.current = true;
    const dir = next > active ? 1 : -1;
    const media = scope.querySelector("[data-cs-media]");
    const rows = scope.querySelectorAll("[data-cs-row]");

    gsap
      .timeline({
        onComplete: () => {
          setActive(next);
          requestAnimationFrame(() => {
            const tlIn = gsap.timeline({
              defaults: { ease: "power3.out" },
              onComplete: () => {
                busy.current = false;
              },
            });
            tlIn
              .fromTo(
                media,
                { clipPath: `inset(0 ${dir > 0 ? "0 0 100%" : "100% 0 0"} )`, scale: 1.06 },
                {
                  clipPath: "inset(0 0% 0 0%)",
                  scale: 1,
                  duration: 0.9,
                  ease: "power3.inOut",
                },
              )
              .fromTo(
                rows,
                { yPercent: 110 },
                { yPercent: 0, duration: 0.65, stagger: 0.07 },
                0.25,
              );
          });
        },
      })
      .to(rows, {
        yPercent: -110,
        duration: 0.4,
        stagger: 0.04,
        ease: "power2.in",
      })
      .to(
        media,
        {
          clipPath: `inset(0 ${dir > 0 ? "100% 0 0" : "0 0 100%"})`,
          duration: 0.5,
          ease: "power3.in",
        },
        0.05,
      );
  };

  const study = STUDIES[active];

  return (
    <section
      ref={ref}
      id="results"
      aria-labelledby="cs-heading"
      className="relative overflow-hidden bg-[#f6f8fc] py-24 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[26rem] w-[26rem] rounded-full bg-sky/[0.14] blur-[120px]"
      />

      <div className="wrap relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              data-cs-heading
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-cobalt"
            >
              [ Case studies ]
            </p>
            <h2
              data-cs-heading
              id="cs-heading"
              className="mt-4 max-w-2xl font-display text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink"
            >
              Work that answers to revenue.
            </h2>
          </div>
          <p
            data-cs-heading
            className="max-w-xs text-sm leading-relaxed text-slate md:pb-1 md:text-right"
          >
            Three transportation brands, three distinct growth systems — one
            accountable measurement loop underneath them all.
          </p>
        </div>

        {/* Stage */}
        <div
          data-cs-stage
          className="relative mt-12 grid gap-0 overflow-hidden rounded-[22px] border border-ink/[0.07] bg-white shadow-[0_40px_100px_rgba(15,27,45,0.10)] lg:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
        >
          {/* Media */}
          <div className="relative min-h-[18rem] overflow-hidden bg-[#0a1424] lg:min-h-[36rem]">
            <div data-cs-media className="absolute inset-0 will-change-[clip-path,transform]">
              <Image
                key={study.id}
                src={study.image}
                alt={study.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(200deg,transparent_50%,rgba(6,14,26,0.55)_100%)]"
              />
            </div>
            <div className="absolute bottom-5 left-5 z-10 flex items-center gap-3">
              <span className="rounded-pill border border-white/25 bg-black/30 px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                {study.industry}
              </span>
              <span className="rounded-pill border border-white/25 bg-black/30 px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                {study.year}
              </span>
            </div>
          </div>

          {/* Narrative */}
          <div className="flex flex-col justify-between gap-8 p-6 sm:p-9 lg:p-11">
            <div>
              <div className="overflow-hidden">
                <h3
                  data-cs-row
                  className="font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl"
                >
                  {study.client}
                </h3>
              </div>

              <div className="mt-7 space-y-6">
                <div className="overflow-hidden">
                  <div data-cs-row>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cobalt">
                      The challenge
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate">
                      {study.challenge}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div data-cs-row>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cobalt">
                      Our solution
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate">
                      {study.solution}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 overflow-hidden">
                <div data-cs-row className="grid grid-cols-3 gap-4 border-t border-ink/10 pt-5">
                  {study.results.map((r) => (
                    <div key={r.label}>
                      <p className="font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
                        {r.value}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate/70">
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 overflow-hidden">
                <div data-cs-row className="flex flex-wrap gap-2">
                  {study.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-pill bg-[#eef2f8] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/65"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <div data-cs-row>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 text-sm font-medium text-ink transition-colors hover:text-cobalt"
                >
                  Start a project like this
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          data-cs-nav
          className="mt-8 flex flex-wrap items-center justify-between gap-5"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            {STUDIES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-pressed={i === active}
                aria-label={`View ${s.client} case study`}
                className={`rounded-pill px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-glass ${
                  i === active
                    ? "bg-ink text-white"
                    : "text-slate hover:bg-ink/[0.06] hover:text-ink"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
                <span className="ml-2 hidden sm:inline">{s.client}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go((active + STUDIES.length - 1) % STUDIES.length)}
              aria-label="Previous case study"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-glass hover:border-cobalt hover:bg-cobalt hover:text-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go((active + 1) % STUDIES.length)}
              aria-label="Next case study"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-glass hover:border-cobalt hover:bg-cobalt hover:text-white"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
