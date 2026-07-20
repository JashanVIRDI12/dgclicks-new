"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Marquee from "@/components/Marquee";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import BlueprintMagneticButton from "./BlueprintMagneticButton";
import ServiceChapter from "./ServiceChapter";
import ServiceNavigator from "./ServiceNavigator";
import { SERVICES } from "./services-data";
import styles from "./ServicesUi.module.css";

const MARQUEE_STATS = [
  "63 page-one keywords",
  "0.8s median load",
  "8 → 140+ enquiries/month",
  "One visual system",
  "Four-week publishing rhythm",
] as const;

export default function ServicesExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const redrawTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const triggers: ScrollTrigger[] = [];
    const context = gsap.context(() => {
      SERVICES.forEach((service, index) => {
        const chapter = document.getElementById(`service-panel-${service.id}`);
        if (!chapter) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: chapter,
            start: "top 54%",
            end: "bottom 46%",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          }),
        );
      });
    }, root);

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      context.revert();
    };
  }, []);

  useEffect(
    () => () => {
      if (redrawTimeoutRef.current !== null) {
        window.clearTimeout(redrawTimeoutRef.current);
      }
    },
    [],
  );

  const navigateTo = useCallback(
    (index: number) => {
      const targetService = SERVICES[index];
      const currentService = SERVICES[activeIndex];
      if (!targetService) return;

      if (currentService && currentService.id !== targetService.id) {
        window.dispatchEvent(
          new CustomEvent("blueprint:exit", {
            detail: { id: currentService.id },
          }),
        );
      }

      setActiveIndex(index);
      const target = document.getElementById(
        `service-panel-${targetService.id}`,
      );
      if (!target) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lenis = getLenis();
      if (lenis && !reduced) {
        lenis.scrollTo(target, { offset: -116, duration: 1.15 });
      } else {
        target.scrollIntoView({
          block: "start",
          behavior: reduced ? "auto" : "smooth",
        });
      }

      if (redrawTimeoutRef.current !== null) {
        window.clearTimeout(redrawTimeoutRef.current);
      }
      redrawTimeoutRef.current = window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("blueprint:redraw", {
            detail: { id: targetService.id },
          }),
        );
      }, reduced ? 0 : 360);
    },
    [activeIndex],
  );

  return (
    <div ref={rootRef} className={styles.blueprintPage}>
      <div className={styles.pageGrain} aria-hidden="true" />

      <section className={styles.hero} aria-labelledby="services-title">
        <div className={styles.heroCalibration} aria-hidden="true">
          <span>DG / GROWTH SYSTEMS</span>
          <span>ISSUE 07.2026</span>
          <span>SCALE 1:1</span>
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.heroMarker}>The blueprint</p>
          <h1 id="services-title">See how the work connects.</h1>
          <p>
            Five commercial disciplines, drawn as the systems they actually
            operate. Inspect the plan, follow each handoff, then start with the
            blockage closest to revenue.
          </p>
          <div className={styles.heroActions}>
            <BlueprintMagneticButton href="#service-panel-seo">
              Open drawing 01
            </BlueprintMagneticButton>
            <a className={styles.heroTextLink} href="/#contact">
              Start with an audit <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <div className={styles.heroIndex} aria-label="Blueprint contents">
          {SERVICES.map((service, index) => (
            <a key={service.id} href={`#service-panel-${service.id}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{service.name}</strong>
              <span aria-hidden="true">↘</span>
            </a>
          ))}
        </div>
      </section>

      <div className={styles.navigatorDock}>
        <ServiceNavigator
          activeIndex={activeIndex}
          onSelect={navigateTo}
          services={SERVICES}
        />
      </div>

      <div className={styles.chapters}>
        {SERVICES.map((service, index) => (
          <ServiceChapter
            key={service.id}
            active={activeIndex === index}
            index={index}
            service={service}
          />
        ))}
      </div>

      <section className={styles.finale} aria-labelledby="services-finale-title">
        <div className={styles.finaleDiagram} aria-hidden="true">
          <span>01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
          <span>05</span>
        </div>
        <div className={styles.finaleCopy}>
          <p>Issue the first work order</p>
          <h2 id="services-finale-title">
            Start with the bottleneck. Connect only what earns its place.
          </h2>
          <p>
            The audit identifies the blocked handoff, the evidence behind it,
            and the smallest connected scope that can move revenue.
          </p>
          <BlueprintMagneticButton href="/#contact">
            Book a free growth audit
          </BlueprintMagneticButton>
        </div>
      </section>

      <section className={styles.marqueeSection} aria-label="Recorded outcomes">
        <Marquee
          className={styles.servicesMarquee}
          speed={48}
          velocityReactive
        >
          {MARQUEE_STATS.map((stat) => (
            <span key={stat} className={styles.marqueeItem}>
              <span aria-hidden="true">◆</span>
              {stat}
            </span>
          ))}
        </Marquee>
      </section>
    </div>
  );
}
