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
          src="/images/generated/home-team-4k.png"
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
          Ready to build something bigger?
        </h2>
        <p data-final className="mx-auto mt-5 max-w-xl text-body text-slate">
          Every successful business begins with a strong foundation. Let&apos;s
          build a digital presence that reflects the quality of your business.
        </p>
        <div
          data-final
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/contact" className="btn-primary">
            Book a discovery call
          </Link>
          <Link href="/about" className="btn-secondary">
            Meet the team
          </Link>
        </div>
      </div>
    </section>
  );
}
