"use client";

/* ————————————————————————————————————————————————————————————————
   SHOWCASE VISUALS — code-drawn instrument panels for the five
   featured spreads. Everything is SVG/CSS so it themes to the brand,
   stays crisp at any size, and animates on scroll. No stock chrome.
   Each accepts an `accent` and animates when `data-viz-in` fires
   (driven by the parent's ScrollTrigger via a CSS class toggle).
   ———————————————————————————————————————————————————————————————— */

type VizProps = { accent: string };

/* — Browser build mock (Website Development) — */
export function BrowserViz({ accent }: VizProps) {
  return (
    <div className="viz-browser relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0e14] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.05] px-3 py-1.5 font-mono text-[10px] tracking-wide text-white/40">
          dgclicks.com/growth
        </span>
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
      </div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 p-5">
        <div className="space-y-3">
          <div className="h-2.5 w-24 rounded-full" style={{ background: accent }} />
          <div className="h-5 w-[85%] rounded-md bg-white/[0.12]" />
          <div className="h-5 w-[65%] rounded-md bg-white/[0.08]" />
          <div className="mt-4 h-2 w-full rounded-full bg-white/[0.06]" />
          <div className="h-2 w-[80%] rounded-full bg-white/[0.06]" />
          <div
            className="mt-4 inline-flex h-8 w-28 items-center justify-center rounded-full text-[10px] font-semibold text-[#070707]"
            style={{ background: accent }}
          >
            Get started
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg bg-white/[0.05]">
          <div
            className="absolute inset-0 opacity-70"
            style={{ background: `radial-gradient(120% 120% at 20% 0%, ${accent}44, transparent 60%)` }}
          />
          <div className="absolute bottom-3 left-3 right-3 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-white/20" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-white/8 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
        <span style={{ color: accent }}>0.8s</span> median load
        <span className="ml-auto">Lighthouse 98</span>
      </div>
    </div>
  );
}

