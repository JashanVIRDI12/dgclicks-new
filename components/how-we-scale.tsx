"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { services } from "@/lib/data";
import { homeImg } from "@/lib/home-images";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

/* The zoom scene reads left-to-right as the five disciplines, framed by the
   studio at the centre and the team at the edge. */
const PARALLAX_IMAGES = [
  {
    src: homeImg.seo.src,
    alt: "Performance dashboard measuring qualified enquiries",
    blurDataURL: homeImg.seo.blurDataURL,
  },
  ...services.map((service) => ({
    src: service.image.src,
    alt: service.alt,
    blurDataURL: service.image.blurDataURL,
  })),
  {
    src: homeImg.team.src,
    alt: "Digi Clicks team in the studio with brand mark on the wall",
    blurDataURL: homeImg.team.blurDataURL,
  },
];

export default function HowWeScale() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const section = ref.current;
      if (!section) return;

      const heading = section.querySelector<HTMLElement>("[data-scale-heading]");
      if (heading) {
        const split = new SplitText(heading, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 118,
          duration: 0.95,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 76%" },
        });
      }

      gsap.from("[data-scale-intro]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 74%" },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="process"
      aria-labelledby="scale-heading"
      className="relative bg-gradient-to-b from-[#f4f6fa] to-[#e9eef5]"
    >
      {/* Intro — calm, editorial, generous whitespace */}
      <div className="wrap flex flex-col items-center pb-16 pt-24 text-center sm:pb-20 sm:pt-28">
        <p
          data-scale-intro
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-cobalt"
        >
          [ Our approach ]
        </p>
        <h2
          id="scale-heading"
          data-scale-heading
          className="mt-6 max-w-3xl font-display text-[clamp(2.4rem,5.2vw,4.8rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-ink"
        >
          Strategy first. Execution second.
        </h2>
        <p
          data-scale-intro
          className="mt-6 max-w-md text-sm leading-relaxed text-slate sm:text-base"
        >
          Every project begins by understanding your brand, audience, and
          growth objectives — then we combine creativity, technology, and
          market insight to create meaningful business impact.
        </p>
      </div>

      {/* Zoom scene */}
      <ZoomParallax images={PARALLAX_IMAGES} />

      {/* Outro */}
      <div className="wrap pb-24 pt-16 sm:pb-28">
        <div className="flex flex-col gap-8 border-t border-ink/10 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cobalt">
              [ Understand · strategize · create · grow ]
            </p>
            <p className="mt-3 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
              Successful digital experiences aren&apos;t built by chance.
            </p>
          </div>
          <nav
            aria-label="Growth system actions"
            className="flex flex-wrap items-center gap-3"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3 text-sm font-medium text-white transition-colors duration-glass hover:bg-cobalt"
            >
              Book a discovery call <span aria-hidden>→</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition-colors duration-glass hover:border-cobalt/50 hover:text-cobalt"
            >
              Explore services
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
