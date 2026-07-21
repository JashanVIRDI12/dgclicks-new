"use client";

import { useRef } from "react";
import { processSteps } from "@/lib/data";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import Reveal from "./Reveal";

/**
 * Pin-and-reveal: each step locks in place while the next slides over it
 * (ScrollTrigger pinning — position:sticky doesn't survive ScrollSmoother's
 * transform). Small screens and reduced motion get a plain stacked list.
 */
export default function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const root = rootRef.current!;
        const cards = gsap.utils.toArray<HTMLElement>("[data-step]", root);
        const last = cards[cards.length - 1];
        const triggers: ScrollTrigger[] = [];
        const tweens: gsap.core.Tween[] = [];

        cards.forEach((card, i) => {
          const top = 110 + i * 26;
          if (card !== last) {
            triggers.push(
              ScrollTrigger.create({
                trigger: card,
                start: () => `top ${top}`,
                end: () => `+=${last.offsetTop - card.offsetTop}`,
                pin: true,
                pinSpacing: false,
              }),
            );
            // Settle back as the next card slides over
            tweens.push(
              gsap.to(card, {
                scale: 0.94,
                opacity: 0.75,
                transformOrigin: "center top",
                ease: "none",
                scrollTrigger: {
                  trigger: cards[i + 1],
                  start: "top bottom",
                  end: () => `top ${110 + (i + 1) * 26}`,
                  scrub: true,
                },
              }),
            );
          }
        });

        return () => {
          tweens.forEach((t) => {
            t.scrollTrigger?.kill();
            t.kill();
          });
          triggers.forEach((t) => t.kill());
          gsap.set(cards, { clearProps: "all" });
        };
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={rootRef} className="relative py-24 sm:py-32">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-5">How we work</p>
          <h2 className="font-display text-display-lg font-semibold text-ink">
            No mystery. Four steps, on repeat.
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            The same loop for every client, because it works: find the leaks,
            rank the bets, ship, then pour fuel on whatever moved.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-6">
          {processSteps.map((step) => (
            <article
              key={step.number}
              data-step
              className="glass-strong grid gap-6 rounded-glass bg-white/80 p-8 sm:p-10 md:min-h-[300px] lg:grid-cols-12 lg:gap-10 lg:p-12"
            >
              <div className="lg:col-span-3">
                <p
                  className="font-display text-6xl font-semibold text-sky-deep/80 lg:text-7xl"
                  aria-hidden="true"
                >
                  {step.number}
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-mist">
                  {step.title}
                </p>
              </div>
              <div className="flex flex-col lg:col-span-9">
                <h3 className="font-display text-display-md font-semibold text-ink">
                  {step.hook}
                </h3>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed">
                  {step.copy}
                </p>
                <p className="mt-auto pt-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-mint/50 px-4 py-2 text-sm font-medium text-ink">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7.5 L5.5 11 L12 3.5" stroke="#2B3040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    You get: {step.deliverable}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
