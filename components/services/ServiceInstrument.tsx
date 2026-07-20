"use client";

import type { ServicePageItem } from "./page-data";

type Props = {
  visual: ServicePageItem["visual"];
  accent: string;
  dark?: boolean;
};

/** Scroll-scrubbed instrument visuals — one distinct mechanism per service. */
export default function ServiceInstrument({ visual, accent, dark }: Props) {
  const ink = dark ? "#E8ECF2" : "#0F1B2D";
  const mute = dark ? "rgba(232,236,242,0.35)" : "rgba(15,27,45,0.35)";
  const panel = dark ? "rgba(232,236,242,0.06)" : "rgba(255,255,255,0.72)";
  const border = dark ? "rgba(232,236,242,0.14)" : "rgba(15,27,45,0.1)";

  return (
    <div
      className="relative aspect-square w-full max-w-[34rem] overflow-hidden rounded-[1.25rem]"
      style={{
        background: panel,
        border: `1px solid ${border}`,
        boxShadow: dark
          ? "0 24px 64px rgba(0,0,0,0.35)"
          : "0 24px 64px rgba(15,27,45,0.08)",
      }}
      data-instrument
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 sm:px-5">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.28em]"
          style={{ color: mute }}
        >
          {channelLabel(visual)}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-mint">
          <i
            className="block h-1.5 w-1.5 rounded-full bg-mint"
            data-instrument-pulse
            aria-hidden
          />
          Live
        </span>
      </div>

      <svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        aria-hidden
        data-instrument-svg
      >
        {visual === "seo" && <SeoArt accent={accent} ink={ink} mute={mute} />}
        {visual === "web" && <WebArt accent={accent} ink={ink} mute={mute} />}
        {visual === "ads" && <AdsArt accent={accent} ink={ink} mute={mute} />}
        {visual === "smm" && <SmmArt accent={accent} ink={ink} mute={mute} />}
        {visual === "graphic" && (
          <GraphicArt accent={accent} ink={ink} mute={mute} />
        )}
      </svg>
    </div>
  );
}

function channelLabel(visual: ServicePageItem["visual"]) {
  switch (visual) {
    case "seo":
      return "Search / Intent";
    case "web":
      return "Assembly / Route";
    case "ads":
      return "Spend / Lead";
    case "smm":
      return "Signal / Cadence";
    case "graphic":
      return "Mark / System";
  }
}

function SeoArt({
  accent,
  ink,
  mute,
}: {
  accent: string;
  ink: string;
  mute: string;
}) {
  return (
    <g>
      {[70, 115, 160].map((r, i) => (
        <circle
          key={r}
          data-spin
          data-dir={i % 2 ? -1 : 1}
          cx="200"
          cy="210"
          r={r}
          fill="none"
          stroke={accent}
          strokeOpacity={0.22 - i * 0.05}
          strokeWidth="1.5"
          strokeDasharray={`${r * 1.4} ${r * 2.8}`}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          data-bar
          x={118 + i * 28}
          y={268 - i * 26}
          width="14"
          height={36 + i * 26}
          rx="2"
          fill={accent}
          fillOpacity={0.16 + i * 0.1}
        />
      ))}
      <text
        x="200"
        y="118"
        textAnchor="middle"
        fill={ink}
        fontSize="11"
        letterSpacing="3"
        fontFamily="ui-monospace, monospace"
        opacity="0.55"
      >
        RANK LADDER
      </text>
      <g data-rank-card>
        <rect
          x="128"
          y="168"
          width="144"
          height="52"
          rx="8"
          fill={accent}
          fillOpacity="0.18"
          stroke={accent}
          strokeWidth="1.5"
        />
        <text
          x="148"
          y="190"
          fill={ink}
          fontSize="18"
          fontWeight="700"
          fontFamily="ui-monospace, monospace"
        >
          #3
        </text>
        <text x="186" y="186" fill={ink} fontSize="10" opacity="0.7">
          YOUR PAGE
        </text>
        <text x="186" y="202" fill={mute} fontSize="9">
          High-intent · Qualified
        </text>
      </g>
    </g>
  );
}

function WebArt({
  accent,
  ink,
  mute,
}: {
  accent: string;
  ink: string;
  mute: string;
}) {
  return (
    <g>
      <rect
        data-frame
        x="90"
        y="110"
        width="220"
        height="180"
        rx="14"
        fill="none"
        stroke={accent}
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <rect
        data-frame
        x="108"
        y="128"
        width="184"
        height="28"
        rx="6"
        fill={accent}
        fillOpacity="0.12"
      />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          data-block
          x="108"
          y={176 + i * 36}
          width={i === 2 ? 110 : 184}
          height="22"
          rx="5"
          fill={accent}
          fillOpacity={0.1 + i * 0.06}
        />
      ))}
      <path
        data-draw
        d="M150 320 L90 250 L150 180"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        data-draw
        d="M250 320 L310 250 L250 180"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="200"
        y="96"
        textAnchor="middle"
        fill={mute}
        fontSize="10"
        letterSpacing="3"
        fontFamily="ui-monospace, monospace"
      >
        PAGE → ENQUIRY
      </text>
      <circle data-dot cx="200" cy="250" r="6" fill={ink} fillOpacity="0.85" />
    </g>
  );
}

