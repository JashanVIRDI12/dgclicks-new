"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

/* ————————————————————————————————————————————————————————————————
   PARALLAX SCROLL FEATURE SECTION
   Adapted from 21st.dev/@sumonadotwork. Each feature owns a screen;
   the image reveals with a left-to-right clip-path wipe while the
   copy drifts on scroll. Hooks are isolated per row (FeatureRow) so
   they never run inside a loop. Reduced motion → static, fully shown.
   ———————————————————————————————————————————————————————————————— */

export type ParallaxFeature = {
  id: string;
  label?: string;
  title: string;
  description: string;
  proof?: string;
  proofLabel?: string;
  imageSrc: string;
  imageAlt: string;
  blurDataURL?: string;
  icon?: IconType;
  tint?: string;
  /** Force layout side; defaults to alternating by index. */
  reverse?: boolean;
};

function FeatureRow({
  feature,
  index,
}: {
  feature: ParallaxFeature;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.55],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const textY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  const Icon = feature.icon;
  const tint = feature.tint ?? "#6FB8F2";
  const reverse = feature.reverse ?? index % 2 === 1;

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[74vh] flex-col items-center justify-center gap-9 py-8 md:min-h-[80vh] md:gap-14 lg:gap-20",
        reverse ? "md:flex-row-reverse" : "md:flex-row",
      )}
    >
      {/* Copy */}
      <motion.div
        style={reduced ? undefined : { y: textY }}
        className="w-full max-w-md"
      >
        {feature.label && (
          <p
            className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.26em]"
            style={{ color: tint }}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
            {String(index + 1).padStart(2, "0")} — {feature.label}
          </p>
        )}
        <h3 className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.04em] !text-white">
          {feature.title}
        </h3>
        <p className="mt-6 max-w-sm text-base leading-relaxed text-white/65">
          {feature.description}
        </p>
        {feature.proof && (
          <div className="mt-8 flex items-end gap-3 border-t border-white/12 pt-6">
            <span
              className="font-display text-4xl font-semibold leading-none tracking-tight"
              style={{ color: tint }}
            >
              {feature.proof}
            </span>
            {feature.proofLabel && (
              <span className="pb-1 font-mono text-[9px] uppercase leading-snug tracking-[0.16em] text-white/55">
                {feature.proofLabel}
              </span>
            )}
          </div>
        )}
      </motion.div>

      {/* Image — clip-path wipe reveal */}
      <motion.div
        style={reduced ? undefined : { opacity, clipPath }}
        className="relative aspect-[4/5] w-full max-w-[22rem] overflow-hidden rounded-2xl border border-white/12 shadow-[0_40px_90px_rgba(0,0,0,0.45)] md:max-w-[24rem]"
      >
        <motion.div
          style={reduced ? undefined : { scale: imageScale }}
          className="absolute inset-0"
        >
          <Image
            src={feature.imageSrc}
            alt={feature.imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, 384px"
            placeholder={feature.blurDataURL ? "blur" : "empty"}
            blurDataURL={feature.blurDataURL}
            className="object-cover"
          />
        </motion.div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(205deg, transparent 52%, ${tint}33 100%)`,
          }}
        />
      </motion.div>
    </div>
  );
}

export function ParallaxScrollFeatures({
  features,
  className,
}: {
  features: ParallaxFeature[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col px-6 md:px-0", className)}>
      {features.map((feature, index) => (
        <FeatureRow key={feature.id} feature={feature} index={index} />
      ))}
    </div>
  );
}
