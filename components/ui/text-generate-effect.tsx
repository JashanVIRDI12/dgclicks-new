"use client";

import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.06,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  staggerDelay?: number;
}) => {
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, margin: "0px 0px -12% 0px" });
  const started = useRef(false);
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : stagger(staggerDelay),
      },
    );
  }, [inView, animate, duration, filter, staggerDelay]);

  return (
    <div ref={scope} className={cn(className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="inline-block"
          style={{
            opacity: 0,
            filter: filter ? "blur(10px)" : "none",
          }}
        >
          {word}
          {idx < wordsArray.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </div>
  );
};
