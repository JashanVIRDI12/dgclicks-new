"use client";

import Image from "next/image";
import { useRef } from "react";
import { caseStudies } from "@/lib/data";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import styles from "./Work.module.css";

export default function Work() {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const header = root.querySelector<HTMLElement>("[data-work-header]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-case-card]", root);
    const footer = root.querySelector<HTMLElement>("[data-work-footer]");
    const animations: gsap.core.Animation[] = [];
    const revealed = new WeakSet<Element>();

    cards.forEach((card, index) => {
      const curtain = card.querySelector<HTMLElement>("[data-develop-curtain]");
      if (!curtain) return;
      gsap.set(curtain, {
        scaleX: 1,
        transformOrigin: index % 2 === 0 ? "right center" : "left center",
      });
    });

    const animateHeader = () => {
      if (!header || revealed.has(header)) return;
      revealed.add(header);
      const headingParts = Array.from(
        header.querySelectorAll<HTMLElement>(
          "[data-work-heading], [data-work-intro]",
        ),
      );
      const kickerLine = header.querySelector<HTMLElement>("[data-kicker-line]");
      const timeline = gsap.timeline();

      if (kickerLine) {
        timeline.fromTo(
          kickerLine,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.55, ease: "power3.out" },
        );
      }

      timeline.fromTo(
        headingParts,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
        },
        kickerLine ? "-=0.28" : 0,
      );
      animations.push(timeline);
    };

    const animateCard = (card: HTMLElement) => {
      if (revealed.has(card)) return;
      revealed.add(card);
      const figure = card.querySelector<HTMLElement>("[data-case-figure]");
      const image = card.querySelector<HTMLElement>("[data-case-image]");
      const curtain = card.querySelector<HTMLElement>("[data-develop-curtain]");
      const scanner = card.querySelector<HTMLElement>("[data-scan-line]");
      const metricParts = Array.from(
        card.querySelectorAll<HTMLElement>("[data-case-metric] > *"),
      );
      const copyParts = Array.from(
        card.querySelectorAll<HTMLElement>("[data-case-copy] > *"),
      );
      const resultRule = card.querySelector<HTMLElement>("[data-result-rule]");
      if (!figure || !image || !curtain) return;

      const cardIndex = Number(card.dataset.caseIndex ?? 0);

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(
          card,
          { autoAlpha: 0, x: cardIndex % 2 ? 38 : -38, y: 26 },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.68 },
        )
        .to(
          curtain,
          { scaleX: 0, duration: 0.92, ease: "expo.inOut" },
          "-=0.18",
        )
        .fromTo(
          image,
          { scale: 1.13 },
          { scale: 1.06, duration: 1.15, ease: "power2.out" },
          "<",
        )
        .fromTo(
          metricParts,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.52",
        )
        .fromTo(
          copyParts,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.055,
          },
          "-=0.38",
        );

      if (resultRule) {
        timeline.fromTo(
          resultRule,
          {
            scaleX: 0,
            transformOrigin: cardIndex % 2 ? "right center" : "left center",
          },
          { scaleX: 1, duration: 0.72, ease: "power3.inOut" },
          0.78,
        );
      }

      if (scanner) {
        timeline
          .fromTo(
            scanner,
            { autoAlpha: 0, x: 0 },
            {
              autoAlpha: 1,
              x: Math.max(figure.clientWidth - 1, 0),
              duration: 0.72,
              ease: "power2.inOut",
            },
            0.35,
          )
          .to(scanner, { autoAlpha: 0, duration: 0.2 }, 1.02);
      }
      animations.push(timeline);
    };

    const animateFooter = () => {
      if (!footer || revealed.has(footer)) return;
      revealed.add(footer);
      const tween = gsap.fromTo(
        Array.from(footer.children),
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
      animations.push(tween);
    };

    const revealTarget = (target: Element) => {
      if (target === header) animateHeader();
      else if (target === footer) animateFooter();
      else if (target instanceof HTMLElement) animateCard(target);
    };

    let observer: IntersectionObserver | null = null;
    const targets = [header, ...cards, footer].filter(
      (target): target is HTMLElement => Boolean(target),
    );

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealTarget(entry.target);
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
      );
      targets.forEach((target) => observer?.observe(target));
    } else {
      targets.forEach(revealTarget);
    }

    const desktop = window.matchMedia("(min-width: 768px)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const images = cards
      .map((card) => card.querySelector<HTMLElement>("[data-case-image]"))
      .filter((image): image is HTMLElement => Boolean(image));
    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      if (!desktop.matches) return;
      const viewportHeight = Math.max(window.innerHeight, 1);
      images.forEach((image) => {
        const card = image.closest<HTMLElement>("[data-case-card]");
        if (!card) return;
        const bounds = card.getBoundingClientRect();
        const progress = gsap.utils.clamp(
          0,
          1,
          (viewportHeight - bounds.top) / (viewportHeight + bounds.height),
        );
        gsap.set(image, { yPercent: -3.5 + progress * 7 });
      });
    };

    const requestParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    const syncParallax = () => {
      if (!desktop.matches) gsap.set(images, { yPercent: 0 });
      requestParallax();
    };

    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
    desktop.addEventListener("change", syncParallax);
    requestParallax();

    const pointerCleanups: Array<() => void> = [];
    if (finePointer.matches) {
      cards.forEach((card) => {
        const figure = card.querySelector<HTMLElement>("[data-case-figure]");
        const image = card.querySelector<HTMLElement>("[data-case-image]");
        if (!figure || !image) return;

        const moveImage = gsap.quickTo(image, "xPercent", {
          duration: 0.6,
          ease: "power3.out",
        });
        const onPointerMove = (event: PointerEvent) => {
          const bounds = figure.getBoundingClientRect();
          const progress =
            (event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5;
          moveImage(progress * 2.4);
        };
        const onPointerLeave = () => moveImage(0);

        figure.addEventListener("pointermove", onPointerMove, { passive: true });
        figure.addEventListener("pointerleave", onPointerLeave);
        pointerCleanups.push(() => {
          figure.removeEventListener("pointermove", onPointerMove);
          figure.removeEventListener("pointerleave", onPointerLeave);
        });
      });
    }

    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.kill());
      window.removeEventListener("scroll", requestParallax);
      window.removeEventListener("resize", requestParallax);
      desktop.removeEventListener("change", syncParallax);
      pointerCleanups.forEach((cleanup) => cleanup());
      gsap.killTweensOf(images);
      if (frame) window.cancelAnimationFrame(frame);
      gsap.set(
        root.querySelectorAll(
          "[data-work-heading], [data-work-intro], [data-kicker-line], [data-case-card], [data-case-card] *, [data-work-footer] > *",
        ),
        { clearProps: "transform,opacity,visibility,will-change" },
      );
    };
  }, []);

  return (
    <section
      id="results"
      ref={rootRef}
      className={styles.section}
      aria-labelledby="work-title"
    >
      <div className={`${styles.inner} wrap`}>
        <header className={styles.header} data-work-header>
          <div className={styles.headingBlock}>
            <p className={styles.kicker}>
              <span data-kicker-line aria-hidden="true" />
              Selected client work
            </p>
            <h2 id="work-title" data-work-heading>
              Built to make business move.
            </h2>
          </div>
          <div className={styles.headerAside} data-work-intro>
            <p>
              Six growth systems, shown through the problem, the work, and the
              commercial outcome they were built to move.
            </p>
            <div className={styles.archiveCount}>
              <strong>{String(caseStudies.length).padStart(2, "0")}</strong>
              <span>case files<br />in the archive</span>
            </div>
          </div>
        </header>

        <div className={styles.caseList}>
          {caseStudies.map((study, index) => (
            <article
              key={study.client}
              className={styles.caseCard}
              data-case-card
              data-case-index={index}
            >
              <div className={styles.caseRail}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                  <i>/</i>
                  {String(caseStudies.length).padStart(2, "0")}
                </span>
                <span className={styles.sector}>{study.sector}</span>
                <span className={styles.railStatus}>Recorded outcome</span>
              </div>

              <div className={styles.caseBody}>
                <figure className={styles.figure} data-case-figure>
                  <Image
                    src={study.webglImage.src}
                    alt={study.alt}
                    fill
                    sizes="(min-width: 1200px) 58vw, (min-width: 768px) 54vw, 100vw"
                    placeholder="blur"
                    blurDataURL={study.image.blurDataURL}
                    className={styles.image}
                    data-case-image
                  />
                  <div className={styles.imageShade} aria-hidden="true" />
                  <span
                    className={styles.developCurtain}
                    data-develop-curtain
                    aria-hidden="true"
                  />
                  <span
                    className={styles.scanLine}
                    data-scan-line
                    aria-hidden="true"
                  />
                  <figcaption className={styles.imageCaption}>
                    <span>DG / CASE {String(index + 1).padStart(2, "0")}</span>
                    <span>{study.services[0]}</span>
                  </figcaption>
                </figure>

                <div className={styles.copy} data-case-copy>
                  <div className={styles.metric} data-case-metric>
                    <span>Primary outcome</span>
                    <strong>{study.metrics[0].value}</strong>
                    <p>{study.metrics[0].label}</p>
                    <i data-result-rule aria-hidden="true" />
                  </div>

                  <div className={styles.caseStory}>
                    <h3>{study.client}</h3>
                    <p className={styles.story}>{study.story}</p>
                  </div>

                  <ul className={styles.services} aria-label="Services provided">
                    {study.services.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>

                  <a className={styles.caseCta} href="/contact">
                    Build a system like this
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <footer className={styles.footer} data-work-footer>
          <div>
            <span>Have a number you need to move?</span>
            <strong>Let’s build the system behind it.</strong>
          </div>
          <a href="/contact">
            Start a project
            <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </div>
    </section>
  );
}
