"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { clientLogos } from "@/lib/data";
import { gsap } from "@/lib/gsap";

export default function PartnerLogos() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-logo]", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="partners"
      className="border-y border-[var(--glass-border)] py-16 md:py-20"
      aria-labelledby="partners-heading"
    >
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Operators we ship with</p>
            <h2
              id="partners-heading"
              className="max-w-xl font-display text-headline-sm"
            >
              Freight, hospitality, and local service brands.
            </h2>
          </div>
          <p
            aria-hidden
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate/60"
          >
            [ Active retainers ]
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {clientLogos.map((logo) => (
            <li key={logo.name} data-logo>
              <div
                className={`group flex h-28 items-center justify-center rounded-glass border p-5 transition-all duration-glass hover:-translate-y-0.5 hover:shadow-glass md:h-32 ${
                  logo.dark
                    ? "border-white/10 bg-deep hover:border-sky/40"
                    : "border-[rgba(15,27,45,0.08)] bg-white/70 hover:border-[rgba(42,95,217,0.3)]"
                }`}
                title={logo.name}
              >
                <Image
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  width={220}
                  height={90}
                  className="max-h-16 w-auto max-w-full object-contain opacity-80 transition-all duration-glass group-hover:scale-[1.04] group-hover:opacity-100 md:max-h-[4.5rem]"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
