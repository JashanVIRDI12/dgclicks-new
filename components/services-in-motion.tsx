"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { services } from "@/lib/data";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

/* ————————————————————————————————————————————————————————————————
   SERVICES IN MOTION — five capabilities, each owning nearly a full
   viewport in a horizontal glide. Big type, a living geometric motif
   per service, layered parallax. Vertical editorial flow on mobile
   and for reduced motion.
   ———————————————————————————————————————————————————————————————— */

const ACCENTS: Record<string, string> = {
  seo: "#2A5FD9",
  web: "#6FB8F2",
  ads: "#cedb58",
  smm: "#7c6ff2",
  graphic: "#f2996f",
};

/** Abstract animated motif per service — stroked geometry, no icons. */
function Motif({ kind, accent }: { kind: string; accent: string }) {
  if (kind === "seo") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        {[70, 120, 170].map((r, i) => (
          <circle
            key={r}
            data-motif-spin
            data-dir={i % 2 ? -1 : 1}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke={accent}
            strokeOpacity={0.25 - i * 0.06}
            strokeWidth="1.5"
            strokeDasharray={`${r * 1.6} ${r * 3}`}
          />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            data-motif-bar
            x={140 + i * 26}
            y={240 - i * 22}
            width="12"
            height={30 + i * 22}
            fill={accent}
            fillOpacity={0.18 + i * 0.08}
          />
        ))}
      </svg>
    );
  }
  if (kind === "web") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        <path
          data-motif-draw
          d="M150 120 L90 200 L150 280"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          data-motif-draw
          d="M250 120 L310 200 L250 280"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          data-motif-draw
          x1="222"
          y1="110"
          x2="178"
          y2="290"
          stroke={accent}
          strokeOpacity="0.5"
          strokeWidth="2.5"
        />
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            data-motif-float
            cx={120 + i * 55}
            cy={330}
            r="3.5"
            fill={accent}
            fillOpacity="0.5"
          />
        ))}
      </svg>
    );
  }
  if (kind === "ads") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        {[150, 105, 60].map((r, i) => (
          <circle
            key={r}
            data-motif-pulse
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke={accent}
            strokeOpacity={0.2 + i * 0.12}
            strokeWidth="1.5"
          />
        ))}
        <circle cx="200" cy="200" r="14" fill={accent} fillOpacity="0.7" />
        <line
          data-motif-spin
          x1="200"
          y1="200"
          x2="340"
          y2="110"
          stroke={accent}
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (kind === "smm") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
        <ellipse
          data-motif-spin
          cx="200"
          cy="200"
          rx="150"
          ry="60"
          fill="none"
          stroke={accent}
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />
        <ellipse
          data-motif-spin
          data-dir="-1"
          cx="200"
          cy="200"
          rx="110"
          ry="130"
          fill="none"
          stroke={accent}
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
        {[[80, 200], [320, 200], [200, 70]].map(([x, y], i) => (
          <circle
            key={i}
            data-motif-float
            cx={x}
            cy={y}
            r="7"
            fill={accent}
            fillOpacity="0.55"
          />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <rect
        data-motif-spin
        x="110"
        y="110"
        width="140"
        height="140"
        fill="none"
        stroke={accent}
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <circle
        data-motif-float
        cx="250"
        cy="250"
        r="75"
        fill={accent}
        fillOpacity="0.14"
      />
      <line
        data-motif-draw
        x1="90"
        y1="310"
        x2="310"
        y2="90"
        stroke={accent}
        strokeOpacity="0.4"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function ServicesInMotion() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [horizontal, setHorizontal] = useState(false);

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

      // Ambient motif life, active in both modes.
      gsap.utils.toArray<HTMLElement>("[data-motif-spin]").forEach((el) => {
        const dir = parseFloat(el.dataset.dir || "1");
        gsap.to(el, {
          rotation: 360 * dir,
          transformOrigin: "50% 50%",
          duration: 30 + Math.abs(dir) * 6,
          repeat: -1,
          ease: "none",
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-motif-pulse]").forEach((el, i) => {
        gsap.to(el, {
          scale: 1.12,
          transformOrigin: "50% 50%",
          duration: 2.2 + i * 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-motif-float]").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 14 : -14,
          duration: 2.4 + i * 0.35,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-motif-bar]").forEach((el, i) => {
        gsap.from(el, {
          scaleY: 0.3,
          transformOrigin: "50% 100%",
          duration: 1.6 + i * 0.25,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });

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
          "[data-siv-progress]",
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

        const counter = section.querySelector<HTMLElement>("[data-siv-counter]");

        gsap.utils.toArray<HTMLElement>("[data-siv-panel]").forEach((panel, i) => {
          const q = gsap.utils.selector(panel);
          const inScene = { trigger: panel, containerAnimation: scrollTween } as const;

          gsap.fromTo(
            q("[data-siv-motif]"),
            { xPercent: 24, rotation: -8 },
            {
              xPercent: -24,
              rotation: 8,
              ease: "none",
              scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.fromTo(
            q("[data-siv-image]"),
            { yPercent: 14, xPercent: 10 },
            {
              yPercent: -10,
              xPercent: -6,
              ease: "none",
              scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.fromTo(
            q("[data-siv-ghost]"),
            { xPercent: 36 },
            {
              xPercent: -36,
              ease: "none",
              scrollTrigger: { ...inScene, start: "left right", end: "right left", scrub: true },
            },
          );

          const title = q<HTMLElement>("[data-siv-title]")[0];
          if (title) {
            const split = new SplitText(title, { type: "lines", mask: "lines" });
            splits.push(split);
            gsap.from(split.lines, {
              yPercent: 115,
              duration: 0.85,
              stagger: 0.09,
              ease: "power3.out",
              scrollTrigger: { ...inScene, start: "left 62%", toggleActions: "play none none reverse" },
            });
          }
          gsap.from(q("[data-siv-reveal]"), {
            y: 26,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { ...inScene, start: "left 58%", toggleActions: "play none none reverse" },
          });

          if (counter) {
            gsap.timeline({
              scrollTrigger: {
                ...inScene,
                start: "left 55%",
                end: "right 45%",
                onToggle: (self) => {
                  if (self.isActive)
                    counter.textContent = String(i + 1).padStart(2, "0");
                },
              },
            });
          }
        });
      } else {
        gsap.utils.toArray<HTMLElement>("[data-siv-panel]").forEach((panel) => {
          const q = gsap.utils.selector(panel);
          gsap.from(q("[data-siv-title], [data-siv-reveal]"), {
            y: 32,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 76%" },
          });
          gsap.fromTo(
            q("[data-siv-image]"),
            { yPercent: 10 },
            {
              yPercent: -10,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 1 },
            },
          );
        });
      }

      return () => splits.forEach((s) => s.revert());
    },
    { scope: ref, dependencies: [horizontal], revertOnUpdate: true },
  );

  return (
    <section
      ref={ref}
      id="services"
      aria-label="Our services"
      className={`relative overflow-hidden bg-[#eef2f8] text-ink ${
        horizontal ? "h-screen" : ""
      }`}
    >
      <div
        ref={trackRef}
        className={
          horizontal
            ? "relative z-10 flex h-full w-max flex-nowrap items-stretch will-change-transform"
            : "relative z-10 flex flex-col"
        }
      >
        {/* Intro panel */}
        <div
          className={`relative flex flex-col justify-center ${
            horizontal
              ? "h-full w-[52vw] shrink-0 px-[6vw]"
              : "min-h-[52vh] px-5 pb-4 pt-24 sm:px-10"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cobalt">
            [ Services in motion ]
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.6rem,5.6vw,5.5rem)] font-medium leading-[0.97] tracking-[-0.045em] text-ink">
            Five levers. One measured system.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate sm:text-base">
            Every capability exists to strengthen a specific part of your
            business&apos;s digital ecosystem — measured with clear,
            plain-English reporting.
          </p>
          {horizontal && (
            <p
              aria-hidden
              className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-slate/50"
            >
              Scroll
              <span className="inline-block h-px w-16 bg-gradient-to-r from-ink/40 to-transparent" />
            </p>
          )}
        </div>

        {/* Service panels */}
        {services.map((service, i) => {
          const accent = ACCENTS[service.visual] ?? "#2A5FD9";
          const flip = i % 2 === 1;
          return (
            <article
              key={service.id}
              data-siv-panel
              className={`relative ${
                horizontal
                  ? "flex h-full w-[80vw] shrink-0 items-center px-[5vw]"
                  : "px-5 py-16 sm:px-10"
              }`}
            >
              {/* Ghost index */}
              <span
                data-siv-ghost
                aria-hidden
                className={`pointer-events-none absolute select-none font-display font-medium leading-none text-ink/[0.045] ${
                  horizontal
                    ? "right-[2vw] top-[6vh] text-[24vw]"
                    : "right-0 top-4 text-[34vw]"
                }`}
              >
                0{i + 1}
              </span>

              {/* Living motif */}
              <div
                data-siv-motif
                aria-hidden
                className={`pointer-events-none absolute will-change-transform ${
                  horizontal
                    ? `top-1/2 h-[62vh] w-[62vh] -translate-y-1/2 ${
                        flip ? "left-[2vw]" : "right-[6vw]"
                      }`
                    : "right-[-10%] top-8 h-72 w-72 opacity-70"
                }`}
              >
                <Motif kind={service.visual} accent={accent} />
              </div>

              <div
                className={`relative z-10 ${
                  horizontal
                    ? `grid w-full items-center gap-[4vw] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] ${
                        flip ? "lg:[direction:rtl]" : ""
                      }`
                    : ""
                }`}
              >
                <div className={horizontal && flip ? "[direction:ltr]" : ""}>
                  <p
                    data-siv-reveal
                    className="font-mono text-[10px] uppercase tracking-[0.26em]"
                    style={{ color: accent }}
                  >
                    0{i + 1} / {service.outcome}
                  </p>
                  <h3
                    data-siv-title
                    className="mt-4 max-w-2xl font-display text-[clamp(2.4rem,5.6vw,5.2rem)] font-medium leading-[1.05] tracking-[-0.04em] text-ink"
                  >
                    {service.title}
                  </h3>
                  <p
                    data-siv-reveal
                    className="mt-5 max-w-md text-sm leading-relaxed text-slate sm:text-base"
                  >
                    {service.copy}
                  </p>

                  <ul data-siv-reveal className="mt-7 max-w-md">
                    {service.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-baseline gap-3 border-t border-ink/10 py-2.5 text-sm text-ink/80"
                      >
                        <span aria-hidden className="text-xs" style={{ color: accent }}>
                          →
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>

                  <p
                    data-siv-reveal
                    className="mt-6 inline-flex items-center gap-2 rounded-pill border border-ink/10 bg-white/70 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/70 backdrop-blur-sm"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: accent }}
                    />
                    {service.proof}
                  </p>
                </div>

                {/* Floating imagery */}
                <div
                  className={`${
                    horizontal
                      ? "relative h-[46vh] w-full [direction:ltr]"
                      : "relative mt-10 h-64 w-full max-w-md"
                  }`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[18px] shadow-[0_30px_70px_rgba(15,27,45,0.18)]">
                    <div data-siv-image className="absolute -inset-[12%] will-change-transform">
                      <Image
                        src={service.image.src}
                        alt={service.alt}
                        fill
                        sizes="(max-width: 1023px) 90vw, 30vw"
                        placeholder="blur"
                        blurDataURL={service.image.blurDataURL}
                        className="object-cover"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(160deg, transparent 55%, ${accent}26 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Outro CTA panel */}
        <div
          className={`relative flex flex-col justify-center ${
            horizontal
              ? "h-full w-[44vw] shrink-0 px-[5vw]"
              : "px-5 pb-24 pt-8 sm:px-10"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-cobalt">
            One loop
          </p>
          <p className="mt-4 max-w-xs font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
            Each lever is stronger when the same team pulls all five.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-pill bg-ink px-6 py-3 text-sm font-medium text-white transition-colors duration-glass hover:bg-cobalt"
          >
            Explore the services <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* Progress rail */}
      {horizontal && (
        <div className="absolute inset-x-[6vw] bottom-7 z-20 flex items-center gap-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate/60">
            <span data-siv-counter>01</span> / 05
          </p>
          <div className="relative h-px flex-1 bg-ink/10">
            <span
              data-siv-progress
              className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-cobalt to-sky"
            />
          </div>
        </div>
      )}
    </section>
  );
}
