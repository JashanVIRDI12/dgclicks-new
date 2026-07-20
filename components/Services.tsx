"use client";

import Image from "next/image";
import { type CSSProperties, useRef } from "react";
import { services } from "@/lib/data";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import MagneticButton from "./MagneticButton";

/* Each card in the deck is its own brand surface — white, navy, azure,
   lime — so the stack reads as a deck of brand cards, not five clones. */
const surfaces = [
  {
    card: "bg-white text-ink",
    body: "text-slate",
    label: "text-sky-deep",
    rule: "border-ink/10",
    chip: "bg-mint text-night",
    check: { circle: "#CEDB58", tick: "#142638" },
    cta: "bg-night text-white hover:bg-sky-deep",
  },
  {
    card: "bg-night text-white",
    body: "text-fog",
    label: "text-mint",
    rule: "border-white/15",
    chip: "bg-mint text-night",
    check: { circle: "#CEDB58", tick: "#142638" },
    cta: "bg-mint text-night hover:bg-white",
  },
  {
    card: "bg-sky text-night",
    body: "text-night",
    label: "text-white",
    rule: "border-night/20",
    chip: "bg-night text-white",
    check: { circle: "#142638", tick: "#FFFFFF" },
    cta: "bg-night text-white hover:bg-white hover:text-night",
  },
  {
    card: "bg-mint text-night",
    body: "text-night",
    label: "text-night",
    rule: "border-night/20",
    chip: "bg-night text-white",
    check: { circle: "#142638", tick: "#CEDB58" },
    cta: "bg-night text-white hover:bg-white hover:text-night",
  },
  {
    card: "bg-white text-ink",
    body: "text-slate",
    label: "text-sky-deep",
    rule: "border-ink/10",
    chip: "bg-mint text-night",
    check: { circle: "#CEDB58", tick: "#142638" },
    cta: "bg-night text-white hover:bg-sky-deep",
  },
];

/**
 * DISTINCT IDEA — "the deck": five services dealt as a stack of sticky
 * brand cards. Each card slides up over the previous one, which settles
 * back and shrinks like a card being covered on a table; every card wears
 * a different brand surface (white, navy, azure, lime) so flipping through
 * the deck is a tour of the palette itself.
 */
export default function Services() {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-svc-heading]", {
          y: 36,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-svc-heading]", start: "top 84%", once: true },
        });
        gsap.to("[data-svc-marker]", {
          scaleX: 1,
          duration: 0.7,
          delay: 0.35,
          ease: "power3.inOut",
          scrollTrigger: { trigger: "[data-svc-heading]", start: "top 84%", once: true },
        });

        // Covered cards settle back as the next one slides over them
        const wrappers = gsap.utils.toArray<HTMLElement>("[data-deal]", root);
        wrappers.forEach((wrapper, i) => {
          if (i === wrappers.length - 1) return;
          gsap.to(wrapper.querySelector("[data-card]"), {
            scale: 0.94,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: wrappers[i + 1],
              start: "top bottom",
              end: "top 15%",
              scrub: true,
            },
          });
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="services" ref={rootRef} className="relative py-24 sm:py-32">
      <div className="wrap mx-auto max-w-3xl text-center">
        {/* Heading with a lime highlighter sweep — the marker only ever touches wins */}
        <h2 data-svc-heading className="font-display text-display-lg font-bold text-ink">
          How we help you{" "}
          <span className="relative inline-block whitespace-nowrap">
            <span
              data-svc-marker
              aria-hidden="true"
              className="absolute inset-x-[-0.12em] bottom-[0.02em] top-[0.08em] origin-left -rotate-1 rounded-[0.3em] bg-mint"
              style={{ transform: "scaleX(0)" }}
            />
            <span className="relative">grow.</span>
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate">
          Five pressure points where money leaks fastest. Deal through the
          deck — every card ends in a number.
        </p>
      </div>

      <div className="wrap mt-16">
        {services.map((service, i) => {
          const s = surfaces[i % surfaces.length];
          return (
            <div
              key={service.id}
              data-deal
              className="service-deal relative mb-5 last:mb-0 sm:sticky sm:mb-6"
              style={{ "--deal-offset": `${i * 1.4}rem` } as CSSProperties}
            >
              <article
                data-card
                className={`grid gap-7 rounded-2xl p-5 shadow-glass will-change-transform sm:min-h-[62vh] sm:gap-8 sm:p-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:p-14 ${s.card}`}
              >
                <div className="flex flex-col justify-center">
                  <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${s.label}`}>
                    {service.title}
                  </p>
                  <h3 className="mt-3 font-display text-display-md font-bold">
                    {service.headline}
                  </h3>
                  <p className={`mt-4 max-w-lg leading-relaxed ${s.body}`}>{service.copy}</p>
                  <ul className="mt-7 space-y-2.5">
                    {service.deliverables.map((d) => (
                      <li key={d} className={`flex items-start gap-2.5 text-sm ${s.body}`}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                          <circle cx="9" cy="9" r="8.5" fill={s.check.circle} />
                          <path d="M5.5 9.2 L8 11.7 L12.7 6.8" stroke={s.check.tick} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className={`mt-8 flex flex-col items-stretch gap-4 border-t pt-7 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center ${s.rule}`}>
                    <span className={`rounded-full px-4 py-2 font-mono text-sm font-semibold tabular-nums ${s.chip}`}>
                      {service.proof}
                    </span>
                    <MagneticButton strength={0.25}>
                      <a
                        href="/contact"
                        data-cursor="Go"
                        className={`inline-block w-full rounded-full px-7 py-3.5 text-center text-sm font-medium transition-colors min-[420px]:w-auto ${s.cta}`}
                      >
                        Fix this leak
                      </a>
                    </MagneticButton>
                  </div>
                </div>

                <figure className="relative min-h-[220px] overflow-hidden rounded-xl sm:min-h-[260px] lg:min-h-0">
                  <Image
                    src={service.image.src}
                    alt={service.alt}
                    width={service.image.width}
                    height={service.image.height}
                    placeholder="blur"
                    blurDataURL={service.image.blurDataURL}
                    sizes="(min-width: 1024px) 42vw, 88vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="img-tint absolute inset-0" />
                  <figcaption className="absolute left-4 top-4 rounded-full bg-night/70 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    {service.outcome}
                  </figcaption>
                </figure>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
