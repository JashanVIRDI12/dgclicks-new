"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type PointerEvent, useRef } from "react";
import styles from "./ServicesUi.module.css";

type BlueprintMagneticButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

export default function BlueprintMagneticButton({
  children,
  href,
  variant = "primary",
}: BlueprintMagneticButtonProps) {
  const boundaryRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 240, damping: 22, mass: 0.55 });
  const y = useSpring(rawY, { stiffness: 240, damping: 22, mass: 0.55 });

  const handleMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const bounds = boundaryRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const relativeX = event.clientX - (bounds.left + bounds.width / 2);
    const relativeY = event.clientY - (bounds.top + bounds.height / 2);
    rawX.set(relativeX * 0.18);
    rawY.set(relativeY * 0.22);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <span
      ref={boundaryRef}
      className={styles.magneticBoundary}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      <motion.a
        href={href}
        className={
          variant === "primary" ? styles.primaryCta : styles.secondaryCta
        }
        style={{ x, y }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      >
        <span>{children}</span>
        <span aria-hidden="true">↗</span>
      </motion.a>
    </span>
  );
}
