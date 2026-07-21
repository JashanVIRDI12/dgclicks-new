import { services, type Service } from "@/lib/data";
import Reveal from "./Reveal";

function ServiceVisual({ kind }: { kind: Service["visual"] }) {
  const stroke = "#4FA8D8";
  const soft = "#7EC8E3";
  const mint = "#B8E6D3";
  switch (kind) {
    case "seo":
      return (
        <svg viewBox="0 0 140 64" fill="none" className="h-full w-full" aria-hidden="true">
          <path d="M4 56 C30 54 44 44 62 34 S104 14 124 8" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M4 56 C30 54 44 44 62 34 S104 14 124 8 L124 60 L4 60 Z" fill={soft} opacity="0.18" />
          <circle cx="124" cy="8" r="6" stroke={stroke} strokeWidth="2.5" fill="white" />
          <line x1="129" y1="13" x2="136" y2="20" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "ads":
      return (
        <svg viewBox="0 0 140 64" fill="none" className="h-full w-full" aria-hidden="true">
          {[10, 34, 58, 82, 106].map((x, i) => {
            const h = [16, 24, 30, 40, 52][i];
            return (
              <rect
                key={x}
                x={x}
                y={58 - h}
                width="18"
                height={h}
                rx="5"
                fill={i === 4 ? stroke : soft}
                opacity={i === 4 ? 1 : 0.45}
              />
            );
          })}
          <path d="M112 14 L120 34 L114 32 L112 40 L108 32 L102 34 Z" fill="#2B3040" opacity="0.85" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 140 64" fill="none" className="h-full w-full" aria-hidden="true">
          <rect x="14" y="6" width="112" height="52" rx="10" stroke={stroke} strokeWidth="2.5" fill="white" fillOpacity="0.5" />
          <circle cx="26" cy="16" r="2.5" fill={soft} />
          <circle cx="35" cy="16" r="2.5" fill={mint} />
          <line x1="24" y1="30" x2="80" y2="30" stroke="#2B3040" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
          <line x1="24" y1="40" x2="64" y2="40" stroke={soft} strokeWidth="4" strokeLinecap="round" />
          <rect x="92" y="34" width="24" height="12" rx="6" fill={stroke} />
        </svg>
      );
    case "smm":
      return (
        <svg viewBox="0 0 140 64" fill="none" className="h-full w-full" aria-hidden="true">
          <path d="M10 8 L74 8 L58 26 L26 26 Z" fill={soft} opacity="0.4" />
          <path d="M26 30 L58 30 L50 44 L34 44 Z" fill={soft} opacity="0.7" />
          <path d="M34 48 L50 48 L46 58 L38 58 Z" fill={stroke} />
          <path d="M88 34 H124 M124 34 L112 24 M124 34 L112 44" stroke="#2B3040" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="86" y="18" fill="#2B3040" opacity="0.7" fontSize="12" fontWeight="600">+184%</text>
        </svg>
      );
    case "graphic":
      return (
        <svg viewBox="0 0 140 64" fill="none" className="h-full w-full" aria-hidden="true">
          <path d="M16 48 C40 48 36 16 62 16 S92 48 118 48" stroke={soft} strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" />
          <circle cx="16" cy="48" r="7" fill={mint} />
          <circle cx="62" cy="16" r="7" fill={soft} />
          <circle cx="118" cy="48" r="9" fill={stroke} />
          <path d="M114 48 L117 51 L123 44" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-5">What you get</p>
          <h2 className="font-display text-display-lg font-semibold text-ink">
            Five ways we move your number.
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Not deliverables for a slide deck — systems that show up in your
            CRM, your calendar, and your bank statement.
          </p>
        </Reveal>

        <Reveal
          selector="[data-card]"
          stagger={0.09}
          y={52}
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-6"
        >
          {services.map((service, i) => (
            <article
              key={service.id}
              data-card
              className={`glass group relative flex flex-col rounded-glass p-7 transition-all duration-300 hover:-translate-y-2 hover:border-white/90 hover:bg-white/70 hover:shadow-glass-hover ${
                i < 3 ? "lg:col-span-2" : "lg:col-span-3"
              }`}
            >
              <div className="h-20 w-36 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                <ServiceVisual kind={service.visual} />
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-mist">
                {service.title}
              </p>
              <h3 className="mt-2 font-display text-display-sm font-semibold text-ink">
                {service.outcome}
              </h3>
              <p className="mt-3 leading-relaxed">{service.copy}</p>
              <p className="mt-auto pt-6">
                <span className="inline-block rounded-full bg-mint/50 px-3.5 py-1.5 text-xs font-medium text-ink">
                  {service.proof}
                </span>
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