function AdsArt({
  accent,
  ink,
  mute,
}: {
  accent: string;
  ink: string;
  mute: string;
}) {
  return (
    <g>
      {[150, 105, 60].map((r, i) => (
        <circle
          key={r}
          data-pulse
          cx="200"
          cy="200"
          r={r}
          fill="none"
          stroke={accent}
          strokeOpacity={0.18 + i * 0.12}
          strokeWidth="1.5"
        />
      ))}
      <circle cx="200" cy="200" r="16" fill={accent} fillOpacity="0.85" />
      <line
        data-spin
        x1="200"
        y1="200"
        x2="330"
        y2="120"
        stroke={accent}
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <g data-equation>
        <text
          x="200"
          y="320"
          textAnchor="middle"
          fill={ink}
          fontSize="13"
          fontFamily="ui-monospace, monospace"
          letterSpacing="1"
        >
          SPEND ÷ QUALIFIED = CPL
        </text>
        <text
          x="200"
          y="342"
          textAnchor="middle"
          fill={mute}
          fontSize="10"
          fontFamily="ui-monospace, monospace"
        >
          WASTE CUT · LEADS KEPT
        </text>
      </g>
    </g>
  );
}

function SmmArt({
  accent,
  ink,
  mute,
}: {
  accent: string;
  ink: string;
  mute: string;
}) {
  const nodes = [
    [200, 140],
    [280, 190],
    [260, 270],
    [140, 270],
    [120, 190],
  ] as const;
  return (
    <g>
      <ellipse
        data-spin
        cx="200"
        cy="210"
        rx="140"
        ry="55"
        fill="none"
        stroke={accent}
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <ellipse
        data-spin
        data-dir="-1"
        cx="200"
        cy="210"
        rx="55"
        ry="140"
        fill="none"
        stroke={accent}
        strokeOpacity="0.2"
        strokeWidth="1.5"
      />
      {nodes.map(([x, y], i) => (
        <g key={i} data-node>
          <circle
            cx={x}
            cy={y}
            r="10"
            fill={accent}
            fillOpacity={0.25 + i * 0.08}
            stroke={accent}
            strokeWidth="1.25"
          />
          {i < nodes.length - 1 && (
            <line
              x1={x}
              y1={y}
              x2={nodes[i + 1][0]}
              y2={nodes[i + 1][1]}
              stroke={accent}
              strokeOpacity="0.35"
              strokeWidth="1.25"
              data-draw
            />
          )}
        </g>
      ))}
      <text
        x="200"
        y="100"
        textAnchor="middle"
        fill={mute}
        fontSize="10"
        letterSpacing="3"
        fontFamily="ui-monospace, monospace"
      >
        ENGAGEMENT TRACE
      </text>
      <text
        x="200"
        y="340"
        textAnchor="middle"
        fill={ink}
        fontSize="11"
        fontFamily="ui-monospace, monospace"
        opacity="0.7"
      >
        POST → SAVE → VISIT → ENQUIRE
      </text>
    </g>
  );
}

function GraphicArt({
  accent,
  ink,
  mute,
}: {
  accent: string;
  ink: string;
  mute: string;
}) {
  return (
    <g>
      <rect
        data-frame
        x="120"
        y="110"
        width="160"
        height="160"
        rx="12"
        fill="none"
        stroke={accent}
        strokeOpacity="0.4"
        strokeWidth="1.5"
        transform="rotate(8 200 190)"
      />
      <rect
        data-frame
        x="120"
        y="110"
        width="160"
        height="160"
        rx="12"
        fill="none"
        stroke={ink}
        strokeOpacity="0.2"
        strokeWidth="1.5"
        transform="rotate(-6 200 190)"
      />
      <circle
        data-mark
        cx="200"
        cy="190"
        r="42"
        fill={accent}
        fillOpacity="0.2"
        stroke={accent}
        strokeWidth="2"
      />
      <path
        data-draw
        d="M178 190 L192 204 L226 170"
        fill="none"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="200"
        y="320"
        textAnchor="middle"
        fill={mute}
        fontSize="10"
        letterSpacing="3"
        fontFamily="ui-monospace, monospace"
      >
        MARK LOCKED
      </text>
      <text
        x="200"
        y="340"
        textAnchor="middle"
        fill={ink}
        fontSize="11"
        opacity="0.75"
      >
        One system · every touchpoint
      </text>
    </g>
  );
}
