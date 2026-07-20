"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { SERVICE_PAGE, type ServicePageItem } from "./page-data";
import ServiceInstrument from "./ServiceInstrument";

const TONE: Record<
  ServicePageItem["tone"],
  { bg: string; text: string; muted: string; dark: boolean }
> = {
  cloud: {
    bg: "bg-cloud",
    text: "text-ink",
    muted: "text-slate",
    dark: false,
  },
  mist: {
    bg: "bg-mistpanel",
    text: "text-ink",
    muted: "text-slate",
    dark: false,
  },
  night: {
    bg: "bg-night",
    text: "text-chrome",
    muted: "text-fog",
    dark: true,
  },
  void: {
    bg: "bg-void",
    text: "text-chrome",
    muted: "text-chrome-dim",
    dark: true,
  },
  azure: {
    bg: "bg-[#2E6BA8]",
    text: "text-white",
    muted: "text-white/75",
    dark: true,
  },
};

export default function ServiceDeepDives() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-service-chapter]");

      sections.forEach((section) => {
        const heading = section.querySelector("[data-chapter-heading]");
        const fade = section.querySelectorAll("[data-chapter-fade]");
        const instrument = section.querySelector("[data-instrument]");
        const dark = section.dataset.dark === "true";

        if (!prefersReducedMotion() && heading) {
          const split = new SplitText(heading, {
            type: "words,lines",
            linesClass: "block overflow-hidden",
          });
          gsap.from(split.words, {
            yPercent: 80,
            opacity: 0,
            duration: 0.85,
            stagger: 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              once: true,
            },
          });
        }

        gsap.from(fade, {
          y: 28,
          opacity: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            once: true,
          },
        });

        if (instrument && !prefersReducedMotion()) {
          gsap.from(instrument, {
            y: 48,
            scale: 0.94,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              once: true,
            },
          });

          const spins = instrument.querySelectorAll("[data-spin]");
          spins.forEach((el) => {
            const dir = el.getAttribute("data-dir") === "-1" ? -1 : 1;
            gsap.to(el, {
              rotation: 360 * dir,
              transformOrigin: "50% 50%",
              duration: 28,
              repeat: -1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                toggleActions: "play pause resume pause",
              },
            });
          });

          const bars = instrument.querySelectorAll("[data-bar]");
          if (bars.length) {
            gsap.from(bars, {
              scaleY: 0.2,
              transformOrigin: "bottom",
              duration: 0.9,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                once: true,
              },
            });
          }

          const draws = instrument.querySelectorAll("[data-draw]");
          draws.forEach((el) => {
            const length =
              "getTotalLength" in el
                ? (el as SVGGeometryElement).getTotalLength()
                : 200;
            gsap.fromTo(
              el,
              { strokeDasharray: length, strokeDashoffset: length },
              {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 58%",
                  once: true,
                },
              },
            );
          });

          const pulses = instrument.querySelectorAll("[data-pulse]");
          pulses.forEach((el, i) => {
            gsap.fromTo(
              el,
              { scale: 0.7, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.9,
                delay: i * 0.12,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 60%",
                  once: true,
                },
              },
            );
          });

          gsap.to(instrument.querySelectorAll("[data-instrument-pulse]"), {
            scale: 1.35,
            opacity: 0.45,
            duration: 0.9,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              toggleActions: "play pause resume pause",
            },
          });

          // Soft parallax on the instrument while in view
          gsap.to(instrument, {
            yPercent: dark ? -6 : -8,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      {SERVICE_PAGE.map((service, i) => (
        <Chapter key={service.id} service={service} flip={i % 2 === 1} />
      ))}
    </div>
  );
}

function Chapter({
  service,
  flip,
}: {
  service: ServicePageItem;
  flip: boolean;
}) {
  const tone = TONE[service.tone];

  return (
    <section
      id={`service-${service.id}`}
      data-service-chapter
      data-dark={tone.dark ? "true" : "false"}
      aria-labelledby={`heading-${service.id}`}
      className={`relative overflow-hidden ${tone.bg} ${tone.text}`}
    >
      {/* Soft field */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full opacity-40 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${service.accent}33, transparent 65%)`,
          }}
        />
        {tone.dark && (
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        )}
      </div>

      <div className="wrap relative z-10 grid min-h-[100svh] items-center gap-12 py-24 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div
          className={`${flip ? "lg:order-2" : ""} max-w-xl`}
        >
          <div data-chapter-fade className="flex items-center gap-3">
            <span
              className="font-mono text-[11px] tabular-nums tracking-[0.24em]"
              style={{ color: service.accent }}
            >
              {service.index}
            </span>
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.26em] ${tone.muted}`}
            >
              {service.name}
            </span>
          </div>

          <p
            data-chapter-fade
            className="mt-5 font-display text-xl tracking-[-0.02em] sm:text-2xl"
            style={{ color: service.accent }}
          >
            {service.outcome}
          </p>

          <h2
            id={`heading-${service.id}`}
            data-chapter-heading
            className={`mt-3 font-display text-[clamp(1.85rem,3.8vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.035em] ${
              service.tone === "azure"
                ? "!text-white"
                : tone.dark
                  ? "!text-chrome"
                  : "!text-ink"
            }`}
          >
            {service.headline}
          </h2>

          <p
            data-chapter-fade
            className={`mt-5 text-body leading-relaxed ${tone.muted}`}
          >
            {service.copy}
          </p>

          <ul data-chapter-fade className="mt-8 space-y-0 border-t border-current/10">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-current/10 py-3.5"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: service.accent }}
                  aria-hidden
                />
                <span className="text-sm sm:text-[0.95rem]">{item}</span>
              </li>
            ))}
          </ul>

          <div
            data-chapter-fade
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <p
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-night"
              style={{ backgroundColor: "#CEDB58" }}
            >
              {service.proof}
            </p>
            <Link
              href="/contact"
              className={
                tone.dark
                  ? "text-sm font-medium text-chrome underline decoration-mint/50 underline-offset-4 transition-colors hover:text-mint"
                  : "text-sm font-medium text-ink underline decoration-cobalt/40 underline-offset-4 transition-colors hover:text-cobalt"
              }
            >
              Brief this channel →
            </Link>
          </div>

          <p
            data-chapter-fade
            className={`mt-6 font-mono text-[10px] uppercase tracking-[0.2em] ${tone.muted}`}
          >
            Measure · {service.measure}
          </p>
        </div>

        <div
          className={`flex justify-center ${
            flip ? "lg:order-1 lg:justify-start" : "lg:justify-end"
          }`}
        >
          <ServiceInstrument
            visual={service.visual}
            accent={service.accent}
            dark={tone.dark}
          />
        </div>
      </div>
    </section>
  );
}
