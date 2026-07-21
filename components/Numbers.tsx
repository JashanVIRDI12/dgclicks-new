"use client";

import { useRef } from "react";
import { bigNumbers } from "@/lib/data";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import styles from "./Numbers.module.css";

/**
 * DISTINCT IDEA — "the meter": the page's one azure-drenched surface is cut
 * on the diagonal of the client's own two-colour swatch. Each figure resolves
 * from zero as its ledger entry enters the viewport; the complete value stays
 * in the server-rendered HTML so no-JS and reduced-motion modes remain exact.
 */
export default function Numbers() {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const heading = root.querySelector<HTMLElement>("[data-numbers-heading]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-ledger-line]", root);
    const animations: gsap.core.Animation[] = [];
    const revealed = new WeakSet<Element>();

    const renderValue = (element: HTMLElement, value: number, decimals: number) => {
      element.textContent = value.toFixed(decimals);
    };

    const animateHeading = () => {
      if (!heading || revealed.has(heading)) return;
      revealed.add(heading);
      const tween = gsap.fromTo(
        heading,
        { autoAlpha: 0, x: -24 },
        { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
      );
      animations.push(tween);
    };

    const animateLine = (line: HTMLElement) => {
      if (revealed.has(line)) return;
      revealed.add(line);

      const counter = line.querySelector<HTMLElement>("[data-count]");
      const number = line.querySelector<HTMLElement>("[data-number-main]");
      const label = line.querySelector<HTMLElement>("[data-number-label]");
      const note = line.querySelector<HTMLElement>("[data-number-note]");
      const rule = line.querySelector<HTMLElement>("[data-number-rule]");
      if (!counter || !number) return;

      const value = Number(counter.dataset.value ?? 0);
      const decimals = Number(counter.dataset.decimals ?? 0);
      const state = { value: 0 };
      const lineIndex = Number(line.dataset.lineIndex ?? 0);
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          line,
          { xPercent: lineIndex % 2 ? 3 : -3 },
          { xPercent: 0, duration: 0.9 },
          0,
        )
        .fromTo(
          number,
          { autoAlpha: 0.2, y: 42, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.05 },
          0,
        )
        .to(
          state,
          {
            value,
            duration: 1.45,
            ease: "expo.out",
            snap: { value: decimals ? 0.1 : 1 },
            onUpdate: () => renderValue(counter, state.value, decimals),
            onComplete: () => renderValue(counter, value, decimals),
          },
          0.06,
        );

      if (label) {
        timeline.fromTo(
          label,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.58 },
          0.28,
        );
      }
      if (note) {
        timeline.fromTo(
          note,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.42,
        );
      }
      if (rule) {
        timeline.fromTo(
          rule,
          { scaleX: 0, transformOrigin: lineIndex % 2 ? "right" : "left" },
          { scaleX: 1, duration: 1.05, ease: "power2.inOut" },
          0.1,
        );
      }

      animations.push(timeline);
    };

    const targets = [heading, ...lines].filter(
      (target): target is HTMLElement => Boolean(target),
    );
    const viewportHeight = window.innerHeight;

    lines.forEach((line) => {
      const counter = line.querySelector<HTMLElement>("[data-count]");
      if (!counter) return;
      const value = Number(counter.dataset.value ?? 0);
      const decimals = Number(counter.dataset.decimals ?? 0);
      if (line.getBoundingClientRect().bottom <= 0) {
        renderValue(counter, value, decimals);
        revealed.add(line);
      } else {
        renderValue(counter, 0, decimals);
      }
    });

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            if (entry.target === heading) animateHeading();
            else if (entry.target instanceof HTMLElement) animateLine(entry.target);
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );

      targets.forEach((target) => {
        if (target.getBoundingClientRect().bottom > 0) observer?.observe(target);
      });
    } else {
      if (heading && heading.getBoundingClientRect().top < viewportHeight) {
        animateHeading();
      }
      lines.forEach(animateLine);
    }

    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.kill());
      lines.forEach((line) => {
        const counter = line.querySelector<HTMLElement>("[data-count]");
        if (!counter) return;
        renderValue(
          counter,
          Number(counter.dataset.value ?? 0),
          Number(counter.dataset.decimals ?? 0),
        );
      });
      gsap.set(
        root.querySelectorAll(
          "[data-numbers-heading], [data-ledger-line], [data-number-main], [data-number-label], [data-number-note], [data-number-rule]",
        ),
        { clearProps: "transform,opacity,visibility,will-change" },
      );
    };
  }, []);

  return (
    <section ref={rootRef} className="relative" aria-label="Results in numbers">
      {/* Painted seams: the dark field fills the clipped area, so the cap
          reads as a transition instead of a transparent block in the flow. */}
      <div
        aria-hidden="true"
        className={`${styles.seam} ${styles.seamTop}`}
      >
        <div className={styles.accentTop} />
        <div className={styles.skyTop} />
      </div>

      <div className="bg-sky py-16 text-night sm:py-24">
        <div className="wrap">
          <h2
            data-numbers-heading
            className="max-w-2xl font-display text-display-md font-semibold text-white"
          >
            The ledger we ask to be judged on.
          </h2>
          {bigNumbers.map((n, i) => (
            <div
              key={n.label}
              data-ledger-line
              data-line-index={i}
              className={`relative flex flex-col overflow-hidden py-10 sm:py-12 ${
                i % 2 ? "items-end text-right" : "items-start text-left"
              }`}
            >
              <p className="flex max-w-full flex-col font-display font-semibold tracking-tight text-night sm:block">
                <span
                  data-number-main
                  className="font-mono text-[clamp(4.5rem,15vw,13rem)] tabular-nums"
                >
                  <span className="sr-only">
                    {n.value.toFixed(n.decimals ?? 0)}{n.suffix}
                  </span>
                  <span aria-hidden="true" className="inline-flex items-start leading-[0.9]">
                    <span
                      data-count
                      data-value={n.value}
                      data-decimals={n.decimals ?? 0}
                    >
                      {n.value.toFixed(n.decimals ?? 0)}
                    </span>
                    <span className="ml-[0.08em] text-[0.48em] leading-none text-white">
                      {n.suffix}
                    </span>
                  </span>
                </span>
                <span
                  data-number-label
                  className="mt-2 max-w-[18rem] align-middle font-display text-[clamp(1.1rem,2.4vw,1.8rem)] font-medium leading-tight text-night sm:ml-6 sm:mt-0"
                >
                  {n.label}
                </span>
              </p>
              <p
                data-number-note
                className={`mt-3 max-w-md text-sm font-medium leading-relaxed text-night ${i % 2 ? "text-right" : ""}`}
              >
                {n.note}
              </p>
              <span
                data-number-rule
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-night/25"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className={`${styles.seam} ${styles.seamBottom}`}
      >
        <div className={styles.accentBottom} />
        <div className={styles.skyBottom} />
      </div>
    </section>
  );
}
