"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuArrowDown,
  LuEye,
  LuHandshake,
  LuRocket,
  LuSparkles,
  LuTarget,
  LuTrendingUp,
} from "react-icons/lu";
import {
  ParallaxScrollFeatures,
  type ParallaxFeature,
} from "@/components/ui/parallax-scroll-feature-section";
import { homeImg } from "@/lib/home-images";

/* Six reasons businesses choose Digi Clicks, staged as a parallax scroll
   feature section. */
const FEATURES: ParallaxFeature[] = [
  {
    id: "strategic",
    label: "Strategic thinking",
    title: "Objectives first.",
    description:
      "Every project begins with business objectives, not assumptions — a clear strategy behind every creative and technical decision.",
    icon: LuTarget,
    tint: "#6FB8F2",
    imageSrc: homeImg.team.src,
    blurDataURL: homeImg.team.blurDataURL,
    imageAlt: "Team planning a strategic approach to a business objective",
  },
  {
    id: "creative",
    label: "Creative excellence",
    title: "Design that elevates.",
    description:
      "Modern design solutions built to elevate perception and engagement — because great design should contribute to growth, not just aesthetics.",
    icon: LuSparkles,
    tint: "#6FB8F2",
    imageSrc: homeImg.design.src,
    blurDataURL: homeImg.design.blurDataURL,
    imageAlt: "Creative design work in progress",
  },
  {
    id: "transparent",
    label: "Transparent communication",
    title: "No black box.",
    description:
      "Clear timelines, clear expectations, and complete visibility — from project milestones to reporting, at every stage.",
    icon: LuEye,
    tint: "#6FB8F2",
    imageSrc: homeImg.seo.src,
    blurDataURL: homeImg.seo.blurDataURL,
    imageAlt: "Performance dashboard reviewed together with a client",
  },
  {
    id: "results",
    label: "Results-focused execution",
    title: "Guided by outcomes.",
    description:
      "Creative decisions guided by measurable outcomes — every campaign is monitored, analyzed, and optimized to improve visibility and conversions.",
    icon: LuTrendingUp,
    tint: "#6FB8F2",
    imageSrc: homeImg.ads.src,
    blurDataURL: homeImg.ads.blurDataURL,
    imageAlt: "Campaign performance improving over time",
  },
  {
    id: "scalable",
    label: "Scalable solutions",
    title: "Built to grow.",
    description:
      "Solutions built to support growth today and expansion tomorrow — never one-size-fits-all templates.",
    icon: LuRocket,
    tint: "#6FB8F2",
    imageSrc: homeImg.web.src,
    blurDataURL: homeImg.web.blurDataURL,
    imageAlt: "Scalable website build in active development",
  },
  {
    id: "partners",
    label: "Long-term partnerships",
    title: "Partners, not vendors.",
    description:
      "Focused on helping businesses evolve and succeed over time — a growth partner, not a one-off service provider.",
    icon: LuHandshake,
    tint: "#6FB8F2",
    imageSrc: homeImg.social.src,
    blurDataURL: homeImg.social.blurDataURL,
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
          [ Why Digi Clicks? ]
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mt-6 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.4rem)] font-semibold leading-[0.95] tracking-[-0.05em] !text-white"
        >
          More than a service provider. A growth partner.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-7 max-w-md text-sm leading-relaxed text-white/55 sm:text-base"
        >
          Businesses choose Digi Clicks because they need more than design.
          They need strategic execution.
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
          We believe great digital experiences are created when strategy,
          creativity, and execution work together.
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
            Book a discovery call <span aria-hidden>→</span>
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
