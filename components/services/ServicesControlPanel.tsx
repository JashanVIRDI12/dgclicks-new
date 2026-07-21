"use client";

import { useCallback, useRef } from "react";
import { getLenis } from "@/lib/lenis";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
  useIsoLayoutEffect,
} from "@/lib/gsap";
import { CONTROL_SERVICES, type ControlServiceId } from "./control-panel-data";
import ServiceMechanism from "./ServiceMechanisms";
import styles from "./ServicesControlPanel.module.css";

const layoutClass = {
  "copy-left": styles.copyLeft,
  "copy-right": styles.copyRight,
  wide: styles.widePanel,
} as const;

const toneClass = {
  cloud: styles.toneCloud,
  ice: styles.toneIce,
  white: styles.toneWhite,
  night: styles.toneNight,
  azure: styles.toneAzure,
} as const;

function setText(element: Element | null, value: string) {
  if (element) element.textContent = value;
}

function setActiveRail(
  root: HTMLElement,
  links: readonly HTMLAnchorElement[],
  index: number,
) {
  root.dataset.activeService = CONTROL_SERVICES[index]?.id ?? "";
  links.forEach((link, linkIndex) => {
    if (linkIndex === index) {
      link.dataset.active = "true";
      link.setAttribute("aria-current", "location");
    } else {
      delete link.dataset.active;
      link.removeAttribute("aria-current");
    }
  });
}

function animateSeo(timeline: gsap.core.Timeline, panel: HTMLElement) {
  const target = panel.querySelector<HTMLElement>("[data-seo-target]");
  const rank = panel.querySelector("[data-seo-rank]");
  const cardRank = panel.querySelector("[data-seo-card-rank]");
  const state = { value: 18 };

  timeline.from(
    target,
    {
      y: 232,
      scale: 0.94,
      opacity: 0.45,
      duration: 0.66,
    },
    0.16,
  );
  timeline.to(
    state,
    {
      value: 3,
      duration: 0.66,
      onUpdate: () => {
        const value = String(Math.round(state.value));
        setText(rank, value);
        setText(cardRank, value);
      },
    },
    0.16,
  );
  timeline.from(
    panel.querySelectorAll("[data-seo-health], [data-seo-intent]"),
    {
      scaleX: 0.22,
      transformOrigin: "left center",
      duration: 0.58,
      stagger: 0.08,
    },
    0.3,
  );
}

function animateWebsite(timeline: gsap.core.Timeline, panel: HTMLElement) {
  const pieces = Array.from(
    panel.querySelectorAll<SVGGElement>("[data-web-piece]"),
  );
  timeline.from(
    pieces,
    {
      x: (_, element) => Number((element as SVGElement).dataset.fromX ?? 0),
      y: (_, element) => Number((element as SVGElement).dataset.fromY ?? 0),
      rotation: (_, element) =>
        Number((element as SVGElement).dataset.fromRotate ?? 0),
      transformBox: "fill-box",
      transformOrigin: "center",
      opacity: 0.12,
      duration: 0.58,
      stagger: 0.065,
    },
    0.12,
  );
  timeline.from(
    panel.querySelector("[data-web-route]"),
    {
      drawSVG: "0%",
      duration: 0.44,
    },
    0.48,
  );
}

function animateAds(timeline: gsap.core.Timeline, panel: HTMLElement) {
  const leads = panel.querySelector("[data-ads-leads]");
  const cpl = panel.querySelector("[data-ads-cpl]");
  const state = { leads: 20, cpl: 300 };

  timeline.from(
    panel.querySelectorAll("[data-ad-packet]"),
    {
      x: -180,
      opacity: 0.12,
      duration: 0.54,
      stagger: 0.035,
    },
    0.14,
  );
  timeline.to(
    state,
    {
      leads: 36,
      cpl: 167,
      duration: 0.68,
      onUpdate: () => {
        setText(leads, String(Math.round(state.leads)));
        setText(cpl, String(Math.round(state.cpl)));
      },
    },
    0.18,
  );
  timeline.from(
    panel.querySelector("[data-ads-waste]"),
    {
      scaleX: 2.7,
      transformOrigin: "left center",
      duration: 0.62,
    },
    0.22,
  );
  timeline.from(
    panel.querySelector("[data-ads-quality]"),
    {
      scaleX: 0.38,
      transformOrigin: "left center",
      duration: 0.62,
    },
    0.22,
  );
}

function animateSocial(timeline: gsap.core.Timeline, panel: HTMLElement) {
  const saves = panel.querySelector("[data-social-saves]");
  const replies = panel.querySelector("[data-social-replies]");
  const visits = panel.querySelector("[data-social-visits]");
  const state = { saves: 0, replies: 0, visits: 0 };

  timeline.from(
    panel.querySelector("[data-social-path]"),
    {
      drawSVG: "0%",
      duration: 0.72,
    },
    0.12,
  );
  timeline.from(
    panel.querySelector("[data-social-area]"),
    {
      clipPath: "inset(0 100% 0 0)",
      opacity: 0,
      duration: 0.68,
    },
    0.14,
  );
  timeline.from(
    panel.querySelectorAll("[data-social-point]"),
    {
      scale: 0,
      transformBox: "fill-box",
      transformOrigin: "center",
      duration: 0.34,
      stagger: 0.075,
    },
    0.28,
  );
  timeline.to(
    state,
    {
      saves: 14,
      replies: 9,
      visits: 31,
      duration: 0.68,
      onUpdate: () => {
        setText(saves, String(Math.round(state.saves)));
        setText(replies, String(Math.round(state.replies)));
        setText(visits, String(Math.round(state.visits)));
      },
    },
    0.16,
  );
}

