"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import GlassCard from "@/components/glass-card";
import { img } from "@/lib/images";
import { gsap } from "@/lib/gsap";

const features = [
  {
    title: "Search that compounds",
    description: "Page-one visibility for the queries your buyers actually type.",
    image: img.dashboard,
    alt: "Analytics dashboard on a laptop",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Sites built to enquire",
    description: "Fast conversion pages that answer the next useful action.",
    image: img.webdev,
    alt: "Developer working on a website build",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 14l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Spend behind demand",
    description: "Google and Meta tuned weekly to qualified leads, not clicks.",
    image: img.caseHarrier,
    alt: "Transport truck on an open highway",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function FeatureGrid() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-card]", {
        y: 36,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="features"
      className="section-pad"
      aria-labelledby="features-heading"
    >
      <div className="wrap">
        <p className="eyebrow mb-4">Capabilities</p>
        <h2
          id="features-heading"
          className="font-display text-headline-sm max-w-2xl"
        >
          Three levers. One pipeline.
        </h2>
        <p className="mt-4 max-w-xl text-body text-slate">
          Search, site, and paid media share one measurement loop — so every
          channel answers to the same Friday numbers.
        </p>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} data-card>
              <GlassCard className="group h-full overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={f.image.src}
                    alt={f.alt}
                    width={f.image.width}
                    height={f.image.height}
                    placeholder="blur"
                    blurDataURL={f.image.blurDataURL}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full glass-surface-strong text-cobalt">
                    {f.icon}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg tracking-tight text-ink">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate">{f.description}</p>
                </div>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
