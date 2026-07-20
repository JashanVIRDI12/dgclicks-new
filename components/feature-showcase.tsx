"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Enquiries per month across the engagement; the rebuild ships at REBUILD_INDEX. */
const MONTHLY = [8, 9, 11, 14, 24, 38, 57, 78, 96, 114, 129, 142];
const REBUILD_INDEX = 3;

const W = 640;
const H = 280;
const PAD_X = 20;
const PAD_TOP = 34;
const PAD_BOTTOM = 36;

const proofSteps = [
  {
    label: "Before",
    value: "8",
    copy: "qualified enquiries per month",
  },
  {
    label: "The build",
    value: "Search + site",
    copy: "one connected route from intent to quote",
  },
  {
    label: "After",
    value: "140+",
    copy: "qualified enquiries per month",
  },
];

function buildPoints(data: number[]) {
  const max = Math.max(...data) * 1.12;
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_TOP - PAD_BOTTOM;
  return data.map((v, i) => ({
    x: PAD_X + (i * plotW) / (data.length - 1),
    y: PAD_TOP + (1 - v / max) * plotH,
    v,
  }));
}

/** Catmull-Rom → cubic bezier, for a smooth line through every point. */
function smoothPath(pts: { x: number; y: number }[]) {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${
      p2.x - (p3.x - p1.x) / 6
    } ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function FeatureShowcase() {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const pts = buildPoints(MONTHLY);
  const beforePts = pts.slice(0, REBUILD_INDEX + 1);
  const afterPts = pts.slice(REBUILD_INDEX);
  const afterLine = smoothPath(afterPts);
  const afterArea = `${afterLine} L ${pts[pts.length - 1].x} ${H - PAD_BOTTOM} L ${
    afterPts[0].x
  } ${H - PAD_BOTTOM} Z`;
  const rebuildX = pts[REBUILD_INDEX].x;
  const last = pts[pts.length - 1];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: ref.current, start: "top 74%" },
      });

      intro
        .from("[data-proof-heading]", {
          y: 34,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
        })
        .from(
          "[data-proof-media]",
          {
            y: 44,
            scale: 0.965,
            opacity: 0,
            duration: 1,
          },
          0.16,
        )
        .from(
          "[data-panel-row]",
          { y: 18, opacity: 0, duration: 0.6, stagger: 0.09 },
          0.45,
        )
        .from(
          "[data-proof-copy]",
          { x: 38, opacity: 0, duration: 0.8 },
          0.3,
        )
        .from(
          "[data-proof-step]",
          { y: 24, opacity: 0, duration: 0.68, stagger: 0.1 },
          0.42,
        )
        .from(
          "[data-proof-rule]",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.75,
            stagger: 0.1,
          },
          0.46,
        );

      // The chart tells the story on its own: flat line, rebuild marker
      // sweeps in, then the after-line climbs while the counter runs up.
      const beforePath = ref.current?.querySelector<SVGPathElement>(
        "[data-trend-before]",
      );
      const afterPath = ref.current?.querySelector<SVGPathElement>(
        "[data-trend-after]",
      );
      const counter =
        ref.current?.querySelector<HTMLElement>("[data-proof-counter]");

      const chart = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-proof-media]",
          start: "top 72%",
          once: true,
        },
      });

      if (beforePath && afterPath) {
        const beforeLen = beforePath.getTotalLength();
        const afterLen = afterPath.getTotalLength();
        chart
          .fromTo(
            beforePath,
            { strokeDasharray: beforeLen, strokeDashoffset: beforeLen },
            {
              strokeDashoffset: 0,
              duration: 0.7,
              ease: "power1.inOut",
            },
            0.15,
          )
          .from(
            "[data-rebuild-marker]",
            {
              scaleY: 0,
              transformOrigin: "center bottom",
              duration: 0.55,
              ease: "power2.out",
            },
            0.75,
          )
          .fromTo(
            afterPath,
            { strokeDasharray: afterLen, strokeDashoffset: afterLen },
            {
              strokeDashoffset: 0,
              duration: 1.7,
              ease: "power2.inOut",
            },
            1.0,
          )
          .from(
            "[data-trend-fill]",
            { opacity: 0, duration: 0.8, ease: "power1.out" },
            1.6,
          )
          .from(
            "[data-chart-note]",
            { opacity: 0, y: 6, duration: 0.5, stagger: 0.12 },
            1.3,
          );
      }

      if (counter) {
        counter.textContent = String(MONTHLY[0]);
        const state = { v: MONTHLY[0] };
        chart.to(
          state,
          {
            v: MONTHLY[MONTHLY.length - 1],
            duration: 2.4,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => {
              counter.textContent = String(Math.round(state.v));
            },
          },
          0.9,
        );
      }

      gsap.to("[data-endpoint-pulse]", {
        attr: { r: 14 },
        opacity: 0,
        duration: 1.7,
        repeat: -1,
        ease: "power1.out",
      });

      gsap.fromTo(
        "[data-proof-signal]",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            end: "bottom 35%",
            scrub: 0.8,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="showcase"
      className="relative overflow-hidden bg-[#e9eef5] py-20 sm:py-24 lg:py-28"
      aria-labelledby="showcase-heading"
    >
      <div
        aria-hidden
        className="absolute -right-40 top-8 h-[28rem] w-[28rem] rounded-full bg-sky/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="absolute -left-48 bottom-0 h-[24rem] w-[24rem] rounded-full bg-cobalt/10 blur-[100px]"
      />

      <div className="wrap relative">
        <div className="flex flex-col gap-7 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              data-proof-heading
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-cobalt"
            >
              [ Proof / Lead generation ]
            </p>
            <h2
              data-proof-heading
              id="showcase-heading"
              className="mt-4 max-w-3xl font-display text-[clamp(2.4rem,5vw,4.8rem)] font-medium leading-[0.98] tracking-[-0.045em] text-ink"
            >
              Same business. New pipeline. 17× the enquiries.
            </h2>
          </div>
          <p
            data-proof-heading
            className="max-w-sm text-sm leading-relaxed text-slate md:pb-1"
          >
            Watch twelve months of one client&apos;s pipeline — before and
            after search and enquiry worked as a single measurable system.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,7.4fr)_minmax(20rem,4.6fr)] lg:items-center lg:gap-12 xl:gap-16">
          <div
            data-proof-media
            className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#081423] p-5 shadow-[0_30px_80px_rgba(3,10,20,0.28)] will-change-transform sm:p-7"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cobalt/25 blur-[90px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-sky/10 blur-[90px]"
            />

            <div
              data-panel-row
              className="relative flex flex-wrap items-center justify-between gap-3"
            >
              <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-white/70">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#cedb58] shadow-[0_0_14px_rgba(206,219,88,0.9)]"
                />
                Active Coachlines · Lead pipeline
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                12-month view
              </p>
            </div>

            <div
              data-panel-row
              className="relative mt-6 flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-sky/75">
                  Qualified enquiries / mo
                </p>
                <p className="mt-1.5 font-display text-5xl font-medium leading-none tracking-[-0.04em] text-white sm:text-6xl">
                  <span data-proof-counter>142</span>
                </p>
              </div>
              <p className="rounded-pill border border-[#cedb58]/30 bg-[#cedb58]/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[#dbe77a]">
                ▲ 17× in 12 months
              </p>
            </div>

            <div className="relative mt-5">
              <p className="sr-only">
                Line chart of qualified enquiries per month over twelve months:{" "}
                {MONTHLY.join(", ")}. The connected search and site system
                launched in month {REBUILD_INDEX + 1}; enquiries grew from{" "}
                {MONTHLY[0]} to {MONTHLY[MONTHLY.length - 1]} per month.
              </p>
              <svg
                viewBox={`0 0 ${W} ${H}`}
                role="img"
                aria-label={`Enquiries grew from ${MONTHLY[0]} to ${
                  MONTHLY[MONTHLY.length - 1]
                } per month after the rebuild`}
                className="w-full"
              >
                <defs>
                  <linearGradient id="proof-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6FB8F2" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#6FB8F2" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {[0.25, 0.5, 0.75].map((t) => (
                  <line
                    key={t}
                    x1={PAD_X}
                    x2={W - PAD_X}
                    y1={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
                    y2={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
                    stroke="#ffffff"
                    strokeOpacity="0.07"
                  />
                ))}

                {/* Before zone sits dimmed behind the story */}
                <rect
                  x={PAD_X}
                  y={PAD_TOP - 10}
                  width={rebuildX - PAD_X}
                  height={H - PAD_TOP - PAD_BOTTOM + 10}
                  fill="#ffffff"
                  opacity="0.025"
                />

                <path data-trend-fill d={afterArea} fill="url(#proof-fill)" />
                <path
                  data-trend-before
                  d={smoothPath(beforePts)}
                  fill="none"
                  stroke="#8B93A7"
                  strokeOpacity="0.75"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                />
                <path
                  data-trend-after
                  d={afterLine}
                  fill="none"
                  stroke="#6FB8F2"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                />

                {/* Rebuild marker */}
                <g data-rebuild-marker>
                  <line
                    x1={rebuildX}
                    x2={rebuildX}
                    y1={PAD_TOP - 10}
                    y2={H - PAD_BOTTOM}
                    stroke="#cedb58"
                    strokeOpacity="0.55"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                </g>
                <g data-chart-note>
                  <text
                    x={rebuildX}
                    y={PAD_TOP - 16}
                    textAnchor="middle"
                    fontSize="10.5"
                    letterSpacing="0.12em"
                    fill="#dbe77a"
                  >
                    SYSTEM GOES LIVE
                  </text>
                </g>

                <g data-chart-note>
                  <text
                    x={PAD_X + (rebuildX - PAD_X) / 2}
                    y={H - PAD_BOTTOM - 12}
                    textAnchor="middle"
                    fontSize="10.5"
                    letterSpacing="0.14em"
                    fill="#8B93A7"
                  >
                    BEFORE · 8/MO
                  </text>
                </g>

                {/* Month ticks */}
                {[0, REBUILD_INDEX, 7, MONTHLY.length - 1].map((i) => (
                  <text
                    key={i}
                    x={pts[i].x}
                    y={H - 10}
                    textAnchor={
                      i === 0 ? "start" : i === MONTHLY.length - 1 ? "end" : "middle"
                    }
                    fontSize="10"
                    letterSpacing="0.1em"
                    fill="#8B93A7"
                    opacity="0.8"
                  >
                    MO {i + 1}
                  </text>
                ))}

                {/* Endpoint with pulse */}
                <circle
                  data-endpoint-pulse
                  cx={last.x}
                  cy={last.y}
                  r="5"
                  fill="none"
                  stroke="#6FB8F2"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
                <circle
                  cx={last.x}
                  cy={last.y}
                  r="4.5"
                  fill="#6FB8F2"
                  stroke="#081423"
                  strokeWidth="2"
                />
                <g data-chart-note>
                  <text
                    x={last.x - 10}
                    y={last.y - 12}
                    textAnchor="end"
                    fontSize="13"
                    fontWeight="600"
                    fill="#ffffff"
                  >
                    142/mo
                  </text>
                </g>

                {/* Hover layer: generous hit targets, marker on hover */}
                {pts.map((p, i) => (
                  <g key={i}>
                    {hover === i && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        fill="#6FB8F2"
                        stroke="#081423"
                        strokeWidth="2"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="16"
                      fill="transparent"
                      onPointerEnter={() => setHover(i)}
                      onPointerLeave={() => setHover(null)}
                    />
                  </g>
                ))}
              </svg>

              {hover !== null && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-white/15 bg-[#0c1a2e]/95 px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-white/85 shadow-xl backdrop-blur-sm"
                  style={{
                    left: `${(pts[hover].x / W) * 100}%`,
                    top: `${(pts[hover].y / H) * 100 - 5}%`,
                  }}
                  role="status"
                >
                  MO {hover + 1} · {pts[hover].v} enquiries
                </div>
              )}
            </div>

            <div
              data-panel-row
              className="relative mt-5 grid grid-cols-1 gap-2 border-t border-white/10 pt-4 sm:grid-cols-3 sm:gap-4"
            >
              {[
                ["Sources", "100% tracked"],
                ["Route", "search → site → quote"],
                ["Reporting", "every Friday"],
              ].map(([label, value]) => (
                <p key={label} className="font-mono text-[9px] uppercase tracking-[0.18em]">
                  <span className="text-white/40">{label} · </span>
                  <span className="text-sky/85">{value}</span>
                </p>
              ))}
            </div>
          </div>

          <div data-proof-copy>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cobalt">
              Active Coachlines · Canada
            </p>
            <p className="mt-5 font-display text-[clamp(2.75rem,5vw,5rem)] font-medium leading-none tracking-[-0.055em] text-ink">
              8 <span className="text-cobalt">→</span> 140+
            </p>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-slate">
              Qualified enquiries per month after rebuilding the route from
              search intent to charter quote.
            </p>

            <ol className="mt-8 border-t border-ink/10">
              {proofSteps.map((step, index) => (
                <li
                  key={step.label}
                  data-proof-step
                  className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 py-4"
                >
                  <span
                    data-proof-rule
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px bg-ink/10"
                  />
                  <span className="pt-1 font-mono text-[9px] tracking-[0.18em] text-cobalt/70">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate/65">
                      {step.label}
                    </p>
                    <p className="mt-1 font-display text-lg font-medium tracking-tight text-ink">
                      {step.value}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate">
                      {step.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-3 rounded-pill bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cobalt"
            >
              Build a similar pipeline <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="relative mt-10 h-px bg-ink/10 lg:mt-12">
          <span
            data-proof-signal
            aria-hidden
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-cobalt via-sky to-[#cedb58]"
          />
        </div>
      </div>
    </section>
  );
}
