"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import WaterRipple from "@/components/ui/water-ripple";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "@/lib/gsap";

type Scene = {
  id: string;
  index: string;
  industry: string;
  word: string;
  headline: string;
  copy: string;
  img: string;
  alt: string;
  stat: { prefix?: string; value: number; decimals?: number; suffix: string; label: string };
  flip?: boolean;
  tall?: boolean;
  /* Desktop (horizontal-mode) placement */
  panelW: string;
  mediaH: string;
  cardH: string;
  wordH: string;
};

const SCENES: Scene[] = [
  {
    id: "freight",
    index: "01",
    industry: "Truck logistics",
    word: "FREIGHT",
    headline: "Loads booked before wheels roll.",
    copy: "Lane-level campaigns that reach shippers, not job boards.",
    img: "/images/serve-freight-truck.jpg",
    alt: "Semi-truck hauling a white trailer along a mountain highway at dusk",
    stat: { value: 5.2, decimals: 1, suffix: "×", label: "shipper quote requests" },
    panelW: "lg:w-[86vw]",
    mediaH: "lg:absolute lg:left-[7vw] lg:top-1/2 lg:h-[70vh] lg:w-[52vw] lg:-translate-y-[54%]",
    cardH: "lg:absolute lg:bottom-[13vh] lg:right-[8vw] lg:w-[24rem]",
    wordH: "lg:right-[4vw] lg:top-[9vh]",
  },
  {
    id: "furniture",
    index: "02",
    industry: "Furniture & décor",
    word: "CRAFT",
    headline: "The room sells the sofa.",
    copy: "Room-scene creative that ends in a measured quote and a delivery date.",
    img: "/images/serve-furniture.jpg",
    alt: "Emerald green velvet sofa in an elegant furniture showroom with oak flooring",
    stat: { value: 3.1, decimals: 1, suffix: "×", label: "showroom visits & deliveries" },
    flip: true,
    tall: true,
    panelW: "lg:w-[72vw]",
    mediaH: "lg:absolute lg:right-[9vw] lg:top-1/2 lg:h-[84vh] lg:w-[32vw] lg:-translate-y-1/2",
    cardH: "lg:absolute lg:bottom-[15vh] lg:left-[8vw] lg:w-[24rem]",
    wordH: "lg:left-[5vw] lg:top-[10vh]",
  },
  {
    id: "dining",
    index: "03",
    industry: "Dining & cafés",
    word: "DINING",
    headline: "From craving to booked table.",
    copy: "Local search that ends at your host stand, not a listicle.",
    img: "/images/serve-restaurant.jpg",
    alt: "Moody interior of an upscale restaurant with dark banquettes and warm brass light",
    stat: { value: 4.8, decimals: 1, suffix: "×", label: "reservations from search" },
    panelW: "lg:w-[86vw]",
    mediaH: "lg:absolute lg:left-[6vw] lg:top-1/2 lg:h-[74vh] lg:w-[54vw] lg:-translate-y-[46%]",
    cardH: "lg:absolute lg:right-[9vw] lg:top-[14vh] lg:w-[24rem]",
    wordH: "lg:right-[5vw] lg:bottom-[10vh]",
  },
  {
    id: "estate",
    index: "04",
    industry: "Real estate",
    word: "ESTATE",
    headline: "Listings that book showings.",
    copy: "Every scroll should end in a walkthrough request.",
    img: "/images/serve-realestate.jpg",
    alt: "Architectural photograph of a modern timber house glowing at dusk",
    stat: { value: 3, suffix: "×", label: "qualified viewings per listing" },
    flip: true,
    panelW: "lg:w-[86vw]",
    mediaH: "lg:absolute lg:right-[7vw] lg:top-1/2 lg:h-[70vh] lg:w-[52vw] lg:-translate-y-[52%]",
    cardH: "lg:absolute lg:bottom-[12vh] lg:left-[8vw] lg:w-[24rem]",
    wordH: "lg:left-[4vw] lg:top-[9vh]",
  },
  {
    id: "printing",
    index: "05",
    industry: "Printing & signage",
    word: "PRINT",
    headline: "Quotes straight off the press.",
    copy: "B2B search that lands on an instant-quote form, not a phone tree.",
    img: "/images/serve-printing.jpg",
    alt: "Large-format press printing vibrant colour brochures stacked in a print shop",
    stat: { value: 5, suffix: "×", label: "quote submissions per month" },
    panelW: "lg:w-[86vw]",
    mediaH: "lg:absolute lg:left-[7vw] lg:top-1/2 lg:h-[68vh] lg:w-[50vw] lg:-translate-y-[55%]",
    cardH: "lg:absolute lg:bottom-[14vh] lg:right-[9vw] lg:w-[24rem]",
    wordH: "lg:right-[4vw] lg:top-[8vh]",
  },
  {
    id: "trades",
    index: "06",
    industry: "Home services & trades",
    word: "TRADES",
    headline: "Booked solid, every season.",
    copy: "Spring roofs, summer decks, winter furnaces — demand captured early.",
    img: "/images/serve-trades.jpg",
    alt: "Construction crew in orange vests framing a roof at golden hour",
    stat: { value: 2.7, decimals: 1, suffix: "×", label: "booked estimates per season" },
    flip: true,
    panelW: "lg:w-[86vw]",
    mediaH: "lg:absolute lg:right-[6vw] lg:top-1/2 lg:h-[72vh] lg:w-[54vw] lg:-translate-y-[48%]",
    cardH: "lg:absolute lg:left-[8vw] lg:top-[16vh] lg:w-[24rem]",
    wordH: "lg:left-[5vw] lg:bottom-[11vh]",
  },
];

