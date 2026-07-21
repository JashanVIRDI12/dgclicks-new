"use client";

import { useRef, useState } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

const PAD_X = 14;
const PAD_TOP = 26;
const PAD_BOTTOM = 30;
const W = 480;
const H = 210;

function buildPoints(data: number[]) {
  const max = Math.max(...data) * 1.1;
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

/**
 * Single-series growth line (enquiries per month). Line draws in on scroll;
 * endpoints carry visible value labels; each point has a hover tooltip.
 */
export default function GrowthChart({ data }: { data: number[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const pts = buildPoints(data);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1].x} ${H - PAD_BOTTOM} L ${
    pts[0].x
  } ${H - PAD_BOTTOM} Z`;
  const first = pts[0];
  const last = pts[pts.length - 1];

  useIsoLayoutEffect(() => {
    const path = pathRef.current;
    const root = rootRef.current;
    if (!path || !root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
      tl.to(path, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" })
        .from(
          root.querySelectorAll("[data-chart-fade]"),
          { opacity: 0, duration: 0.6, stagger: 0.15 },
          "-=0.7",
        );
      return () => {
        tl.kill();
        gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <p className="sr-only">
        Enquiries per month over eleven months: {data.join(", ")}. Growth from{" "}
        {data[0]} to {data[data.length - 1]}.
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Line chart: monthly enquiries grew from ${data[0]} to ${
          data[data.length - 1]
        } over ${data.length} months`}
        className="w-full"
      >
        <defs>
          <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4FA8D8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#B8E6D3" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Recessive grid: three faint rules */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
            y2={PAD_TOP + (H - PAD_TOP - PAD_BOTTOM) * t}
            stroke="#2B3040"
            strokeOpacity="0.06"
          />
        ))}

        <path data-chart-fade d={area} fill="url(#growth-fill)" />
        <path
          ref={pathRef}
          d={line}
          fill="none"
          stroke="#4FA8D8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Endpoint markers + direct labels (contrast relief for the light line) */}
        <g data-chart-fade>
          <circle cx={first.x} cy={first.y} r="4.5" fill="#4FA8D8" stroke="#fff" strokeWidth="2" />
          <text x={first.x + 2} y={first.y - 12} fontSize="13" fontWeight="600" fill="#2B3040">
            {first.v}
          </text>
          <text x={first.x} y={H - 8} fontSize="11" fill="#8A94A6">
            month 1
          </text>
        </g>
        <g data-chart-fade>
          <circle cx={last.x} cy={last.y} r="5.5" fill="#4FA8D8" stroke="#fff" strokeWidth="2" />
          <text x={last.x - 6} y={last.y - 12} textAnchor="end" fontSize="13" fontWeight="600" fill="#2B3040">
            {last.v}/mo
          </text>
          <text x={last.x} y={H - 8} textAnchor="end" fontSize="11" fill="#8A94A6">
            month {data.length}
          </text>
        </g>

        {/* Hover layer: generous hit targets, marker on hover */}
        {pts.map((p, i) => (
          <g key={i}>
            {hover === i && (
              <circle cx={p.x} cy={p.y} r="5" fill="#4FA8D8" stroke="#fff" strokeWidth="2" />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r="14"
              fill="transparent"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
            />
          </g>
        ))}
      </svg>

      {hover !== null && (
        <div
          className="glass-strong pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl px-3 py-1.5 text-xs font-medium text-ink"
          style={{
            left: `${(pts[hover].x / W) * 100}%`,
            top: `${(pts[hover].y / H) * 100 - 4}%`,
          }}
          role="status"
        >
          Month {hover + 1} · {pts[hover].v} enquiries
        </div>
      )}
    </div>
  );
}
