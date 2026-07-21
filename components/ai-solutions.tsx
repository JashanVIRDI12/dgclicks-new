"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LuArrowDown,
  LuDatabase,
  LuPenTool,
  LuRocket,
  LuSparkles,
  LuWorkflow,
} from "react-icons/lu";
import {
  ParallaxScrollFeatures,
  type ParallaxFeature,
} from "@/components/ui/parallax-scroll-feature-section";
import { homeImg } from "@/lib/home-images";

const CAPABILITIES: ParallaxFeature[] = [
  {
    id: "strategy",
    label: "AI Strategy & Consultation",
    title: "Find the real opportunities.",
    description:
      "We identify practical AI opportunities tailored to your business goals — not hype, not gimmicks. Just the places automation and intelligence actually move the needle.",
    icon: LuSparkles,
    tint: "#6FB8F2",
    imageSrc: homeImg.team.src,
    blurDataURL: homeImg.team.blurDataURL,
    imageAlt: "Team mapping practical AI opportunities for a business",
  },
  {
    id: "workflows",
    label: "Custom AI Workflows",
    title: "Automate the repeatable.",
    description:
      "We build custom AI workflows that automate repetitive tasks — freeing your team to focus on the judgement calls only people can make.",
    icon: LuWorkflow,
    tint: "#6FB8F2",
    imageSrc: homeImg.web.src,
    blurDataURL: homeImg.web.blurDataURL,
    imageAlt: "Automated workflow connecting business systems",
  },
  {
    id: "knowledge",
    label: "Business Knowledge AI",
    title: "AI that knows your business.",
    description:
      "We train AI assistants on your products, services, and internal documentation to deliver accurate, context-aware responses — not generic answers.",
    icon: LuDatabase,
    tint: "#6FB8F2",
    imageSrc: homeImg.seo.src,
    blurDataURL: homeImg.seo.blurDataURL,
    imageAlt: "AI assistant trained on business knowledge and documentation",
  },
  {
    id: "content",
    label: "AI Content & Marketing",
    title: "Move faster on content.",
    description:
      "AI-powered tools accelerate content creation, campaign planning, and marketing workflows — so ideas ship in days, not weeks.",
    icon: LuPenTool,
    tint: "#6FB8F2",
    imageSrc: homeImg.social.src,
    blurDataURL: homeImg.social.blurDataURL,
    imageAlt: "AI-accelerated content and campaign planning",
  },
  {
    id: "future",
    label: "Future-Ready Integrations",
    title: "Built to keep up.",
    description:
      "As new AI technologies emerge, we continuously explore and implement the ones that create real, long-term business value — so your stack never falls behind.",
    icon: LuRocket,
    tint: "#6FB8F2",
    imageSrc: homeImg.ads.src,
    blurDataURL: homeImg.ads.blurDataURL,
    imageAlt: "Business technology stack ready for future AI integrations",
  },
];

export default function AISolutions() {
  return (
    <section
      id="ai-solutions"
      aria-label="AI-Powered Solutions"
      className="relative overflow-hidden bg-[#070d16] text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 10%, rgba(42,95,217,0.16), transparent 42%), radial-gradient(circle at 85% 85%, rgba(111,184,242,0.1), transparent 46%)",
        }}
      />

      {/* Intro screen */}
      <div className="relative flex min-h-[72vh] flex-col items-center justify-center px-6 pt-32 text-center md:pt-40">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky/80"
        >
          [ AI-Powered Solutions ]
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6.4vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.05em] !text-white"
        >
          Helping businesses work smarter with AI.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-7 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base"
        >
          Artificial intelligence is changing how businesses operate, market, and
          grow. We help businesses embrace AI by integrating intelligent
          solutions that automate processes, improve customer experiences, and
          support smarter decision-making.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.32 }}
          className="mt-9"
        >
          <Link href="/contact" className="btn-primary">
            Talk to us about AI
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-14 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45"
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

      {/* Capabilities */}
      <div className="wrap relative">
        <ParallaxScrollFeatures features={CAPABILITIES} />
      </div>

      {/* Outro / CTA */}
      <div className="relative flex min-h-[56vh] flex-col items-center justify-center px-6 pb-24 pt-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1] tracking-[-0.04em] !text-white"
        >
          Ready to put AI to work in your business?
        </motion.h2>
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
            Explore all services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