const ROSTER: Array<{ name: string; note: string; featured?: boolean }> = [
  { name: "Truck logistics", note: "Lanes, filled", featured: true },
  { name: "Dining & cafés", note: "Tables, booked", featured: true },
  { name: "Furniture & décor", note: "Showrooms that sell", featured: true },
  { name: "Printing & signage", note: "Quotes off the press", featured: true },
  { name: "Real estate", note: "Showings on repeat", featured: true },
  { name: "Home services & trades", note: "Season-proof jobs", featured: true },
  { name: "Healthcare clinics", note: "Patients, not clicks" },
  { name: "Automotive dealers", note: "Drives, test-booked" },
  { name: "Landscaping & snow", note: "Contracts year-round" },
  { name: "E-commerce", note: "Carts that convert" },
];

function formatStat(stat: Scene["stat"]) {
  return stat.value.toFixed(stat.decimals ?? 0);
}

export default function WhoWeServe() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);

  // Horizontal cinema only on wide, motion-friendly viewports; everyone else
  // gets the same scenes as a vertical editorial flow.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setHorizontal(wide.matches && !reduced.matches);
    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const section = ref.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const splits: SplitText[] = [];
      const listeners: Array<() => void> = [];

      const runCounter = (el: HTMLElement) => {
        const target = parseFloat(el.dataset.value || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = state.v.toFixed(decimals);
          },
        });
      };

      if (horizontal) {
        const getDist = () => track.scrollWidth - window.innerWidth;

        const scrollTween = gsap.to(track, {
          x: () => -getDist(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + getDist(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.fromTo(
          "[data-rail-fill]",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + getDist(),
              scrub: true,
            },
          },
        );

        // Intro headline unmasks as the section arrives, before the pin bites.
        const introHeading = section.querySelector<HTMLElement>(
          "[data-serve-intro-heading]",
        );
        if (introHeading) {
          const split = new SplitText(introHeading, {
            type: "lines",
            mask: "lines",
          });
          splits.push(split);
          gsap.from(split.lines, {
            yPercent: 115,
            duration: 1,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%" },
          });
        }

        const railLabel = section.querySelector<HTMLElement>("[data-rail-label]");

        gsap.utils
          .toArray<HTMLElement>("[data-serve-panel]")
          .forEach((panel) => {
            const q = gsap.utils.selector(panel);
            const inScene = {
              trigger: panel,
              containerAnimation: scrollTween,
            } as const;

            // Depth stack: background image, giant word, and ghost index all
            // travel at different speeds while the media plane tilts through.
            gsap.fromTo(
              q("[data-serve-img]"),
              { xPercent: -10, scale: 1.22 },
              {
                xPercent: 8,
                scale: 1.04,
                ease: "none",
                scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
              },
            );
            gsap.fromTo(
              q("[data-serve-media]"),
              { rotationY: 7, transformPerspective: 1400 },
              {
                rotationY: -7,
                transformPerspective: 1400,
                ease: "none",
                scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
              },
            );
            gsap.fromTo(
              q("[data-serve-word]"),
              { xPercent: 26 },
              {
                xPercent: -26,
                ease: "none",
                scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
              },
            );
            gsap.fromTo(
              q("[data-serve-num]"),
              { xPercent: 45 },
              {
                xPercent: -45,
                ease: "none",
                scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
              },
            );
            gsap.fromTo(
              q("[data-serve-sweep]"),
              { xPercent: -160 },
              {
                xPercent: 340,
                ease: "none",
                scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
              },
            );
            gsap.utils
              .toArray<HTMLElement>(q("[data-serve-float]"))
              .forEach((el, i) => {
                gsap.fromTo(
                  el,
                  { y: i % 2 ? 70 : -70, rotation: -20 },
                  {
                    y: i % 2 ? -70 : 70,
                    rotation: 20,
                    ease: "none",
                    scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
                  },
                );
              });

            const card = q("[data-serve-card]")[0];
            if (card) {
              gsap.from(card, {
                y: 64,
                opacity: 0,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                  ...inScene,
                  start: "left 66%",
                  toggleActions: "play none none reverse",
                },
              });
            }

            const headline = q<HTMLElement>("[data-serve-headline]")[0];
            if (headline) {
              const split = new SplitText(headline, { type: "lines", mask: "lines" });
              splits.push(split);
              gsap.from(split.lines, {
                yPercent: 115,
                duration: 0.8,
                stagger: 0.09,
                ease: "power3.out",
                scrollTrigger: {
                  ...inScene,
                  start: "left 62%",
                  toggleActions: "play none none reverse",
                },
              });
            }

            const count = q<HTMLElement>("[data-serve-count]")[0];
            if (count) {
              ScrollTrigger.create({
                ...inScene,
                start: "left 60%",
                once: true,
                onEnter: () => runCounter(count),
              });
            }

            const label = panel.dataset.sceneLabel;
            if (label && railLabel) {
              ScrollTrigger.create({
                ...inScene,
                start: "left 55%",
                end: "right 45%",
                onToggle: (self) => {
                  if (self.isActive) railLabel.textContent = label;
                },
              });
            }
          });

        // Outro roster rows cascade in as the last panel arrives.
        gsap.from("[data-roster-row]", {
          y: 34,
          opacity: 0,
          duration: 0.7,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-serve-outro]",
            containerAnimation: scrollTween,
            start: "left 70%",
            toggleActions: "play none none reverse",
          },
        });

        // Pointer tilt adds one more plane of depth on hover-capable screens.
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          gsap.utils
            .toArray<HTMLElement>("[data-serve-panel]")
            .forEach((panel) => {
              const tilt = panel.querySelector<HTMLElement>("[data-serve-tilt]");
              const card = panel.querySelector<HTMLElement>("[data-serve-card]");
              if (!tilt) return;
              const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.7, ease: "power3.out" });
              const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.7, ease: "power3.out" });
              const cx = card
                ? gsap.quickTo(card, "x", { duration: 0.9, ease: "power3.out" })
                : null;
              const cy = card
                ? gsap.quickTo(card, "y", { duration: 0.9, ease: "power3.out" })
                : null;
              gsap.set(tilt, { transformPerspective: 1200 });

              const move = (e: PointerEvent) => {
                const r = panel.getBoundingClientRect();
                const nx = (e.clientX - r.left) / r.width - 0.5;
                const ny = (e.clientY - r.top) / r.height - 0.5;
                rx(ny * -4);
                ry(nx * 5);
                cx?.(nx * -14);
                cy?.(ny * -10);
              };
              const leave = () => {
                rx(0);
                ry(0);
                cx?.(0);
                cy?.(0);
              };
              panel.addEventListener("pointermove", move, { passive: true });
              panel.addEventListener("pointerleave", leave);
              listeners.push(() => {
                panel.removeEventListener("pointermove", move);
                panel.removeEventListener("pointerleave", leave);
              });
            });
        }
      } else {
        // Vertical flow (touch, narrow, or no pin): each scene still arrives
        // with weight — clip reveal, sliding word, cascading card.
        gsap.utils
          .toArray<HTMLElement>("[data-serve-panel]")
          .forEach((panel) => {
            const q = gsap.utils.selector(panel);
            const enter = {
              trigger: panel,
              start: "top 74%",
            } as const;

            gsap.from(q("[data-serve-media]"), {
              clipPath: "inset(10% 6% 10% 6%)",
              opacity: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: enter,
            });
            gsap.fromTo(
              q("[data-serve-img]"),
              { yPercent: -8, scale: 1.15 },
              {
                yPercent: 8,
                scale: 1.02,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
            gsap.from(q("[data-serve-word]"), {
              xPercent: 20,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: enter,
            });
            gsap.from(q("[data-serve-card]"), {
              y: 44,
              opacity: 0,
              duration: 0.8,
              delay: 0.12,
              ease: "power3.out",
              scrollTrigger: enter,
            });

            const count = q<HTMLElement>("[data-serve-count]")[0];
            if (count) {
              ScrollTrigger.create({
                trigger: panel,
                start: "top 60%",
                once: true,
                onEnter: () => runCounter(count),
              });
            }
          });

        gsap.from("[data-roster-row]", {
          y: 28,
          opacity: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-serve-outro]", start: "top 76%" },
        });
      }

      return () => {
        splits.forEach((s) => s.revert());
        listeners.forEach((off) => off());
      };
    },
    { scope: ref, dependencies: [horizontal], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="who-we-serve"
      data-opaque-scene
      aria-label="Who we serve — an editorial tour of the industries we grow"
      className={`relative overflow-hidden bg-[#050b14] text-white ${
        horizontal ? "h-screen" : ""
      }`}
    >
      {/* Ambient set lighting behind every scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[15%] top-[-20%] z-0 h-[36rem] w-[36rem] rounded-full bg-cobalt/20 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-25%] right-[10%] z-0 h-[32rem] w-[32rem] rounded-full bg-sky/10 blur-[120px]"
      />

      <div
        ref={trackRef}
        className={
          horizontal
            ? "relative z-10 flex h-full w-max flex-nowrap items-stretch will-change-transform"
            : "relative z-10 flex flex-col"
        }
      >
        {/* ——— Intro ——— */}
        <div
          className={`relative flex flex-col justify-center ${
            horizontal
              ? "h-full w-[62vw] shrink-0 px-[6vw]"
              : "min-h-[70vh] px-5 py-24 sm:px-10"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sky/80">
            [ Who we serve ]
          </p>
          <h2
            data-serve-intro-heading
            className="mt-6 font-display text-[clamp(2.8rem,6.2vw,6.5rem)] font-medium leading-[0.97] tracking-[-0.045em] !text-white"
          >
            From loading docks to dinner tables.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Built for the businesses that keep Canada moving — freight, food,
            homes, and the trades. Walk through the rooms we work in.
          </p>
          {horizontal && (
            <p
              aria-hidden
              className="mt-14 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40"
            >
              Scroll
              <span className="inline-block h-px w-16 bg-gradient-to-r from-white/50 to-transparent" />
            </p>
          )}
        </div>

        {/* ——— Scenes ——— */}
        {SCENES.map((scene) => (
          <article
            key={scene.id}
            data-serve-panel
            data-scene-label={`${scene.index} — ${scene.industry}`}
            className={`relative ${
              horizontal
                ? `h-full shrink-0 ${scene.panelW}`
                : "flex flex-col justify-center px-0 py-14"
            }`}
          >
            {/* Ghost index number, deepest layer */}
            <span
              data-serve-num
              aria-hidden
              className={`pointer-events-none absolute z-0 select-none font-display font-medium leading-none text-white/[0.045] ${
                horizontal
                  ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[34vw]"
                  : "right-2 top-2 text-[36vw]"
              }`}
            >
              {scene.index}
            </span>

            {/* Media plane */}
            <div
              className={`relative z-10 ${
                horizontal
                  ? scene.mediaH
                  : "h-[54vh] w-full sm:h-[62vh]"
              }`}
            >
              <div
                data-serve-media
                className="h-full w-full will-change-transform [transform-style:preserve-3d]"
              >
                <div
                  data-serve-tilt
                  className="relative h-full w-full overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
                >
                  <div data-serve-img className="absolute -inset-x-[14%] inset-y-0">
                    <Image
                      src={scene.img}
                      alt={scene.alt}
                      fill
                      sizes="(max-width: 1023px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,20,0.12)_0%,transparent_40%,rgba(5,11,20,0.45)_100%)]"
                  />
                  <div
                    data-serve-sweep
                    aria-hidden
                    className="pointer-events-none absolute inset-y-[-10%] left-0 w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.17] to-transparent mix-blend-screen"
                  />
                </div>
              </div>
            </div>

            {/* Giant outlined industry word riding the media edge */}
            <span
              data-serve-word
              aria-hidden
              className={`pointer-events-none absolute z-20 select-none font-light leading-none tracking-[0.02em] text-transparent ${
                horizontal
                  ? `text-[clamp(5rem,11vw,12rem)] ${scene.wordH}`
                  : "-top-4 left-3 text-[16vw]"
              }`}
              style={{
                // The primary variable display face creates overlapping contours
                // under text-stroke; these static faces keep the outline clean.
                fontFamily:
                  '"Futura", "Century Gothic", "Avenir Next", "Trebuchet MS", Arial, sans-serif',
                WebkitTextStroke: "1.5px rgba(255,255,255,0.34)",
              }}
            >
              {scene.word}
            </span>

            {/* Floating accents */}
            <span
              data-serve-float
              aria-hidden
              className={`pointer-events-none absolute z-0 hidden h-44 w-44 rounded-full border border-sky/20 lg:block ${
                scene.flip ? "left-[16vw] top-[16vh]" : "right-[14vw] bottom-[18vh]"
              }`}
            />
            <span
              data-serve-float
              aria-hidden
              className={`pointer-events-none absolute z-0 hidden h-28 w-28 rounded-full bg-cobalt/25 blur-2xl lg:block ${
                scene.flip ? "right-[30vw] bottom-[12vh]" : "left-[26vw] top-[10vh]"
              }`}
            />

            {/* Glass information card */}
            <div
              data-serve-card
              className={`z-30 rounded-2xl border border-white/[0.14] bg-white/[0.07] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7 ${
                horizontal
                  ? scene.cardH
                  : "relative mx-4 -mt-14 sm:mx-8"
              }`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-sky/80">
                {scene.index} / {scene.industry}
              </p>
              <h3
                data-serve-headline
                className="mt-3 font-display text-[1.6rem] font-medium leading-[1.05] tracking-[-0.02em] !text-white sm:text-3xl"
              >
                {scene.headline}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {scene.copy}
              </p>
              <div className="mt-5 flex items-end gap-3 border-t border-white/10 pt-4">
                <p className="font-display text-4xl font-medium leading-none tracking-[-0.03em] text-white">
                  {scene.stat.prefix}
                  <span
                    data-serve-count
                    data-value={scene.stat.value}
                    data-decimals={scene.stat.decimals ?? 0}
                  >
                    {formatStat(scene.stat)}
                  </span>
                  <span className="text-sky">{scene.stat.suffix}</span>
                </p>
                <p className="max-w-[10rem] pb-0.5 text-[10px] uppercase leading-snug tracking-[0.14em] text-white/50">
                  {scene.stat.label}
                </p>
              </div>
            </div>
          </article>
        ))}

        {/* ——— Roster / outro ——— */}
        <div
          data-serve-outro
          className={`relative flex flex-col justify-center ${
            horizontal
              ? "h-full w-[92vw] shrink-0 px-[7vw]"
              : "px-5 py-20 sm:px-10"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-sky/80">
            The full roster
          </p>
          <div className="mt-8 grid gap-x-16 sm:grid-cols-2">
            {ROSTER.map((row, i) => (
              <p
                key={row.name}
                data-roster-row
                className="group flex items-baseline gap-4 border-b border-white/10 py-3.5"
              >
                <span className="font-mono text-[9px] tracking-[0.18em] text-white/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-xl font-medium tracking-tight text-white/90 transition-all duration-glass group-hover:translate-x-1.5 group-hover:text-sky sm:text-2xl">
                  {row.name}
                </span>
                {row.featured && (
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-[#cedb58] shadow-[0_0_12px_rgba(206,219,88,0.8)]"
                  />
                )}
                <span className="ml-auto hidden text-right font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 sm:block">
                  {row.note}
                </span>
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-pill bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-glass hover:bg-sky"
            >
              Your industry is next <span aria-hidden>→</span>
            </Link>
            <p className="text-caption text-white/45">
              Free audit · replies in 1 business day
            </p>
          </div>
        </div>
      </div>

      {/* Water light rides above the imagery */}
      <WaterRipple className="z-20" intensity={0.35} />

      {/* Progress rail */}
      {horizontal && (
        <div className="absolute inset-x-[6vw] bottom-7 z-40 flex items-center gap-6">
          <p
            data-rail-label
            className="min-w-[13rem] font-mono text-[9px] uppercase tracking-[0.22em] text-white/55"
          >
            Who we serve
          </p>
          <div className="relative h-px flex-1 bg-white/15">
            <span
              data-rail-fill
              className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-cobalt via-sky to-[#cedb58]"
            />
          </div>
          <p
            aria-hidden
            className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/35"
          >
            Keep scrolling
          </p>
        </div>
      )}
    </section>
  );
}
