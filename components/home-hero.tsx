"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

const RobotHero = dynamic(
  () => import("@/components/ui/robot-hero").then((m) => m.RobotHero),
  {
    ssr: false,
    loading: () => (
      <div className="h-dvh min-h-[600px] w-full bg-[#EAF0F7]" aria-hidden />
    ),
  },
);

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !headlineRef.current) return;

      // Text-generation reveal: each word resolves from a soft blur, in
      // reading order — more organic than a single line wipe.
      const split = new SplitText(headlineRef.current, {
        type: "words,lines",
        linesClass: "block overflow-hidden",
      });

      gsap
        .timeline({ delay: 0.3 })
        .fromTo(
          split.words,
          { yPercent: 60, opacity: 0, filter: "blur(12px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.055,
          },
        )
        .fromTo(
          "[data-hero-fade]",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.09, ease: "power3.out" },
          "-=0.75",
        );

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <section id="hero" ref={ref} aria-label="Hero" className="relative">
      <RobotHero
        backgroundText="DGCLICKS"
        navItemsLeft={[
          { label: "Work", href: "/#showcase" },
          { label: "Services", href: "/services" },
          { label: "About", href: "/about" },
        ]}
        contactText="Contact"
        contactHref="/contact"
        ctaText="Free growth audit"
        onCtaClick={() => {
          window.location.href = "/contact";
        }}
        accentColor="#4D9FFF"
        background={{ top: "#EAF0F7", mid: "#C7D3E2", bottom: "#DCE4EE" }}
      >
        <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h1
              ref={headlineRef}
              className="font-display text-[clamp(2.35rem,4.6vw,3.9rem)] font-semibold leading-[1.03] tracking-[-0.035em] text-[#0B1830]"
            >
              Clicks are cheap. Clients are the point.
            </h1>
            <p data-hero-fade className="mt-4 max-w-md text-base text-[#51617A]">
              SEO, sites, ads, and social — measured in qualified enquiries,
              not impressions.
            </p>
            <div data-hero-fade className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-primary pointer-events-auto"
              >
                Start a free growth audit
              </Link>
              <Link
                href="/#showcase"
                className="pointer-events-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill border border-[rgba(15,27,45,0.18)] bg-white/50 px-6 py-3 text-sm font-medium text-[#0F1B2D] backdrop-blur-sm transition-all duration-glass hover:bg-white"
              >
                See the work
              </Link>
            </div>
          </div>

          <div
            data-hero-fade
            className="hidden flex-col items-end gap-3 text-right sm:flex"
          >
            <p className="max-w-[13rem] text-caption text-[#51617A]">
              <span className="font-medium text-[#0F1B2D]">40+</span> Canadian
              operators trust the Friday report
            </p>
            <span
              className="block h-10 w-px bg-gradient-to-b from-[#2A5FD9] to-transparent"
              aria-hidden
            />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#51617A]">
              Scroll
            </span>
          </div>
        </div>
      </RobotHero>
    </section>
  );
}
