"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuArrowDown,
  LuEye,
  LuGauge,
  LuHandshake,
  LuRocket,
  LuTarget,
  LuTrendingUp,
} from "react-icons/lu";
import {
  ParallaxScrollFeatures,
  type ParallaxFeature,
} from "@/components/ui/parallax-scroll-feature-section";
import { img } from "@/lib/images";

/* Six beliefs, staged as a parallax scroll feature section. */
const FEATURES: ParallaxFeature[] = [
  {
    id: "revenue",
    label: "Revenue-first thinking",
    title: "Revenue first.",
    description:
      "Every idea is ranked by expected revenue impact — never by what is fashionable to build. If it cannot move a number, it does not make the roadmap.",
    proof: "5.2×",
    proofLabel: "blended ROAS",
    icon: LuTrendingUp,
    tint: "#6FB8F2",
    imageSrc: img.dashboard.src,
    blurDataURL: img.dashboard.blurDataURL,
    imageAlt: "Performance dashboard measuring commercial outcomes",
  },
  {
    id: "ship",
    label: "Fast execution",
    title: "Ship weekly.",
    description:
      "Campaigns, pages, and fixes go live in weekly sprints, measured against a week-one baseline — not parked in a quarterly backlog.",
    proof: "7 days",
    proofLabel: "decision to deployed",
    icon: LuRocket,
    tint: "#6FB8F2",
    imageSrc: img.workCode.src,
    blurDataURL: img.workCode.blurDataURL,
    imageAlt: "Developer shipping measured website improvements",
  },
  {
    id: "visible",
    label: "Transparent reporting",
    title: "No black box.",
    description:
      "The Friday report says what moved, why it moved, and exactly what happens next week. Numbers you can argue with, every week.",
    proof: "52",
    proofLabel: "plain-English reports a year",
    icon: LuEye,
    tint: "#6FB8F2",
    imageSrc: img.officeWorkshop.src,
    blurDataURL: img.officeWorkshop.blurDataURL,
    imageAlt: "Team reviewing a clear performance report together",
  },
  {
    id: "speed",
    label: "Technical excellence",
    title: "Fast sites win.",
    description:
      "Conversion-first builds stay quick on real devices and pass Core Web Vitals, because speed is part of the sales journey.",
    proof: "0.8s",
    proofLabel: "median load on shipped builds",
    icon: LuGauge,
    tint: "#6FB8F2",
    imageSrc: img.webdev.src,
    blurDataURL: img.webdev.blurDataURL,
    imageAlt: "Fast responsive website under active development",
  },
  {
    id: "proof",
    label: "Performance marketing",
    title: "Spend follows proof.",
    description:
      "Budget moves toward qualified demand every week. Losing campaigns are retired without ceremony; the ad account is a portfolio.",
    proof: "−41%",
    proofLabel: "cost per lead, Harrier Transport",
    icon: LuTarget,
    tint: "#6FB8F2",
    imageSrc: img.caseHarrier.src,
    blurDataURL: img.caseHarrier.blurDataURL,
    imageAlt: "Campaign associated with a lower cost per lead",
  },
  {
    id: "partners",
    label: "Long-term partnerships",
    title: "Partners, not vendors.",
    description:
      "No lock-in theatre. Clients stay because the weekly operating loop keeps finding useful upside — year after year.",
    proof: "93%",
    proofLabel: "stay past year one",
    icon: LuHandshake,
    tint: "#6FB8F2",
    imageSrc: img.officeTeam.src,
    blurDataURL: img.officeTeam.blurDataURL,
    imageAlt: "Team working as a long-term growth partner",
  },
];

export default function WhyBrands() {
  return (
    <section
      id="why-us"
      aria-label="Why companies choose us"
      className="relative overflow-hidden bg-[#070d16] text-white"
    >
      {/* Ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 12%, rgba(42,95,217,0.14), transparent 42%), radial-gradient(circle at 85% 88%, rgba(111,184,242,0.10), transparent 46%)",
        }}
      />

      {/* Intro screen */}
      <div className="relative flex min-h-[68vh] flex-col items-center justify-center px-6 pt-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky/80"
        >
          [ Why companies choose us ]
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.05em] !text-white"
        >
          Six reasons the work compounds.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-7 max-w-md text-sm leading-relaxed text-white/55 sm:text-base"
        >
          Not values on a poster — the operating rules you will see in the first
          Friday report.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45"
        >
          Scroll
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <LuArrowDown className="h-3.5 w-3.5" aria-hidden />
          </motion.span>
        </motion.p>
      </div>

      {/* Feature rows */}
      <div className="wrap relative">
        <ParallaxScrollFeatures features={FEATURES} />
      </div>

      {/* Outro / CTA */}
      <div className="relative flex min-h-[56vh] flex-col items-center justify-center px-6 pb-24 pt-12 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1] tracking-[-0.04em] !text-white"
        >
          Every channel answers to the same Friday question.
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-pill bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-glass hover:bg-sky"
          >
            Book a growth audit <span aria-hidden>→</span>
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-pill border border-white/20 px-7 py-3.5 text-sm font-medium text-white transition-colors duration-glass hover:border-sky/50 hover:text-sky"
          >
            Explore services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
