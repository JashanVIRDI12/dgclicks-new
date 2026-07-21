"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type ZoomParallaxImage = {
  src: string;
  alt: string;
  blurDataURL?: string;
};

type ZoomParallaxProps = {
  images: ZoomParallaxImage[];
  className?: string;
};

/**
 * Each frame: how far it zooms, its resting size, and its offset from the
 * viewport centre. The centre frame (index 0) sits dead-centre and grows to
 * fill the screen; the rest fan outward as everything scales. Values follow
 * the canonical zoom-parallax layout (21st.dev / Olivier Larose).
 */
const FRAMES = [
  { scale: 4.0, w: "26vw", h: "26vh", top: "0vh", left: "0vw" },
  { scale: 5.0, w: "34vw", h: "28vh", top: "-30vh", left: "5vw" },
  { scale: 6.0, w: "20vw", h: "42vh", top: "-8vh", left: "-25vw" },
  { scale: 5.0, w: "24vw", h: "24vh", top: "0vh", left: "27.5vw" },
  { scale: 6.0, w: "20vw", h: "24vh", top: "27.5vh", left: "5vw" },
  { scale: 8.0, w: "28vw", h: "24vh", top: "27.5vh", left: "-22.5vw" },
  { scale: 9.0, w: "15vw", h: "15vh", top: "22.5vh", left: "25vw" },
] as const;

/**
 * Zoom-parallax scene. Pins with ScrollTrigger (NOT CSS position:sticky) so it
 * stays glitch-free under the site's ScrollSmoother, then scrubs each frame's
 * scale across the pinned distance.
 */
export function ZoomParallax({ images, className }: ZoomParallaxProps) {
  const pin = useRef<HTMLDivElement>(null);
  const items = images.slice(0, FRAMES.length);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const pinEl = pin.current;
      if (!pinEl) return;

      const layers = gsap.utils.toArray<HTMLElement>(
        "[data-zoom-layer]",
        pinEl,
      );
      gsap.set(layers, { transformOrigin: "center center", force3D: true });

      // Pin the trigger element itself (pin: true) — the pattern that holds
      // reliably under ScrollSmoother. It locks, scrubs the zoom, then
      // releases into the next section.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      layers.forEach((layer) => {
        tl.fromTo(
          layer,
          { scale: 1 },
          { scale: Number(layer.dataset.zoomScale ?? 4), ease: "none" },
          0,
        );
      });

      // A hairline caption fades as the zoom takes over.
      tl.to(
        "[data-zoom-hint]",
        { autoAlpha: 0, ease: "power1.in", duration: 0.2 },
        0,
      );
    },
    { scope: pin },
  );

  return (
    <div
      ref={pin}
      className={cn("relative h-screen overflow-hidden", className)}
    >
        {items.map((image, i) => {
          const f = FRAMES[i] ?? FRAMES[0];
          return (
            <div
              key={`${image.src}-${i}`}
              data-zoom-layer
              data-zoom-scale={f.scale}
              className="absolute inset-0 flex items-center justify-center will-change-transform"
            >
              <div
                className="relative overflow-hidden rounded-xl border border-ink/[0.07] bg-[#e4e9f1] shadow-[0_28px_64px_rgba(15,27,45,0.18)]"
                style={{
                  width: f.w,
                  height: f.h,
                  top: f.top,
                  left: f.left,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 72vw, 40vw"
                  quality={78}
                  placeholder={image.blurDataURL ? "blur" : "empty"}
                  blurDataURL={image.blurDataURL}
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </div>
          );
        })}

        <p
          data-zoom-hint
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink/45"
        >
          Scroll to zoom
        </p>
    </div>
  );
}
