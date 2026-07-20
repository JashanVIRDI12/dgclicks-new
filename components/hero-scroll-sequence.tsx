"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import GrainOverlay from "@/components/grain-overlay";
import PageLoader from "@/components/page-loader";
import { useCursorParallax } from "@/hooks/use-cursor-parallax";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollSequence } from "@/hooks/use-scroll-sequence";
import { FRAME_COUNT, HERO_MOBILE_VIDEO } from "@/lib/frame-count";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

export default function HeroScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const reduced = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const viewportReady = isMobile !== null;
  const useCanvas = viewportReady && !isMobile && !reduced;
  const useVideo = viewportReady && isMobile && !reduced;

  const [loaderVisible, setLoaderVisible] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const { ready, loadPct, drawFrame } = useScrollSequence(canvasRef, {
    enabled: useCanvas,
  });

  // Hide loader once the sequence gate is reached (or immediately on
  // mobile / reduced motion, where there is no preload gate).
  useGSAP(() => {
    if (!viewportReady) return;
    if (!useCanvas || ready) {
      const t = window.setTimeout(() => {
        setLoaderVisible(false);
        setRevealed(true);
      }, useCanvas ? 300 : 0);
      return () => window.clearTimeout(t);
    }
  }, [viewportReady, useCanvas, ready]);

  useCursorParallax(
    sectionRef,
    () => ({ canvas: canvasWrapRef.current, ui: uiRef.current }),
    useCanvas && revealed,
  );

  // ── Entrance: intro chapter reveals once the loader clears ──
  useGSAP(
    () => {
      if (!revealed || !headlineRef.current) return;

      const split = new SplitText(headlineRef.current, {
        type: "lines",
        linesClass: "hero-line",
      });

      split.lines.forEach((line) => {
        const mask = document.createElement("div");
        mask.style.overflow = "hidden";
        mask.style.display = "block";
        line.parentNode?.insertBefore(mask, line);
        mask.appendChild(line);
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        split.lines,
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, stagger: 0.09 },
        0.05,
      ).fromTo(
        "[data-hero-fade]",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 },
        0.4,
      );

      return () => {
        split.revert();
      };
    },
    { dependencies: [revealed], scope: sectionRef },
  );

  // ── Pinned scrub: frame sequence + chapter narrative on one timeline ──
  useGSAP(
    () => {
      if (!useCanvas || !ready || !sectionRef.current) return;

      const q = gsap.utils.selector(sectionRef.current);
      const chapters = {
        intro: q("[data-chapter='intro']"),
        services: q("[data-chapter='services']"),
        proof: q("[data-chapter='proof']"),
        closing: q("[data-chapter='closing']"),
      };

      gsap.set([chapters.services, chapters.proof, chapters.closing], {
        autoAlpha: 0,
      });

      const frameState = { frame: 0 };
      let lastFrame = -1;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=340%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Frame scrub across the whole pin
      tl.to(
        frameState,
        {
          frame: FRAME_COUNT - 1,
          duration: 1,
          onUpdate: () => {
            const next = Math.round(frameState.frame);
            if (next !== lastFrame) {
              lastFrame = next;
              drawFrame(next);
            }
          },
        },
        0,
      );

      // Progress rail fill
      tl.fromTo(
        q("[data-progress-fill]"),
        { scaleY: 0 },
        { scaleY: 1, duration: 1 },
        0,
      );

      const inOut = (
        el: Element[],
        at: number,
        until: number,
        drift = 50,
      ) => {
        tl.fromTo(
          el,
          { autoAlpha: 0, y: drift },
          { autoAlpha: 1, y: 0, duration: 0.07, ease: "power2.out" },
          at,
        );
        tl.to(
          el,
          { autoAlpha: 0, y: -drift, duration: 0.07, ease: "power2.in" },
          until,
        );
      };

      // Chapter choreography (positions are timeline progress 0–1)
      tl.to(
        chapters.intro,
        { autoAlpha: 0, y: -60, duration: 0.08, ease: "power2.in" },
        0.1,
      );
      inOut(chapters.services, 0.24, 0.44);
      inOut(chapters.proof, 0.54, 0.74);

      tl.fromTo(
        chapters.closing,
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.84,
      );

      ScrollTrigger.refresh();
    },
    { dependencies: [useCanvas, ready], scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <>
      <PageLoader
        progress={useCanvas ? loadPct : 100}
        visible={loaderVisible && useCanvas}
      />

      <section
        id="hero"
        ref={sectionRef}
        className="relative min-h-[100svh] overflow-hidden bg-void"
        aria-label="Hero"
      >
        {/* Sequence / video layer */}
        <div
          ref={canvasWrapRef}
          className="absolute inset-0 z-0 will-change-transform"
          aria-hidden
        >
          {useCanvas ? (
            <canvas ref={canvasRef} className="h-full w-full" />
          ) : useVideo ? (
            <video
              className="h-full w-full object-cover"
              src={HERO_MOBILE_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              poster="/frames/frame_0001.webp"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/frames/frame_0300.webp"
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          {/* Readability vignettes — never a flat wash over the chrome */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-void via-void/60 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-void/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-void/55 to-transparent" />
        </div>

        <GrainOverlay opacity={0.07} />

        {/* Foreground UI */}
        <div
          ref={uiRef}
          className="relative z-10 h-full min-h-[100svh] will-change-transform"
        >
          {/* ── Chapter: intro ── */}
          <div
            data-chapter="intro"
            className="absolute inset-0 flex flex-col justify-end"
          >
            <div className="wrap pb-20 pt-28 md:pb-24 md:pt-32">
              <p data-hero-fade className="eyebrow mb-6 text-sky">
                Digital growth studio · Bolton, Ontario
              </p>
              <h1
                ref={headlineRef}
                className="max-w-4xl font-display text-headline"
              >
                Clicks are cheap. Clients are the point.
              </h1>
              <p
                data-hero-fade
                className="mt-6 max-w-xl text-subhead text-chrome-dim"
              >
                SEO, sites, ads, and social — measured in qualified enquiries,
                not impressions.
              </p>

              <div
                data-hero-fade
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <Link href="/contact" className="btn-primary">
                  Start a free growth audit
                </Link>
                <Link href="/#showcase" className="btn-secondary">
                  See the work
                </Link>
              </div>

              <div
                data-hero-fade
                className="mt-11 flex items-center gap-4 text-caption text-chrome-dim"
              >
                <div className="flex -space-x-2" aria-hidden>
                  {["H", "A", "P", "S"].map((letter) => (
                    <span
                      key={letter}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--glass-border)] bg-deep text-[10px] font-medium text-chrome"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <p>
                  <span className="text-chrome">40+</span> Canadian operators
                  trust the Friday report
                </p>
              </div>
            </div>
          </div>

          {useCanvas && (
            <>
              {/* ── Chapter: services ── */}
              <div
                data-chapter="services"
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center"
              >
                <div className="wrap">
                  <p className="eyebrow mb-6 text-sky">01 — What we do</p>
                  <p className="max-w-3xl font-display text-headline">
                    Search. Sites. Ads. Social.
                  </p>
                  <p className="mt-6 max-w-lg text-subhead text-chrome-dim">
                    Five services, one measurement loop — every channel answers
                    to the same Friday numbers.
                  </p>
                </div>
              </div>

              {/* ── Chapter: proof ── */}
              <div
                data-chapter="proof"
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center"
              >
                <div className="wrap text-center">
                  <p className="eyebrow mb-6 text-sky">02 — The proof</p>
                  <p className="font-display text-[clamp(3.5rem,10vw,8.5rem)] leading-none tracking-tight text-chrome">
                    8 <span className="text-sky">→</span> 140+
                  </p>
                  <p className="mx-auto mt-6 max-w-md text-subhead text-chrome-dim">
                    qualified enquiries a month for Active Coachlines — one
                    clearer booking path.
                  </p>
                </div>
              </div>

              {/* ── Chapter: closing ── */}
              <div
                data-chapter="closing"
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center"
              >
                <div className="wrap text-center">
                  <p className="eyebrow mb-6 text-sky">03 — The ledger</p>
                  <p className="mx-auto max-w-3xl font-display text-headline">
                    Proof below.
                  </p>
                  <p className="mx-auto mt-6 max-w-md text-subhead text-chrome-dim">
                    Case studies, live numbers, and the Friday report — keep
                    scrolling.
                  </p>
                  <span
                    className="mx-auto mt-10 block h-10 w-px bg-gradient-to-b from-sky to-transparent"
                    aria-hidden
                  />
                </div>
              </div>

              {/* ── Progress rail ── */}
              <div
                aria-hidden
                className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
              >
                <span className="text-[10px] uppercase tracking-[0.22em] text-chrome-dim [writing-mode:vertical-rl]">
                  Scroll
                </span>
                <span className="relative block h-28 w-px overflow-hidden bg-[rgba(232,236,242,0.15)]">
                  <span
                    data-progress-fill
                    className="absolute inset-0 origin-top bg-gradient-to-b from-cobalt to-sky"
                    style={{ transform: "scaleY(0)" }}
                  />
                </span>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
