"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { COMPOUND_STEPS, SERVICE_PAGE } from "./page-data";

export default function ServicesCompound() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from("[data-compound]", {
        y: 32,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });

      gsap.from("[data-compound-node]", {
        scale: 0.6,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 60%" },
      });

      gsap.fromTo(
        "[data-compound-line]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 58%" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="compound"
      aria-labelledby="compound-heading"
      className="relative overflow-hidden bg-[#070d16] py-28 text-chrome md:py-36"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-mint/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(42,95,217,0.18),transparent_60%)]" />
      </div>

      <div className="wrap relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <p
            data-compound
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-mint"
          >
            The compound effect
          </p>
          <h2
            data-compound
            id="compound-heading"
            className="mt-4 font-display text-headline-sm !text-chrome"
          >
            Five channels. One Friday report.
          </h2>
          <p
            data-compound
            className="mx-auto mt-5 max-w-xl text-body text-fog"
          >
            Search finds intent. The site converts it. Ads amplify what works.
            Social proves the work is real. Design makes every touchpoint feel
            like the same confident operator.
          </p>
        </div>

        {/* Desktop chain */}
        <div
          data-compound
          className="relative mx-auto mt-16 hidden max-w-5xl md:block"
        >
          <div
            data-compound-line
            className="absolute left-[6%] right-[6%] top-[1.35rem] h-px origin-left bg-gradient-to-r from-cobalt via-sky to-mint"
            aria-hidden
          />
          <ol className="relative grid grid-cols-5 gap-4">
            {COMPOUND_STEPS.map((step, i) => {
              const svc = SERVICE_PAGE.find((s) => s.id === step.id)!;
              return (
                <li
                  key={step.id}
                  data-compound-node
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 bg-[#070d16] font-mono text-[11px] tabular-nums"
                    style={{
                      borderColor: svc.accent,
                      color: svc.accent,
                      boxShadow: `0 0 24px ${svc.accent}44`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-4 font-display text-base tracking-[-0.02em] text-chrome">
                    {svc.short}
                  </span>
                  <span className="mt-1.5 max-w-[9rem] text-caption text-fog/70">
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Mobile stack */}
        <ol className="mx-auto mt-12 max-w-sm space-y-0 border-t border-white/10 md:hidden">
          {COMPOUND_STEPS.map((step, i) => {
            const svc = SERVICE_PAGE.find((s) => s.id === step.id)!;
            return (
              <li
                key={step.id}
                data-compound-node
                className="flex items-start gap-4 border-b border-white/10 py-4"
              >
                <span
                  className="mt-0.5 font-mono text-[11px] tabular-nums"
                  style={{ color: svc.accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-lg text-chrome">{svc.short}</p>
                  <p className="mt-0.5 text-caption text-fog/70">{step.label}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div data-compound className="mt-16 flex justify-center">
          <Link href="/contact" className="btn-primary">
            Map this onto your pipeline
          </Link>
        </div>
      </div>
    </section>
  );
}
