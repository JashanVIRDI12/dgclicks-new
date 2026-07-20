"use client";

import dynamic from "next/dynamic";
import {
  Component,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { heroStats } from "@/lib/data";
import {
  gsap,
  scrollToSection,
  useIsoLayoutEffect,
} from "@/lib/gsap";
import type { HeroMotionState } from "./hero/HeroDepthWall";
import { HERO_PROOFS } from "./hero/proofs";
import styles from "./Hero.module.css";
import MagneticButton from "./MagneticButton";
import Marquee from "./Marquee";
import SplitReveal from "./system/SplitReveal";

const HeroDepthWall = dynamic(() => import("./hero/HeroDepthWall"), {
  ssr: false,
});

type RenderMode = "checking" | "webgl" | "static";

/**
 * The proof archive: one WebGL depth wall sits behind a deliberately quiet
 * DOM thesis. Camera distance, Bokeh depth-of-field, and a screen-space
 * shader mask create the separation; no CSS photo cards share the text layer.
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HeroMotionState>({
    pointerX: 0,
    pointerY: 0,
    cameraX: 0,
    cameraZ: 8.4,
    rotationY: 0,
    rotationZ: 0,
    scrollProgress: 0,
  });
  const [mode, setMode] = useState<RenderMode>("checking");
  const [isMobile, setIsMobile] = useState(false);
  const [lowQuality, setLowQuality] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const device = navigator as Navigator & { deviceMemory?: number };
    const constrained =
      mobile ||
      (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 4) ||
      (device.deviceMemory !== undefined && device.deviceMemory <= 4);

    setIsMobile(mobile);
    setLowQuality(constrained);
    setMode(
      reducedMotion || !("WebGLRenderingContext" in window) ? "static" : "webgl",
    );
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "20% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const handleReady = useCallback(() => setCanvasReady(true), []);
  const handleLoadProgress = useCallback(
    (progress: number) => setLoadProgress(progress),
    [],
  );
  const handleCanvasError = useCallback((_message: string) => {
    setCanvasReady(false);
    setMode("static");
  }, []);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const fadeElements = copyRef.current
        ? Array.from(copyRef.current.querySelectorAll("[data-hero-fade]"))
        : [];
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(fadeElements, {
          autoAlpha: 0,
          y: 22,
          duration: 0.78,
          stagger: 0.1,
          delay: 0.62,
        })
        .from(tickerRef.current, { yPercent: 100, duration: 0.65 }, "-=0.44");

      const cameraTween = gsap.to(motionRef.current, {
        cameraX: 0.62,
        cameraZ: 10.7,
        rotationY: -0.064,
        rotationZ: 0.014,
        scrollProgress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        intro.kill();
        cameraTween.scrollTrigger?.kill();
        cameraTween.kill();
        gsap.set([...fadeElements, tickerRef.current], { clearProps: "all" });
      };
    });

    mm.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const onMove = (event: PointerEvent) => {
          const bounds = root.getBoundingClientRect();
          motionRef.current.pointerX = gsap.utils.clamp(
            -1,
            1,
            ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
          );
          motionRef.current.pointerY = gsap.utils.clamp(
            -1,
            1,
            ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
          );
        };
        const onLeave = () => {
          motionRef.current.pointerX = 0;
          motionRef.current.pointerY = 0;
        };
        root.addEventListener("pointermove", onMove, { passive: true });
        root.addEventListener("pointerleave", onLeave);
        return () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        };
      },
    );

    return () => mm.revert();
  }, []);

  // The live canvas loads against the lightweight gradient rather than
  // competing with four fallback-image requests. The full grid is reserved
  // for reduced-motion/WebGL fallback mode.
  const showStaticGrid = mode === "static";
  const showLoading = mode === "checking" || (mode === "webgl" && !canvasReady);

  return (
    <section
      ref={rootRef}
      data-opaque-scene
      className={`${styles.stage} ${mode === "static" ? styles.staticStage : ""}`}
    >
      <div className={styles.sceneLayer} aria-hidden="true">
        {mode === "webgl" ? (
          <CanvasBoundary onError={handleCanvasError}>
            <HeroDepthWall
              isMobile={isMobile}
              isVisible={isVisible}
              lowQuality={lowQuality}
              motionRef={motionRef}
              onError={handleCanvasError}
              onLoadProgress={handleLoadProgress}
              onReady={handleReady}
            />
          </CanvasBoundary>
        ) : null}
        {showStaticGrid ? <StaticProofGrid /> : null}
        <div
          className={`${styles.loadingVeil} ${
            showLoading ? "" : styles.loadingVeilReady
          }`}
        >
          <div className={styles.loaderReadout} role="status" aria-live="polite">
            <span>Loading proof archive</span>
            <span className={styles.loaderValue}>
              {Math.round(loadProgress * 100).toString().padStart(2, "0")}%
            </span>
            <span className={styles.loaderTrack} aria-hidden="true">
              <span style={{ transform: `scaleX(${loadProgress})` }} />
            </span>
          </div>
        </div>
      </div>

      <div ref={copyRef} className={`${styles.copy} wrap`}>
        <div className={styles.copyInner}>
          <SplitReveal
            as="h1"
            variant="chars-up"
            delay={0.48}
            className="font-display text-display-xl font-bold text-white"
          >
            Clicks are cheap.
            <br />
            Clients are the point.
          </SplitReveal>
          <p
            data-hero-fade
            className={`${styles.subhead} mt-6 text-lg leading-relaxed text-white/85 md:text-xl`}
          >
            DG Clicks builds search, paid, and web systems that turn strangers
            into booked calls — measured in revenue, not impressions. The wall
            behind this sentence is the receipts.
          </p>
          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-4 max-[419px]:grid">
            <MagneticButton>
              <a
                href="/contact"
                data-cursor="Book"
                className="inline-block rounded-full bg-mint px-8 py-4 text-center font-medium text-night transition-colors hover:bg-white max-[419px]:w-full"
              >
                Book a free growth audit
              </a>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <a
                href="#results"
                data-cursor="Proof"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("#results");
                }}
                className="inline-block rounded-full border border-white/45 px-8 py-4 text-center font-medium text-white transition-colors hover:border-white max-[419px]:w-full"
              >
                See the proof
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>

      <ul className={styles.proofList}>
        {HERO_PROOFS.filter((proof) => proof.client && proof.result).map((proof) => (
          <li key={proof.id}>
            {proof.client}: {proof.result}. {proof.alt}
          </li>
        ))}
      </ul>

      <div ref={tickerRef} className={styles.ticker}>
        <Marquee speed={48} velocityReactive>
          {heroStats.map((stat) => (
            <p
              key={stat}
              className="flex shrink-0 items-center gap-6 whitespace-nowrap pr-6 text-sm font-medium text-white/65"
            >
              <span aria-hidden="true" className="text-mint">
                ◆
              </span>
              {stat}
            </p>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

class CanvasBoundary extends Component<
  { children: ReactNode; onError: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    this.props.onError(
      error instanceof Error ? error.message : "WebGL rendering is unavailable.",
    );
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function StaticProofGrid() {
  const proofs = HERO_PROOFS.filter((proof) => proof.client).slice(0, 4);
  return (
    <div className={styles.staticGrid}>
      {proofs.map((proof, index) => (
        <div key={proof.id} className={styles.staticCell}>
          {/* These files are already resized and WebP-compressed for the fallback. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proof.mobileSrc}
            alt=""
            width={720}
            height={480}
            decoding="async"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </div>
      ))}
    </div>
  );
}
