"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import GrainOverlay from "@/components/grain-overlay";
import { gsap } from "@/lib/gsap";

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-final]", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="final-cta"
      className="relative overflow-hidden py-28 md:py-36"
      aria-labelledby="final-cta-heading"
    >
      {/* Bookend chrome visual — smaller reprise of hero atmosphere */}
      <div className="absolute inset-0 z-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/frames/frame_0603.webp"
          alt=""
          className="h-full w-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cloud via-cloud/85 to-cloud" />
      </div>
      <GrainOverlay opacity={0.04} />

      <div className="wrap relative z-10 max-w-3xl text-center">
        <h2
          data-final
          id="final-cta-heading"
          className="font-display text-headline-sm"
        >
          Ready for a Friday report you actually trust?
        </h2>
        <p data-final className="mx-auto mt-5 max-w-xl text-body text-slate">
          Tell us where the pipeline leaks. We&apos;ll map the fixes — whether
          or not you hire us to ship them.
        </p>
        <div
          data-final
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/contact" className="btn-primary">
            Start a free growth audit
          </Link>
          <Link href="/about" className="btn-secondary">
            Meet the studio
          </Link>
        </div>
      </div>
    </section>
  );
}
