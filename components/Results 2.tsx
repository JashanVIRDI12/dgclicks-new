"use client";

import Image from "next/image";
import { useRef } from "react";
import { caseStudies, flagshipCurve } from "@/lib/data";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import Counter from "./Counter";
import GrowthChart from "./GrowthChart";
import Reveal from "./Reveal";

export default function Results() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const pinEl = pinRef.current!;
        const track = trackRef.current!;
        // Swap native horizontal scrolling for the scrubbed pan
        track.classList.remove("overflow-x-auto", "snap-x", "snap-mandatory", "pb-4");
        track.classList.add("overflow-visible");

        const amount = () => {
          const left = track.getBoundingClientRect().left;
          return Math.max(0, track.scrollWidth - window.innerWidth + left * 2);
        };
        const tween = gsap.to(track, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: pinEl,
            start: "top 14%",
            end: () => `+=${amount()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(track, { clearProps: "x" });
          track.classList.add("overflow-x-auto", "snap-x", "snap-mandatory", "pb-4");
          track.classList.remove("overflow-visible");
        };
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="results" className="relative py-24 sm:py-32">
      <div className="wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-5">Case studies</p>
          <h2 className="font-display text-display-lg font-semibold text-ink">
            Proof beats promises.
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Every engagement gets a baseline in week one and a number it has to
            answer to. Here's what that looks like when it compounds.
          </p>
        </Reveal>

        {/* Flagship: the Active Coachlines growth story */}
        <Reveal y={60} className="mt-14">
          <div className="glass grid gap-10 rounded-glass p-8 sm:p-12 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-mist">
                Flagship result · Active Coachlines
              </p>
              <h3 className="mt-4 font-display text-display-md font-semibold text-ink">
                From eight enquiries a month to a dial they control.
              </h3>
              <p className="mt-4 leading-relaxed">
                Active Coachlines needed a steadier route from trip searches to
                qualified charter requests. We clarified the service pages,
                pointed paid search at high-intent routes, and made quote
                follow-up part of the same acquisition system.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Paid Ads", "Landing Pages", "Automation"].map((tag) => (
                  <span
                    key={tag}
                    className="glass-chip rounded-full px-3.5 py-1.5 text-xs font-medium text-slate"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto grid grid-cols-3 gap-4 pt-10">
                {[
                  { value: "17×", label: "lead volume" },
                  { value: "−41%", label: "cost per lead" },
                  { value: "6 mo", label: "to peak volume" },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="font-display text-2xl font-semibold text-ink">
                      {m.value}
                    </p>
                    <p className="mt-1 text-sm text-mist">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[1.15rem] bg-white/50 p-6 sm:p-8">
              <div>
                <p className="text-sm font-medium text-mist">
                  Qualified enquiries, per month
                </p>
                <p className="mt-2 font-display text-[clamp(3.5rem,6vw,5.5rem)] font-semibold leading-none tracking-tight text-ink">
                  <span className="text-mist/70">8 → </span>
                  <Counter to={140} from={8} suffix="+" duration={2.4} />
                </p>
              </div>
              <div className="mt-8">
                <GrowthChart data={flagshipCurve} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Pinned horizontal case gallery (native swipe on touch / reduced motion) */}
      <div ref={pinRef} className="mt-20 lg:mt-28">
        <div className="wrap flex items-end justify-between gap-6">
          <Reveal>
            <h3 className="font-display text-display-md font-semibold text-ink">
              More receipts.
            </h3>
          </Reveal>
          <p
            className="hidden shrink-0 pb-2 text-sm text-mist lg:block"
            aria-hidden="true"
          >
            Keep scrolling — the shelf slides →
          </p>
        </div>
        <div className="wrap mt-8">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
          >
            {caseStudies.map((cs) => (
              <article
                key={cs.client}
                className="glass w-[min(85vw,480px)] shrink-0 snap-center overflow-hidden rounded-glass"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={cs.image.src}
                    alt={cs.alt}
                    width={cs.image.width}
                    height={cs.image.height}
                    placeholder="blur"
                    blurDataURL={cs.image.blurDataURL}
                    sizes="(min-width: 1024px) 480px, 85vw"
                    className="h-full w-full object-cover"
                  />
                  <div className="img-tint absolute inset-0" />
                  <div className="img-wash absolute inset-0 opacity-50" />
                  <p className="glass-chip absolute bottom-4 left-4 rounded-full px-3.5 py-1.5 text-xs font-medium text-ink">
                    {cs.sector}
                  </p>
                </div>
                <div className="flex flex-col p-7">
                  <h4 className="font-display text-display-sm font-semibold text-ink">
                    {cs.client}
                  </h4>
                  <p className="mt-3 leading-relaxed">{cs.story}</p>
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-ink/10 pt-6">
                    {cs.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="font-display text-xl font-semibold text-sky-deep">
                          {m.value}
                        </p>
                        <p className="mt-1 text-xs leading-snug text-mist">
                          {m.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}

            <div className="flex w-[min(70vw,380px)] shrink-0 snap-center flex-col items-start justify-center rounded-glass border border-dashed border-sky-deep/40 p-10">
              <p className="font-display text-display-sm font-semibold text-ink">
                Your chart goes here.
              </p>
              <p className="mt-3 leading-relaxed">
                The audit is free, and you keep the findings either way.
              </p>
              <a
                href="#contact"
                className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-deep"
              >
                Start the audit
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
