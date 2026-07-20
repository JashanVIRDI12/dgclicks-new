"use client";

import { useRef } from "react";
import SplitType from "split-type";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import BlueprintDiagram from "./BlueprintDiagram";
import BlueprintMagneticButton from "./BlueprintMagneticButton";
import type { ServiceDefinition } from "./services-data";
import styles from "./ServicesUi.module.css";

type ServiceChapterProps = {
  active: boolean;
  index: number;
  service: ServiceDefinition;
};

const DRAWING_CODES: Record<ServiceDefinition["id"], string> = {
  seo: "CRAWL / A-01",
  "website-design": "BUILD / B-02",
  "paid-ads": "FUNNEL / C-03",
  "graphic-design": "MARK / D-04",
  "social-media-management": "FEED / E-05",
};

export default function ServiceChapter({
  active,
  index,
  service,
}: ServiceChapterProps) {
  const chapterRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useIsoLayoutEffect(() => {
    const chapter = chapterRef.current;
    const heading = headingRef.current;
    if (!chapter || !heading) return;

    let split: SplitType | null = null;
    let cancelled = false;
    const animations: gsap.core.Animation[] = [];

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const safeStaticHeading = window.matchMedia(
        "(max-width: 767px), (pointer: coarse)",
      ).matches;

      if (reduced || safeStaticHeading) {
        animations.push(
          gsap.from(heading, {
            opacity: 0,
            duration: 0.35,
            scrollTrigger: { trigger: heading, start: "top 88%", once: true },
          }),
        );
      } else {
        split = new SplitType(heading, { types: "words" });
        animations.push(
          gsap.from(split.words, {
            yPercent: 105,
            opacity: 0,
            duration: 0.82,
            ease: "power4.out",
            stagger: 0.045,
            scrollTrigger: {
              trigger: heading,
              start: "top 84%",
              once: true,
            },
          }),
        );
      }

      const rows = Array.from(
        chapter.querySelectorAll<HTMLElement>("[data-deliverable-row]"),
      );
      const rules = Array.from(
        chapter.querySelectorAll<HTMLElement>("[data-deliverable-rule]"),
      );
      const numbers = Array.from(
        chapter.querySelectorAll<HTMLElement>("[data-deliverable-number]"),
      );
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: chapter.querySelector("[data-deliverables]"),
          start: "top 84%",
          once: true,
        },
      });
      timeline.from(rows, {
        y: reduced ? 0 : 14,
        opacity: 0,
        duration: reduced ? 0.25 : 0.55,
        ease: "power3.out",
        stagger: reduced ? 0 : 0.075,
      });
      timeline.from(
        rules,
        {
          scaleX: 0,
          duration: reduced ? 0.25 : 0.72,
          ease: "power3.out",
          stagger: reduced ? 0 : 0.08,
        },
        0.04,
      );
      if (!reduced) {
        numbers.forEach((number, numberIndex) => {
          const finalValue = Number(number.dataset.deliverableNumber ?? 0);
          const counter = { value: 0 };
          timeline.to(
            counter,
            {
              value: finalValue,
              duration: 0.62,
              ease: "power3.out",
              onStart: () => {
                number.textContent = "00";
              },
              onUpdate: () => {
                number.textContent = Math.round(counter.value)
                  .toString()
                  .padStart(2, "0");
              },
            },
            0.08 + numberIndex * 0.07,
          );
        });
      }
      animations.push(timeline);
    });

    return () => {
      cancelled = true;
      animations.forEach((animation) => animation.kill());
      split?.revert();
    };
  }, []);

  return (
    <article
      ref={chapterRef}
      id={`service-panel-${service.id}`}
      className={styles.chapter}
      data-service-id={service.id}
      data-chapter-index={index}
      aria-labelledby={`service-heading-${service.id}`}
    >
      <BlueprintDiagram
        active={active}
        index={index}
        service={service}
      />

      <div className={styles.chapterContent}>
        <header className={styles.chapterHeader}>
          <p className={styles.chapterEyebrow}>
            <span>SERVICE {String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true">/</span>
            <span>{DRAWING_CODES[service.id]}</span>
          </p>
          <h2
            ref={headingRef}
            id={`service-heading-${service.id}`}
            className={styles.chapterHeading}
          >
            {service.name}
          </h2>
          <p className={styles.chapterPromise}>{service.headline}</p>
        </header>

        <div className={styles.chapterBody}>
          {service.copy.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <section
          className={styles.deliverablesBlock}
          aria-label={`${service.name} deliverables`}
          data-deliverables
        >
          <div className={styles.deliverablesHeader}>
            <h3>What we ship</h3>
            <span>Issued for growth</span>
          </div>
          <ol className={styles.deliverables}>
            {service.deliverables.map((deliverable, deliverableIndex) => (
              <li key={deliverable} data-deliverable-row>
                <span
                  className={styles.deliverableNumber}
                  data-deliverable-number={deliverableIndex + 1}
                  aria-hidden="true"
                >
                  {String(deliverableIndex + 1).padStart(2, "0")}
                </span>
                <span>{deliverable}</span>
                <span
                  className={styles.deliverableRule}
                  data-deliverable-rule
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </section>

        <BlueprintMagneticButton href="/#contact" variant="secondary">
          Discuss {service.name}
        </BlueprintMagneticButton>
      </div>
    </article>
  );
}
