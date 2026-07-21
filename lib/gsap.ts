"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useEffect, useLayoutEffect } from "react";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    Draggable,
    InertiaPlugin,
    Observer,
    DrawSVGPlugin,
    MotionPathPlugin,
    ScrambleTextPlugin,
  );
  registered = true;
}

registerGsap();

/** useLayoutEffect on the client, useEffect during SSR (avoids React warning). */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isTouchDevice() {
  return (
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );
}

export function scrollToSection(selector: string, offset = -96) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const smoother = ScrollSmoother.get();
  if (smoother && !prefersReducedMotion()) {
    smoother.scrollTo(el, true, `top+=${offset}`);
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }
}

export {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  Draggable,
  InertiaPlugin,
  Observer,
  DrawSVGPlugin,
  MotionPathPlugin,
  ScrambleTextPlugin,
};
