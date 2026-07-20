"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import type { ServiceDefinition } from "./services-data";
import styles from "./ServicesUi.module.css";

type BlueprintDiagramProps = {
  active: boolean;
  index: number;
  service: ServiceDefinition;
};

type DiagramEvent = CustomEvent<{ id: ServiceDefinition["id"] }>;

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 720;

/* One shared pen speed (viewBox units / second) so every stroke draws at the
   same hand pace regardless of its length. */
const PEN_SPEED = 1400;
const STROKE_MIN = 0.3;
const STROKE_MAX = 1.05;

export default function BlueprintDiagram({
  active,
  index,
  service,
}: BlueprintDiagramProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const idleRef = useRef<gsap.core.Timeline | null>(null);
  const drawRef = useRef<gsap.core.Timeline | null>(null);
  const drawnRef = useRef(false);
  const activeRef = useRef(active);
  const [ready, setReady] = useState(index === 0);

  activeRef.current = active;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || ready) return;

    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "40% 0px", threshold: 0.01 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [ready]);

  const drawDiagram = useCallback(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    drawRef.current?.kill();
    idleRef.current?.kill();
    idleRef.current = null;

    const strokes = Array.from(
      svg.querySelectorAll<SVGGeometryElement>("[data-draw]"),
    );
    const details = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-detail]"),
    );
    const labels = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-label]"),
    );
    const fills = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-fill]"),
    );
    const copies = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-copy]"),
    );
    const actors = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-actor]"),
    );
    const orbits = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-orbit]"),
    );
    const counter = svg.querySelector<SVGTSpanElement>("[data-counter]");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.killTweensOf([
      root,
      ...strokes,
      ...details,
      ...labels,
      ...fills,
      ...copies,
      ...actors,
      ...orbits,
    ]);
    gsap.set(root, { opacity: 1 });
    /* Dynamic actors (cursor, flow dots, runners, reactions) live at the SVG
       origin until the idle loop positions them — they must never be seen
       before that. */
    gsap.set(actors, { autoAlpha: 0 });

    if (reduced) {
      gsap.set(strokes, { drawSVG: "100%", opacity: 1 });
      gsap.set(details, { opacity: 0.6 });
      gsap.set(orbits, { opacity: 0.5 });
      gsap.set(labels, { opacity: 1, clearProps: "transform" });
      fills.forEach((fill) => {
        gsap.set(fill, {
          opacity: Number(fill.dataset.fillOpacity ?? 0.82),
          clearProps: "transform",
        });
      });
      gsap.set(copies, { opacity: 0.85 });
      if (counter) counter.textContent = counter.dataset.counter ?? "";
      drawRef.current = gsap
        .timeline()
        .from(root, { opacity: 0.55, duration: 0.35, ease: "power2.out" });
      drawnRef.current = true;
      return;
    }

    gsap.set(strokes, { drawSVG: "0%", opacity: 1 });
    gsap.set(details, { opacity: 0 });
    gsap.set(orbits, { opacity: 0 });
    gsap.set(labels, { opacity: 0, y: 8 });
    fills.forEach((fill) => {
      if (fill.dataset.fillAnim === "bar") {
        gsap.set(fill, {
          opacity: Number(fill.dataset.fillOpacity ?? 0.82),
          scaleX: 0,
          transformOrigin: "left center",
        });
      } else {
        gsap.set(fill, {
          opacity: 0,
          scale: 0.96,
          transformOrigin: "50% 50%",
        });
      }
    });
    gsap.set(copies, { opacity: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        idleRef.current = buildIdleTimeline(service.id, svg);
        if (!activeRef.current) idleRef.current?.pause();
      },
    });

    /* Group strokes by data-step, then cascade the steps with a 55% overlap
       so the blueprint reads as one continuous pen, not a metronome. */
    const stepMap = new Map<number, SVGGeometryElement[]>();
    strokes.forEach((stroke, strokeIndex) => {
      const step = Number(stroke.dataset.step ?? strokeIndex);
      const bucket = stepMap.get(step) ?? [];
      bucket.push(stroke);
      stepMap.set(step, bucket);
    });
    const stepIds = Array.from(stepMap.keys()).sort((a, b) => a - b);
    const stepStart = new Map<number, number>();
    let cursor = 0.1;

    stepIds.forEach((stepId) => {
      const bucket = stepMap.get(stepId) ?? [];
      let stepDuration = 0;
      bucket.forEach((stroke) => {
        const length = Math.max(stroke.getTotalLength(), 1);
        const duration = gsap.utils.clamp(
          STROKE_MIN,
          STROKE_MAX,
          length / PEN_SPEED,
        );
        stepDuration = Math.max(stepDuration, duration);
        timeline.to(
          stroke,
          { drawSVG: "100%", duration, ease: "power1.inOut" },
          cursor,
        );
      });
      stepStart.set(stepId, cursor);
      cursor += stepDuration * 0.55;
    });

    const lastStep = stepIds.length ? stepIds[stepIds.length - 1] : 0;
    const timeFor = (step: number) =>
      stepStart.get(step) ?? cursor + Math.max(0, step - lastStep) * 0.09;

    labels.forEach((label, labelIndex) => {
      const step = Number(label.dataset.step ?? labelIndex + 2);
      timeline.to(
        label,
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        timeFor(step) + 0.18,
      );
    });

    fills.forEach((fill, fillIndex) => {
      const step = Number(fill.dataset.step ?? fillIndex + 3);
      if (fill.dataset.fillAnim === "bar") {
        timeline.to(
          fill,
          { scaleX: 1, duration: 0.45, ease: "power3.out" },
          timeFor(step) + 0.22,
        );
      } else {
        timeline.to(
          fill,
          {
            opacity: Number(fill.dataset.fillOpacity ?? 0.82),
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
          },
          timeFor(step) + 0.22,
        );
      }
    });

    if (details.length) {
      timeline.to(
        details,
        { opacity: 0.6, duration: 0.5, ease: "power2.out", stagger: 0.05 },
        cursor * 0.55,
      );
    }

    if (orbits.length) {
      timeline.to(
        orbits,
        { opacity: 0.5, duration: 0.6, ease: "power2.out" },
        cursor * 0.8,
      );
    }

    copies.forEach((copy, copyIndex) => {
      timeline.to(
        copy,
        { opacity: 0.85, duration: 0.35, ease: "power3.out" },
        cursor + 0.1 + copyIndex * 0.09,
      );
    });

    if (counter) {
      const finalValue = Number(counter.dataset.counter ?? 140);
      const count = { value: 0 };
      timeline.to(
        count,
        {
          value: finalValue,
          duration: 0.9,
          ease: "power3.out",
          onStart: () => {
            counter.textContent = "0";
          },
          onUpdate: () => {
            counter.textContent = Math.round(count.value).toString();
          },
        },
        Math.max(cursor - 0.2, 0.6),
      );
    }

    drawRef.current = timeline;
    drawnRef.current = true;
  }, [service.id]);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top 82%",
      end: "bottom 18%",
      onEnter: () => {
        if (drawnRef.current) idleRef.current?.play();
        else drawDiagram();
      },
      onEnterBack: () => {
        if (drawnRef.current) idleRef.current?.play();
        else drawDiagram();
      },
      onLeave: () => idleRef.current?.pause(),
      onLeaveBack: () => idleRef.current?.pause(),
    });

    const onRedraw = (event: Event) => {
      const detail = (event as DiagramEvent).detail;
      if (detail?.id === service.id) drawDiagram();
    };
    const onExit = (event: Event) => {
      const detail = (event as DiagramEvent).detail;
      if (detail?.id !== service.id) return;
      const svg = svgRef.current;
      if (!svg) return;
      idleRef.current?.kill();
      idleRef.current = null;
      drawnRef.current = false;
      const strokes = Array.from(
        svg.querySelectorAll<SVGGeometryElement>("[data-draw]"),
      ).reverse();
      const soft = svg.querySelectorAll<SVGGraphicsElement>(
        "[data-actor], [data-orbit]",
      );
      gsap.to(strokes, {
        drawSVG: "0%",
        duration: 0.28,
        ease: "power2.in",
        stagger: 0.015,
        overwrite: true,
      });
      gsap.to(soft, { autoAlpha: 0, duration: 0.2, overwrite: true });
      gsap.to(root, { opacity: 0.6, duration: 0.32, ease: "power2.in" });
    };

    window.addEventListener("blueprint:redraw", onRedraw);
    window.addEventListener("blueprint:exit", onExit);
    return () => {
      trigger.kill();
      drawRef.current?.kill();
      idleRef.current?.kill();
      window.removeEventListener("blueprint:redraw", onRedraw);
      window.removeEventListener("blueprint:exit", onExit);
    };
  }, [drawDiagram, ready, service.id]);

  useEffect(() => {
    if (!idleRef.current) return;
    if (active) idleRef.current.play();
    else idleRef.current.pause();
  }, [active]);

  useScanner(rootRef, ready);

  return (
    <div
      ref={rootRef}
      className={styles.diagramStage}
      data-service-diagram={service.id}
      data-diagram-index={index}
    >
      <div className={styles.diagramGrid} aria-hidden="true" />
      <div className={styles.scannerLight} aria-hidden="true" />
      {ready ? (
        <svg
          ref={svgRef}
          className={styles.diagramSvg}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          role="img"
          aria-labelledby={`diagram-title-${service.id}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <title id={`diagram-title-${service.id}`}>
            {`${service.name} technical blueprint`}
          </title>
          <g aria-hidden="true">
            <DiagramFor id={service.id} />
          </g>
        </svg>
      ) : (
        <div className={styles.diagramLoading} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}

      <div className={styles.statPlacard} data-service-stat>
        <span className={styles.statLeader} aria-hidden="true" />
        <span>{service.projectedStat.label}</span>
        <strong>{service.projectedStat.value}</strong>
      </div>
      <p className={styles.scannerHint} aria-hidden="true">
        Move to inspect
      </p>
    </div>
  );
}

function useScanner(
  rootRef: React.RefObject<HTMLDivElement>,
  ready: boolean,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce), (pointer: coarse)",
    );
    if (reduced.matches) return;

    const annotations = Array.from(
      root.querySelectorAll<SVGGraphicsElement>("[data-annotation]"),
    );
    const opacityTo = annotations.map((annotation) =>
      gsap.quickTo(annotation, "opacity", {
        duration: 0.2,
        ease: "power2.out",
      }),
    );
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let inside = false;

    const render = () => {
      current.x += (target.x - current.x) * 0.11;
      current.y += (target.y - current.y) * 0.11;
      const bounds = root.getBoundingClientRect();
      root.style.setProperty("--scanner-x", `${current.x - bounds.left}px`);
      root.style.setProperty("--scanner-y", `${current.y - bounds.top}px`);

      annotations.forEach((annotation, annotationIndex) => {
        const annotationBounds = annotation.getBoundingClientRect();
        const x = annotationBounds.left + annotationBounds.width / 2;
        const y = annotationBounds.top + annotationBounds.height / 2;
        const distance = Math.hypot(current.x - x, current.y - y);
        const strength = 1 - gsap.utils.clamp(0, 1, distance / 170);
        opacityTo[annotationIndex]?.(0.35 + strength * 0.65);
      });

      if (inside) frame = window.requestAnimationFrame(render);
    };
    const enter = (event: PointerEvent) => {
      inside = true;
      target.x = current.x = event.clientX;
      target.y = current.y = event.clientY;
      root.style.setProperty("--scanner-opacity", "1");
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };
    const leave = () => {
      inside = false;
      window.cancelAnimationFrame(frame);
      root.style.setProperty("--scanner-opacity", "0");
      opacityTo.forEach((setOpacity) => setOpacity(0.35));
    };

    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    return () => {
      window.cancelAnimationFrame(frame);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(annotations);
    };
  }, [ready, rootRef]);
}

/* The idle loop is the diagram "operating": lime signal comets travel the
   live routes, the one hot node breathes, and each schematic runs its own
   scene (cursor click, funnel drops, feed reactions, rotating clearspace). */
function buildIdleTimeline(
  serviceId: ServiceDefinition["id"],
  svg: SVGSVGElement,
) {
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });

  const runners = Array.from(
    svg.querySelectorAll<SVGPathElement>("[data-runner]"),
  );
  runners.forEach((runner, runnerIndex) => {
    const length = runner.getTotalLength();
    const comet = gsap.utils.clamp(46, 110, length * 0.16);
    const speed = Number(runner.dataset.runnerSpeed ?? 360);
    timeline.set(
      runner,
      {
        autoAlpha: 1,
        strokeDasharray: `${comet} ${length + comet}`,
        strokeDashoffset: comet,
      },
      0,
    );
    timeline.to(
      runner,
      {
        strokeDashoffset: -length,
        duration: (length + comet * 2) / speed,
        ease: "none",
      },
      0.4 + runnerIndex * 0.9,
    );
  });

  const hots = Array.from(
    svg.querySelectorAll<SVGGraphicsElement>("[data-hot]"),
  );
  if (hots.length) {
    timeline.to(
      hots,
      {
        opacity: 0.72,
        scale: 1.05,
        transformOrigin: "50% 50%",
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
        stagger: 0.2,
      },
      0.2,
    );
  }

  const orbits = Array.from(
    svg.querySelectorAll<SVGGraphicsElement>("[data-orbit]"),
  );
  orbits.forEach((orbit) => {
    /* Dash period is 16 units; a multiple of 16 loops seamlessly. */
    timeline.to(
      orbit,
      { strokeDashoffset: "-=160", duration: 6, ease: "none" },
      0,
    );
  });

  if (serviceId === "website-design") {
    const cursor = svg.querySelector<SVGGraphicsElement>("[data-cursor]");
    const route = svg.querySelector<SVGPathElement>("[data-cursor-route]");
    const pulse = svg.querySelector<SVGGraphicsElement>("[data-click]");
    const ctaFill = svg.querySelector<SVGGraphicsElement>("[data-cta-fill]");
    if (cursor && route) {
      timeline
        .set(cursor, { autoAlpha: 0 }, 0)
        .to(
          cursor,
          {
            motionPath: { path: route, align: route, alignOrigin: [0, 0] },
            duration: 3,
            ease: "power2.inOut",
          },
          0.3,
        )
        .to(cursor, { autoAlpha: 1, duration: 0.35 }, 0.45);
      if (pulse) {
        timeline.fromTo(
          pulse,
          { scale: 0.2, autoAlpha: 0.9, transformOrigin: "50% 50%" },
          { scale: 1, autoAlpha: 0, duration: 0.7, ease: "power2.out" },
          3.3,
        );
      }
      if (ctaFill) {
        timeline.fromTo(
          ctaFill,
          { autoAlpha: 0.85 },
          { autoAlpha: 0, duration: 0.6, ease: "power2.out" },
          3.35,
        );
      }
      timeline.to(cursor, { autoAlpha: 0, duration: 0.35 }, 3.6);
    }
  }

  if (serviceId === "paid-ads") {
    const route = svg.querySelector<SVGPathElement>("[data-flow-route]");
    const dots = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-flow-dot]"),
    );
    if (route) {
      dots.forEach((dot, dotIndex) => {
        const start = 0.3 + dotIndex * 0.5;
        timeline.to(
          dot,
          {
            motionPath: {
              path: route,
              align: route,
              alignOrigin: [0.5, 0.5],
            },
            duration: 2.1,
            ease: "power1.in",
          },
          start,
        );
        timeline.to(dot, { autoAlpha: 1, duration: 0.25 }, start);
        timeline.to(dot, { autoAlpha: 0, duration: 0.3 }, start + 1.8);
      });
    }
  }

  if (serviceId === "social-media-management") {
    const reactions = Array.from(
      svg.querySelectorAll<SVGGraphicsElement>("[data-reaction]"),
    );
    reactions.forEach((reaction, reactionIndex) => {
      const start = 0.9 + reactionIndex * 0.85;
      timeline.fromTo(
        reaction,
        { autoAlpha: 0, scale: 0.5 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
          transformOrigin: "50% 50%",
        },
        start,
      );
      timeline.to(
        reaction,
        { y: -18, autoAlpha: 0, duration: 0.7, ease: "power1.out" },
        start + 0.4,
      );
      timeline.set(reaction, { y: 0 }, start + 1.2);
    });
  }

  return timeline;
}

function DiagramFor({ id }: { id: ServiceDefinition["id"] }) {
  switch (id) {
    case "seo":
      return <SeoDiagram />;
    case "website-design":
      return <WebsiteDiagram />;
    case "paid-ads":
      return <PaidAdsDiagram />;
    case "graphic-design":
      return <GraphicDesignDiagram />;
    case "social-media-management":
      return <SocialDiagram />;
  }
}

function DrawingText({
  children,
  x,
  y,
  step,
}: {
  children: ReactNode;
  x: number;
  y: number;
  step: number;
}) {
  return (
    <text x={x} y={y} data-label data-step={step}>
      {children}
    </text>
  );
}

/* SEO — the crawl map: root, orthogonal routes with radiused elbows,
   depth nodes, and leaf queries. Signal comets crawl the two live routes. */
function SeoDiagram() {
  return (
    <g>
      <circle cx="330" cy="360" r="56" data-draw data-step="0" />
      <path d="M386 360 H598" data-draw data-step="1" />
      <circle cx="620" cy="360" r="22" data-draw data-step="2" />
      <path d="M470 360 V196 Q470 182 484 182 H598" data-draw data-step="3" />
      <circle cx="620" cy="182" r="22" data-draw data-step="4" />
      <path d="M470 360 V524 Q470 538 484 538 H598" data-draw data-step="5" />
      <circle cx="620" cy="538" r="22" data-draw data-step="6" />
      <path d="M642 182 H866" data-draw data-step="7" />
      <path d="M642 360 H866" data-draw data-step="7" />
      <path d="M642 538 H866" data-draw data-step="7" />
      <path d="M760 360 V450 Q760 464 774 464 H866" data-draw data-step="7" />
      <circle cx="880" cy="182" r="13" data-draw data-step="8" />
      <circle cx="880" cy="360" r="13" data-draw data-step="8" data-hot />
      <circle cx="880" cy="464" r="13" data-draw data-step="8" />
      <circle cx="880" cy="538" r="13" data-draw data-step="8" />
      <g data-detail>
        <path d="M420 350 V370" />
        <path d="M462 271 H478" />
        <path d="M462 449 H478" />
        <path d="M750 172 V192" />
        <path d="M750 528 V548" />
      </g>
      <path d="M386 360 H866" data-runner data-actor />
      <path
        d="M470 360 V196 Q470 182 484 182 H866"
        data-runner
        data-actor
      />
      <DrawingText x={274} y={452} step={2}>ROOT / INDEX</DrawingText>
      <DrawingText x={560} y={146} step={4}>service intent</DrawingText>
      <DrawingText x={548} y={412} step={3}>commercial query</DrawingText>
      <DrawingText x={548} y={592} step={6}>location proof</DrawingText>
      <DrawingText x={904} y={188} step={9}>near me</DrawingText>
      <DrawingText x={904} y={366} step={10}>pricing</DrawingText>
      <DrawingText x={904} y={470} step={11}>reviews</DrawingText>
      <DrawingText x={904} y={544} step={12}>contact</DrawingText>
      <g data-annotation>
        <path d="M330 290 V250 M310 250 H350" />
        <text x="262" y="236">Ø112 ROOT</text>
      </g>
      <g data-annotation>
        <path d="M386 620 V648 M866 620 V648 M386 634 H866" />
        <text x="546" y="676">480 PATH SPAN</text>
      </g>
      <g data-annotation>
        <path d="M960 182 H1030 M1018 170 L1030 182 L1018 194" />
        <text x="958" y="150">CRAWL DEPTH 02</text>
      </g>
    </g>
  );
}

/* Website — the wireframe on the drafting table. A lime cursor glides in,
   clicks the CTA, and the click pulses — the page doing its one job. */
function WebsiteDiagram() {
  return (
    <g>
      <rect x="180" y="84" width="840" height="552" rx="16" data-draw data-step="0" />
      <path d="M180 148 H1020" data-draw data-step="1" />
      <circle cx="216" cy="116" r="7" data-draw data-step="1" />
      <circle cx="242" cy="116" r="7" data-draw data-step="1" />
      <circle cx="268" cy="116" r="7" data-draw data-step="1" />
      <rect x="300" y="104" width="340" height="26" rx="13" data-draw data-step="1" />
      <rect x="232" y="196" width="500" height="152" rx="8" data-draw data-step="2" />
      <rect x="764" y="196" width="224" height="152" rx="8" data-draw data-step="3" />
      <g data-detail>
        <path d="M764 196 L988 348" />
        <path d="M988 196 L764 348" />
      </g>
      <rect x="262" y="296" width="128" height="32" rx="4" data-draw data-step="4" />
      <rect
        x="262"
        y="296"
        width="128"
        height="32"
        rx="4"
        data-cta-fill
        data-actor
      />
      <rect x="232" y="392" width="232" height="168" rx="8" data-draw data-step="5" />
      <rect x="496" y="392" width="232" height="168" rx="8" data-draw data-step="6" />
      <rect x="760" y="392" width="226" height="168" rx="8" data-draw data-step="7" />
      <rect x="262" y="230" width="300" height="18" data-fill data-fill-anim="bar" data-step="3" />
      <rect x="262" y="262" width="224" height="11" data-fill data-fill-anim="bar" data-step="4" />
      <rect x="252" y="412" width="192" height="84" data-fill data-step="6" />
      <rect x="516" y="412" width="192" height="84" data-fill data-step="7" />
      <rect x="780" y="412" width="186" height="84" data-fill data-step="8" />
      <rect x="252" y="516" width="150" height="10" data-fill data-fill-anim="bar" data-step="7" />
      <rect x="252" y="534" width="110" height="10" data-fill data-fill-anim="bar" data-step="8" />
      <rect x="516" y="516" width="150" height="10" data-fill data-fill-anim="bar" data-step="8" />
      <rect x="516" y="534" width="110" height="10" data-fill data-fill-anim="bar" data-step="9" />
      <rect x="780" y="516" width="146" height="10" data-fill data-fill-anim="bar" data-step="9" />
      <rect x="780" y="534" width="106" height="10" data-fill data-fill-anim="bar" data-step="9" />
      <path
        d="M900 648 C790 596 610 512 500 440 C420 388 360 344 326 312"
        data-cursor-route
        className={styles.motionRoute}
      />
      <circle cx="326" cy="312" r="24" data-click data-actor />
      <g data-cursor data-actor>
        <path d="M0 0 L16 40 L24 24 L42 16 Z" className={styles.cursorShape} />
      </g>
      <DrawingText x={232} y={182} step={2}>HEADER / NAVIGATION</DrawingText>
      <DrawingText x={232} y={588} step={8}>RESPONSIVE CONTENT SYSTEM</DrawingText>
      <g data-annotation>
        <path d="M180 668 H1020 M180 654 V682 M1020 654 V682" />
        <text x="528" y="706">840 VIEWPORT UNIT</text>
      </g>
      <g data-annotation>
        <path d="M1048 196 H1084 M1048 348 H1084 M1066 196 V348" />
        <text x="1092" y="280">152 HERO</text>
      </g>
      <g data-annotation>
        <path d="M704 362 L738 380 L704 398" />
        <text x="600" y="374">BREAKPOINT 02</text>
      </g>
    </g>
  );
}

/* Paid ads — the funnel in section view. Lime spend-dots fall the center
   line and accelerate; waste exits sideways between stages. */
function PaidAdsDiagram() {
  return (
    <g>
      <path d="M250 110 H950 L866 234 H334 Z" data-draw data-step="0" />
      <path d="M334 266 H866 L796 372 H404 Z" data-draw data-step="2" />
      <path d="M404 404 H796 L738 496 H462 Z" data-draw data-step="4" />
      <path d="M462 528 H738 L692 606 H508 Z" data-draw data-step="6" />
      <g data-detail>
        <path d="M880 250 H932 M921 240 L933 250 L921 260" />
        <path d="M812 386 H864 M853 376 L865 386 L853 396" />
        <path d="M752 510 H804 M793 500 L805 510 L793 520" />
      </g>
      <path d="M600 126 V600" data-flow-route className={styles.motionRoute} />
      {[0, 1, 2, 3].map((dot) => (
        <circle key={dot} r="9" data-flow-dot data-actor />
      ))}
      <DrawingText x={272} y={96} step={1}>AVAILABLE DEMAND</DrawingText>
      <DrawingText x={356} y={256} step={3}>MESSAGE MATCH</DrawingText>
      <DrawingText x={424} y={394} step={5}>QUALIFIED CLICK</DrawingText>
      <DrawingText x={484} y={518} step={7}>BOOKED ENQUIRY</DrawingText>
      <text
        x="600"
        y="684"
        textAnchor="middle"
        className={styles.counterText}
        data-label
        data-step="8"
      >
        <tspan data-counter="140">140</tspan>
        <tspan dx="10" className={styles.counterSuffix}>CONVERSIONS</tspan>
      </text>
      <g data-annotation>
        <path d="M250 60 H950 M250 48 V72 M950 48 V72" />
        <text x="512" y="40">700 AUDIENCE WIDTH</text>
      </g>
      <g data-annotation>
        <path d="M212 110 H176 M212 606 H176 M194 110 V606" />
        <text x="116" y="380" transform="rotate(-90 116 380)">4-STAGE FILTER</text>
      </g>
      <g data-annotation>
        <path d="M748 566 H848 M837 554 L849 566 L837 578" />
        <text x="760" y="540">WIN RATE 12.4%</text>
      </g>
    </g>
  );
}

/* Graphic design — the construction sheet: a geometric DG monogram drawn
   from true arcs, cap/baseline construction, a rotating dashed clearspace
   circle, and a reduction ladder of approved sizes. */
const MARK_PATH =
  "M380 200 H468 A160 160 0 0 1 468 520 H380 Z M910 249 A150 150 0 1 0 960 360 H840";

function GraphicDesignDiagram() {
  const copies = [
    { transform: "translate(249.2 524) scale(0.16)" },
    { transform: "translate(398.2 550) scale(0.11)" },
    { transform: "translate(513.4 570) scale(0.07)" },
  ];
  return (
    <g>
      <g data-detail>
        <path d="M300 200 H940" strokeDasharray="5 9" />
        <path d="M300 520 H940" strokeDasharray="5 9" />
        <path d="M640 338 V382 M618 360 H662" />
        <path d="M300 620 H700" />
      </g>
      <path d="M380 200 H468 A160 160 0 0 1 468 520 H380 Z" data-draw data-step="0" />
      <path d="M910 249 A150 150 0 1 0 960 360 H840" data-draw data-step="2" />
      <circle cx="640" cy="360" r="5" data-draw data-step="4" data-hot />
      <circle
        cx="655"
        cy="360"
        r="235"
        data-orbit
        strokeDasharray="4 12"
      />
      {copies.map((copy) => (
        <path
          key={copy.transform}
          d={MARK_PATH}
          transform={copy.transform}
          data-copy
        />
      ))}
      <DrawingText x={300} y={176} step={1}>PRIMARY CONSTRUCTION / DG</DrawingText>
      <DrawingText x={300} y={664} step={6}>REDUCTION LADDER 16 / 11 / 07</DrawingText>
      <g data-annotation>
        <path d="M655 360 L821 194" />
        <text x="700" y="150">R235 CLEARSPACE</text>
      </g>
      <g data-annotation>
        <path d="M992 200 H1032 M992 520 H1032 M1012 200 V520" />
        <text x="1044" y="366">320 CAP</text>
      </g>
      <g data-annotation>
        <path d="M660 600 L720 560" />
        <text x="728" y="554">SYSTEM COPY × 03</text>
      </g>
    </g>
  );
}

/* Social — the content calendar as a feed. The lime center cell is the
   publish moment; reactions rise from it and a comet circuits the frame. */
function SocialDiagram() {
  const cells = Array.from({ length: 9 }, (_, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    return { x: 300 + column * 209, y: 150 + row * 160, index };
  });
  return (
    <g>
      <rect x="252" y="48" width="696" height="584" rx="14" data-draw data-step="0" />
      <path d="M252 118 H948" data-draw data-step="1" />
      <circle cx="300" cy="84" r="15" data-draw data-step="1" data-hot />
      <rect x="330" y="77" width="150" height="14" data-fill data-fill-anim="bar" data-step="2" />
      {cells.map(({ x, y, index }) => (
        <g key={index}>
          <rect x={x} y={y} width="182" height="140" rx="6" data-draw data-step={index + 2} />
          <rect
            x={x + 8}
            y={y + 8}
            width="166"
            height="124"
            rx="4"
            data-fill
            data-step={index + 3}
            data-fill-opacity={index === 4 ? "0.85" : "0.5"}
            className={index === 4 ? styles.publishCell : undefined}
          />
        </g>
      ))}
      <path
        d="M266 48 H934 Q948 48 948 62 V618 Q948 632 934 632 H266 Q252 632 252 618 V62 Q252 48 266 48"
        data-runner
        data-actor
        data-runner-speed="520"
      />
      <g data-reaction data-actor transform="translate(560 300)">
        <path d="M0 14 C-22 -4 -20 -30 0 -30 C20 -30 22 -4 0 14 Z" />
      </g>
      <g data-reaction data-actor transform="translate(655 330)">
        <path d="M-20 -18 H20 V12 H4 L-7 24 V12 H-20 Z" />
      </g>
      <g data-reaction data-actor transform="translate(600 270)">
        <path d="M0 14 C-22 -4 -20 -30 0 -30 C20 -30 22 -4 0 14 Z" />
      </g>
      <DrawingText x={270} y={36} step={1}>CONTENT CADENCE / 3 × 3</DrawingText>
      <g data-annotation>
        <path d="M252 664 H948 M252 650 V678 M948 650 V678" />
        <text x="524" y="702">696 FEED WIDTH</text>
      </g>
      <g data-annotation>
        <path d="M978 150 H1020 M978 290 H1020 M999 150 V290" />
        <text x="1030" y="224">140 POST</text>
      </g>
      <g data-annotation>
        <path d="M780 96 L858 50" />
        <text x="866" y="42">REFRESH / 7 DAYS</text>
      </g>
    </g>
  );
}