function animateDesign(timeline: gsap.core.Timeline, panel: HTMLElement) {
  const parts = Array.from(
    panel.querySelectorAll<SVGPathElement>("[data-design-part]"),
  );
  timeline.from(
    parts,
    {
      x: (_, element) => Number((element as SVGElement).dataset.fromX ?? 0),
      y: (_, element) => Number((element as SVGElement).dataset.fromY ?? 0),
      rotation: (_, element) =>
        Number((element as SVGElement).dataset.fromRotate ?? 0),
      transformBox: "fill-box",
      transformOrigin: "center",
      opacity: 0.18,
      duration: 0.62,
      stagger: 0.075,
    },
    0.12,
  );
  timeline.to(
    panel.querySelector("[data-design-sources]"),
    {
      opacity: 0.12,
      duration: 0.3,
    },
    0.46,
  );
  timeline.from(
    panel.querySelector("[data-design-stroke]"),
    {
      drawSVG: "0%",
      duration: 0.34,
    },
    0.56,
  );
  timeline.from(
    panel.querySelectorAll("[data-design-output]"),
    {
      clipPath: "inset(0 100% 0 0)",
      duration: 0.36,
      stagger: 0.055,
    },
    0.62,
  );
}

function animateMechanism(
  serviceId: ControlServiceId,
  timeline: gsap.core.Timeline,
  panel: HTMLElement,
) {
  switch (serviceId) {
    case "seo":
      animateSeo(timeline, panel);
      break;
    case "website-design":
      animateWebsite(timeline, panel);
      break;
    case "paid-ads":
      animateAds(timeline, panel);
      break;
    case "social-media-management":
      animateSocial(timeline, panel);
      break;
    case "graphic-design":
      animateDesign(timeline, panel);
      break;
  }
}

