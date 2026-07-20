"use client";

import Image from "next/image";
import { useRef } from "react";
import { processSteps } from "@/lib/data";
import { img } from "@/lib/images";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";

const stepImages = [img.workspace, img.officeWorkshop, img.workCode, img.caseHarrier];

/**
 * DISTINCT IDEA — "the program rail": the whole method hangs off one
 * vertical rail. An azure thread fills the rail as you scroll, and each
 * numbered stop lights lime the moment the thread reaches it — so your
 * scroll position IS your position in the program. No zigzag, no noise:
 * one line, four stops, read top to bottom like an itinerary.
 */
export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const stops = gsap.utils.toArray<HTMLElement>("[data-stop]", root);

      // The thread fills with scroll…
      const fill = gsap.fromTo(
        threadRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 62%",
            end: "bottom 62%",
            scrub: true,
          },
        },
      );

      // …and lights each stop as it passes
      const triggers = stops.map((stop) =>
        ScrollTrigger.create({
          trigger: stop,
          start: "top 62%",
          onEnter: () => stop.classList.add("is-lit"),
          onLeaveBack: () => stop.classList.remove("is-lit"),
        }),
      );

      // Content eases up as each stop arrives
      gsap.set(stops, { y: 44, autoAlpha: 0 });
      const batch = ScrollTrigger.batch(stops, {
        start: "top 86%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }),
      });

      return () => {
        fill.scrollTrigger?.kill();
        fill.kill();
        triggers.forEach((t) => t.kill());
        batch.forEach((t) => t.kill());
        stops.forEach((s) => s.classList.remove("is-lit"));
        gsap.set([threadRef.current, ...stops], { clearProps: "all" });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={rootRef} className="relative py-24 sm:py-32">
      <div className="wrap">
        <div className="max-w-2xl">
          <h2 className="font-display text-display-lg font-bold text-ink">
            The program, top to bottom.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate">
            Four steps in the only order that works — each one decides what
            the next is allowed to spend, ship, or stop.
          </p>
        </div>

        <div className="relative mt-16 lg:mt-20">
          {/* The rail and its thread */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[26px] top-6 w-[3px] rounded-full bg-ink/10 sm:left-[34px]"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[26px] top-6 w-[3px] origin-top rounded-full bg-sky-deep will-change-transform sm:left-[34px]"
            ref={threadRef}
          />

          <ol ref={listRef} className="space-y-16 sm:space-y-20 lg:space-y-24">
            {processSteps.map((step, i) => (
              <li
                key={step.number}
                data-stop
                className="group relative grid items-center gap-x-10 gap-y-6 pl-[68px] will-change-transform sm:pl-[104px] lg:grid-cols-[1fr_340px]"
              >
                {/* The stop: outline until the thread reaches it, then lime */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 grid h-[54px] w-[54px] place-items-center rounded-full border-[3px] border-sky-deep bg-white font-mono text-lg font-bold tabular-nums text-sky-deep transition-colors duration-300 group-[.is-lit]:border-mint group-[.is-lit]:bg-mint group-[.is-lit]:text-night sm:h-[70px] sm:w-[70px] sm:text-xl"
                >
                  {step.number}
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-deep">
                    Step {step.number} · {step.title}
                  </p>
                  <h3 className="mt-2 font-display text-display-md font-bold text-ink">
                    {step.hook}
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-slate">{step.copy}</p>
                  <p className="mt-5 inline-block max-w-full rounded-xl bg-mint px-4 py-2 text-sm font-semibold leading-snug text-night sm:rounded-full">
                    You get: {step.deliverable}
                  </p>
                </div>

                <figure className="relative h-48 overflow-hidden rounded-2xl shadow-glass sm:h-56 lg:h-60">
                  <Image
                    src={stepImages[i].src}
                    alt=""
                    width={stepImages[i].width}
                    height={stepImages[i].height}
                    placeholder="blur"
                    blurDataURL={stepImages[i].blurDataURL}
                    sizes="(min-width: 1024px) 340px, 88vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="img-tint absolute inset-0" />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
