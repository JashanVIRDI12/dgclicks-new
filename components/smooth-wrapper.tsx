"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import {
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/gsap";

registerGsap();

export default function SmoothWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: 1,
      effects: false,
      ignoreMobileResize: true,
    });

    const onRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", onRefresh);

    return () => {
      window.removeEventListener("load", onRefresh);
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