export default function ServicesControlPanel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const railPulseRef = useRef<HTMLSpanElement>(null);
  const finaleRef = useRef<HTMLElement>(null);

  const scrollToService = useCallback(
    (serviceId: ControlServiceId) =>
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        const target = document.getElementById("service-panel-" + serviceId);
        if (!target) return;
        event.preventDefault();
        const lenis = getLenis();
        if (lenis && !prefersReducedMotion()) {
          lenis.scrollTo(target, { duration: 1.15 });
        } else {
          target.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start",
          });
        }
        window.history.replaceState(null, "", "#service-panel-" + serviceId);
      },
    [],
  );

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    const pulse = railPulseRef.current;
    if (!root || !rail || !pulse) return;

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-service-panel]"),
    );
    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-service-scene]"),
    );
    const railLinks = Array.from(
      rail.querySelectorAll<HTMLAnchorElement>("[data-signal-link]"),
    );
    const railFills = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-signal-fill]"),
    );
    const media = gsap.matchMedia();
    let cancelled = false;

    const navigationContext = gsap.context(() => {
      scenes.forEach((scene, index) => {
        ScrollTrigger.create({
          trigger: scene,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveRail(root, railLinks, index),
          onEnterBack: () => setActiveRail(root, railLinks, index),
        });
      });

      if (scenes[0] && scenes.at(-1)) {
        ScrollTrigger.create({
          trigger: scenes[0],
          endTrigger: scenes.at(-1),
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            gsap.set(pulse, { scaleY: self.progress });
          },
        });
      }

      if (finaleRef.current) {
        ScrollTrigger.create({
          trigger: finaleRef.current,
          start: "top 76%",
          onEnter: () => gsap.set(rail, { autoAlpha: 0 }),
          onLeaveBack: () => gsap.set(rail, { autoAlpha: 1 }),
        });
      }
    }, root);

    document.fonts.ready.then(() => {
      if (cancelled) return;

      media.add(
        "(min-width: 56rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const splits: SplitText[] = [];
          const animationContext = gsap.context(() => {
            panels.forEach((panel, index) => {
              const scene = panel.closest<HTMLElement>("[data-service-scene]");
              const heading = panel.querySelector<HTMLElement>(
                "[data-service-headline]",
              );
              if (!scene || !heading) return;

              const split = SplitText.create(heading, {
                type: "words,chars",
                mask: index % 2 === 0 ? "chars" : "words",
                aria: "auto",
              });
              splits.push(split);

              const timeline = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: scene,
                  start: "top top",
                  end: () => "+=" + Math.max(window.innerHeight * 1.12, 860),
                  pin: panel,
                  pinSpacing: true,
                  scrub: 0.65,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onEnter: () => setActiveRail(root, railLinks, index),
                  onEnterBack: () => setActiveRail(root, railLinks, index),
                  onUpdate: (self) => {
                    const fill = railFills[index];
                    if (fill) {
                      gsap.set(fill, {
                        scaleX: 0.14 + self.progress * 0.86,
                      });
                    }
                  },
                },
              });

              const splitTargets = index % 2 === 0 ? split.chars : split.words;
              timeline.from(
                splitTargets,
                {
                  yPercent: index % 2 === 0 ? 112 : 0,
                  xPercent: index % 2 === 0 ? 0 : -28,
                  rotationX: index % 2 === 0 ? -38 : 0,
                  opacity: 0,
                  duration: 0.32,
                  stagger: {
                    each: index % 2 === 0 ? 0.009 : 0.035,
                    from: "start",
                  },
                },
                0,
              );
              timeline.from(
                panel.querySelectorAll("[data-service-copy]"),
                {
                  clipPath: "inset(0 100% 0 0)",
                  duration: 0.34,
                  stagger: 0.045,
                },
                0.04,
              );
              timeline.from(
                panel.querySelectorAll("[data-deliverable]"),
                {
                  x: -22,
                  opacity: 0.25,
                  duration: 0.3,
                  stagger: 0.045,
                },
                0.08,
              );

              animateMechanism(
                CONTROL_SERVICES[index].id,
                timeline,
                panel,
              );
            });
          }, root);

          ScrollTrigger.refresh();
          return () => {
            animationContext.revert();
            splits.reverse().forEach((split) => split.revert());
          };
        },
      );
    });

    return () => {
      cancelled = true;
      media.revert();
      navigationContext.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.page}>
      <section className={styles.intro} aria-labelledby="services-title">
        <div className={styles.introShell}>
          <div className={styles.introUtility}>
            <span>DG CLICKS / SERVICES CONTROL</span>
            <span>MEASURED AGAINST CLIENTS WON</span>
          </div>
          <div className={styles.introCopy}>
            <p className={styles.introLead}>Five connected growth channels</p>
            <h1 id="services-title">Growth work should leave a trace.</h1>
            <p>
              Scroll the operating view. Each service shows the mechanism we
              move, the evidence we watch, and the point where activity has to
              become a real enquiry.
            </p>
            <a
              className={styles.primaryAction}
              href="#service-panel-seo"
              onClick={scrollToService("seo")}
            >
              <span>Open the live readout</span>
              <i aria-hidden="true">↓</i>
            </a>
          </div>
          <div className={styles.introTrace} aria-hidden="true">
            <svg viewBox="0 0 1200 220" preserveAspectRatio="none">
              <path d="M0 168H150L202 168L236 74H352L390 168H520L556 122H680L716 168H842L884 52H1014L1054 168H1200" />
            </svg>
            <div>
              {CONTROL_SERVICES.map((service) => (
                <span key={service.id}>{service.shortName}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <nav ref={railRef} className={styles.signalRail} aria-label="Service signal">
        <span className={styles.railProgress} aria-hidden="true">
          <span ref={railPulseRef} />
        </span>
        <ol>
          {CONTROL_SERVICES.map((service) => (
            <li key={service.id}>
              <a
                data-signal-link
                href={"#service-panel-" + service.id}
                onClick={scrollToService(service.id)}
              >
                <span className={styles.signalTrack} aria-hidden="true">
                  <span data-signal-fill />
                </span>
                <span className={styles.signalName}>{service.shortName}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.panelStack}>
        {CONTROL_SERVICES.map((service) => (
          <section
            key={service.id}
            data-service-scene
            className={styles.serviceScene}
            id={"service-panel-" + service.id}
            aria-labelledby={"service-title-" + service.id}
          >
            <div
              data-service-panel
              className={[
                styles.servicePanel,
                layoutClass[service.layout],
                toneClass[service.tone],
              ].join(" ")}
            >
              <div className={styles.panelInner}>
                <article className={styles.serviceCopy}>
                  <p className={styles.serviceName}>{service.name}</p>
                  <h2
                    id={"service-title-" + service.id}
                    data-service-headline
                  >
                    {service.headline}
                  </h2>
                  <div className={styles.description}>
                    {service.description.map((paragraph) => (
                      <p data-service-copy key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <ul className={styles.deliverables}>
                    {service.deliverables.map((deliverable) => (
                      <li data-deliverable key={deliverable}>
                        <span aria-hidden="true" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                  <p className={styles.measureLine}>
                    <span>ACCOUNTABLE TO</span>
                    <strong>{service.measure}</strong>
                  </p>
                </article>

                <div className={styles.mechanismSlot}>
                  <ServiceMechanism serviceId={service.id} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section
        ref={finaleRef}
        className={styles.finale}
        aria-labelledby="services-cta-title"
      >
        <div>
          <p>THE FIRST WORK ORDER</p>
          <h2 id="services-cta-title">Find the blocked handoff first.</h2>
          <span>
            We will show you where demand leaks, what evidence proves it, and
            which service should move before you add more spend.
          </span>
        </div>
        <a href="/contact" className={styles.finaleAction}>
          <span>Book a free growth audit</span>
          <i aria-hidden="true">↗</i>
        </a>
      </section>
    </div>
  );
}