/* — Analytics dashboard (SEO) — */
export function AnalyticsViz({ accent }: VizProps) {
  const bars = [38, 52, 44, 63, 71, 80, 96];
  return (
    <div className="viz-panel relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0e14] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">Organic sessions</p>
          <p className="mt-1 font-display text-3xl font-semibold text-white">
            <span className="viz-count" data-to="214" style={{ color: accent }}>0</span>
            <span style={{ color: accent }}>%</span>
            <span className="ml-2 text-sm font-normal text-white/40">YoY</span>
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/50">
          12&nbsp;mo
        </span>
      </div>

      {/* line + area chart */}
      <svg viewBox="0 0 320 120" className="mt-4 w-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id={`area-${accent.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="viz-area"
          d="M0,100 C40,92 60,70 100,66 C140,62 160,40 200,32 C240,24 280,16 320,8 L320,120 L0,120 Z"
          fill={`url(#area-${accent.slice(1)})`}
        />
        <path
          className="viz-line"
          d="M0,100 C40,92 60,70 100,66 C140,62 160,40 200,32 C240,24 280,16 320,8"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* keyword bars */}
      <div className="mt-4 flex items-end gap-1.5" style={{ height: 44 }}>
        {bars.map((h, i) => (
          <span
            key={i}
            className="viz-bar flex-1 rounded-sm"
            style={{ height: `${h}%`, background: i === bars.length - 1 ? accent : "rgba(255,255,255,0.12)" }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-widest text-white/35">
        <span>63 page-one terms</span>
        <span style={{ color: accent }}>▲ climbing</span>
      </div>
    </div>
  );
}

/* Deterministic pseudo-random so SSR and client render identical heatmaps. */
function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* — Paid ads / ROAS panel — */
export function AdsViz({ accent }: VizProps) {
  const cells = Array.from({ length: 42 });
  return (
    <div className="viz-panel relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0e14] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">Blended ROAS</p>
          <p className="mt-1 font-display text-4xl font-semibold text-white">
            <span className="viz-count" data-to="52" data-decimals="1" style={{ color: accent }}>0</span>
            <span style={{ color: accent }}>×</span>
          </p>
        </div>
        <div className="flex gap-1.5">
          {["Google", "Meta"].map((p) => (
            <span key={p} className="rounded-full border border-white/12 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-white/60">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* campaign heatmap */}
      <div className="mt-5 grid grid-cols-14 gap-1" style={{ gridTemplateColumns: "repeat(14, minmax(0,1fr))" }}>
        {cells.map((_, i) => {
          const intensity = Math.pow(seeded(i + 3), 1.6);
          // round so server and client serialise the exact same string
          const cellOpacity = Math.round((0.08 + intensity * 0.8) * 1000) / 1000;
          return (
            <span
              key={i}
              className="viz-cell aspect-square rounded-[3px]"
              style={{
                background: accent,
                opacity: cellOpacity,
                transitionDelay: `${i * 12}ms`,
              }}
            />
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/8 pt-4">
        {[
          { k: "−41%", v: "cost / lead" },
          { k: "8→140", v: "leads / mo" },
          { k: "Weekly", v: "rebalance" },
        ].map((s) => (
          <div key={s.v}>
            <p className="font-display text-base font-semibold text-white">{s.k}</p>
            <p className="font-mono text-[8.5px] uppercase tracking-widest text-white/40">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* — Brand specimen board (Branding) — */
export function BrandViz({ accent }: VizProps) {
  const swatches = ["#070707", accent, "#6FB8F2", "#CEDB58", "#D7DEE8"];
  return (
    <div className="viz-panel relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0e14] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">Identity kit</p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-white/35">v.02</p>
      </div>

      <div className="mt-4 flex items-end gap-4">
        <span
          className="viz-specimen font-display font-semibold leading-none text-white"
          style={{ fontSize: "4.5rem" }}
        >
          Aa
        </span>
        <div className="mb-1 space-y-1.5">
          <div className="h-2 w-24 rounded-full bg-white/20" />
          <div className="h-2 w-16 rounded-full bg-white/12" />
          <div className="h-2 w-20 rounded-full bg-white/8" />
        </div>
        <div
          className="viz-mark ml-auto grid h-14 w-14 place-items-center rounded-xl text-lg font-bold text-[#070707]"
          style={{ background: accent }}
        >
          DG
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {swatches.map((c, i) => (
          <span
            key={i}
            className="viz-swatch h-10 flex-1 rounded-md border border-white/8"
            style={{ background: c, transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[8.5px] uppercase tracking-widest text-white/35">
        <span>Bricolage · Manrope · Azeret</span>
        <span style={{ color: accent }}>consistent</span>
      </div>
    </div>
  );
}

/* — AI workflow node diagram (AI Automation) — */
export function FlowViz({ accent }: VizProps) {
  return (
    <div className="viz-panel relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0e14] p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">Automation flow</p>

      <svg viewBox="0 0 320 150" className="mt-3 w-full" aria-hidden>
        {/* connectors */}
        <path className="viz-wire" d="M46,40 C110,40 110,75 168,75" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <path className="viz-wire" d="M46,110 C110,110 110,75 168,75" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <path className="viz-wire" d="M214,75 C250,75 250,42 288,42" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <path className="viz-wire" d="M214,75 C250,75 250,108 288,108" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

        {/* input nodes */}
        {[40, 110].map((y, i) => (
          <g key={i} className="viz-node">
            <rect x="10" y={y - 12} width="36" height="24" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
          </g>
        ))}
        {/* AI core */}
        <g className="viz-node viz-core">
          <circle cx="191" cy="75" r="24" fill={`${accent}22`} stroke={accent} strokeWidth="1.5" />
          <text x="191" y="79" textAnchor="middle" fontSize="10" fontFamily="monospace" fill={accent}>AI</text>
        </g>
        {/* output nodes */}
        {[42, 108].map((y, i) => (
          <g key={i} className="viz-node">
            <rect x="288" y={y - 12} width="26" height="24" rx="6" fill={`${accent}18`} stroke={accent} strokeWidth="1" opacity="0.9" />
          </g>
        ))}
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[8.5px] uppercase tracking-widest text-white/40">
        <span>Capture</span>
        <span className="text-center" style={{ color: accent }}>Enrich</span>
        <span className="text-right">Route</span>
      </div>
    </div>
  );
}

export function FeaturedViz({ kind, accent }: { kind: string; accent: string }) {
  switch (kind) {
    case "browser":
      return <BrowserViz accent={accent} />;
    case "analytics":
      return <AnalyticsViz accent={accent} />;
    case "ads":
      return <AdsViz accent={accent} />;
    case "brand":
      return <BrandViz accent={accent} />;
    case "flow":
      return <FlowViz accent={accent} />;
    default:
      return null;
  }
}
