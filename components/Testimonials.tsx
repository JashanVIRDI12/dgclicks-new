"use client";

import type { FocusEvent as ReactFocusEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/data";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import styles from "./Testimonials.module.css";

const HOLD_SECONDS = 9;

/**
 * DISTINCT IDEA — "the client ledger": each voice is filed beside the
 * outcome it produced. The panel stays structurally stable while the active
 * entry changes, and the reader has explicit control over rotation.
 */
export default function Testimonials() {
  const count = testimonials.length;
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const progressTween = useRef<gsap.core.Tween | null>(null);
  const [active, setActive] = useState(0);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "10% 0px", threshold: 0.15 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useIsoLayoutEffect(() => {
    const stage = stageRef.current;
    const panel = stage?.querySelector<HTMLElement>("[data-review-active='true']");
    if (!stage || !panel) return;

    if (reducedMotion) {
      gsap.set(panel, { clearProps: "transform,opacity,clipPath" });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        panel,
        { x: 18, opacity: 0, clipPath: "inset(0 0 0 4%)" },
        {
          x: 0,
          opacity: 1,
          clipPath: "inset(0 0 0 0%)",
          duration: 0.58,
          ease: "power3.out",
          clearProps: "transform,opacity,clipPath",
        },
      );
      const rule = panel.querySelector<HTMLElement>("[data-outcome-rule]");
      if (rule) {
        gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out" });
      }
    }, stage);

    return () => context.revert();
  }, [active, reducedMotion]);

  useEffect(() => {
    const progress = progressRef.current;
    progressTween.current?.kill();
    if (!progress || count < 2) return;

    gsap.set(progress, { scaleX: 0 });
    progressTween.current = gsap.to(progress, {
      scaleX: 1,
      duration: HOLD_SECONDS,
      ease: "none",
      paused: true,
      onComplete: () => setActive((current) => (current + 1) % count),
    });

    return () => {
      progressTween.current?.kill();
      progressTween.current = null;
    };
  }, [active, count]);

  const shouldRotate =
    count > 1 &&
    !autoplayPaused &&
    !interactionPaused &&
    !reducedMotion &&
    inView &&
    pageVisible;

  useEffect(() => {
    progressTween.current?.paused(!shouldRotate);
  }, [active, shouldRotate]);

  const moveTo = useCallback(
    (nextIndex: number) => {
      if (count < 2) return;
      const next = (nextIndex + count) % count;
      const item = testimonials[next];
      setActive(next);
      setAutoplayPaused(true);
      setAnnouncement(
        `Showing review ${next + 1} of ${count} from ${item.name}, ${item.role}.`,
      );
    },
    [count],
  );

  const handleBlur = (event: ReactFocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setInteractionPaused(false);
    }
  };

  if (count === 0) return null;

  return (
    <section
      id="reviews"
      ref={rootRef}
      className={styles.section}
      aria-labelledby="reviews-title"
      onPointerEnter={() => setInteractionPaused(true)}
      onPointerLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={handleBlur}
    >
      <div className="wrap">
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Client ledger / {String(count).padStart(2, "0")} field notes</p>
            <h2 id="reviews-title" className={styles.title}>
              What the dashboard can&apos;t say.
            </h2>
          </div>
          <p className={styles.intro}>
            The numbers tell us what moved. These are the moments clients noticed the system working in real life.
          </p>
        </header>

        <div id="client-review-stage" ref={stageRef} className={styles.ledger}>
          <div className={styles.panelStack}>
            {testimonials.map((item, index) => {
              const isActive = index === active;
              return (
                <article
                  key={item.id}
                  data-review-active={isActive ? "true" : "false"}
                  aria-hidden={!isActive}
                  className={`${styles.panel} ${isActive ? styles.panelActive : ""}`}
                >
                  <div className={styles.evidence}>
                    <div className={styles.evidenceTopline}>
                      <span>Outcome on record</span>
                      <span className={styles.index}>
                        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                      </span>
                    </div>
                    <p className={styles.result}>{item.result}</p>
                    <span data-outcome-rule className={styles.outcomeRule} aria-hidden="true" />
                  </div>

                  <figure className={styles.quoteFigure}>
                    <span className={styles.voiceLabel}>
                      <span aria-hidden="true" className={styles.quoteMark}>&ldquo;</span>
                      Client voice
                    </span>
                    <blockquote className={styles.quote}>{item.quote}</blockquote>
                    <figcaption className={styles.attribution}>
                      <span>{item.name}</span>
                      <span>{item.role}</span>
                    </figcaption>
                  </figure>
                </article>
              );
            })}
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.controlButton} ${styles.previous}`}
              onClick={() => moveTo(active - 1)}
              aria-controls="client-review-stage"
            >
              <span aria-hidden="true">←</span> Previous
            </button>

            <div className={styles.timeline} aria-hidden="true">
              <span>Rotation</span>
              <span className={styles.progressTrack}>
                <span ref={progressRef} className={styles.progressFill} />
              </span>
              <span className={styles.currentCount}>
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              className={`${styles.controlButton} ${styles.pause}`}
              data-state={!reducedMotion && !autoplayPaused ? "on" : "off"}
              onClick={() =>
                setAutoplayPaused((value) => {
                  const next = !value;
                  if (!next) setInteractionPaused(false);
                  return next;
                })
              }
              aria-controls="client-review-stage"
              aria-pressed={!reducedMotion && !autoplayPaused}
              disabled={reducedMotion}
            >
              <span>Auto-rotate</span>
              <span className={styles.toggleState}>
                {!reducedMotion && !autoplayPaused ? "On" : "Off"}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.controlButton} ${styles.next}`}
              onClick={() => moveTo(active + 1)}
              aria-controls="client-review-stage"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </div>
    </section>
  );
}
