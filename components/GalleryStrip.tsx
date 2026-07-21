"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { img } from "@/lib/images";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import styles from "./GalleryStrip.module.css";

type Shot = {
  image: { src: string; width: number; height: number; blurDataURL: string };
  alt: string;
  caption: string;
};

type FrameStyle = CSSProperties & { "--frame-width": string };

const rowA: Shot[] = [
  { image: img.officeTeam, alt: "Team gathered around laptops in a bright studio", caption: "Growth reviews, every Friday" },
  { image: img.workDesign, alt: "Designer laying out ad creative on a bright desk", caption: "Ad creative in progress" },
  { image: img.workspace, alt: "Active Coachlines booking journey in review", caption: "Charter enquiries, one clear route" },
  { image: img.officeRemote, alt: "Team reviewing a build over a laptop", caption: "Remote standup, cameras on" },
];

const rowB: Shot[] = [
  { image: img.workSketch, alt: "Hands sketching website wireframes on paper", caption: "Wireframes before pixels" },
  { image: img.workDesign, alt: "Indian Bistro Barrie campaign creative in production", caption: "Local discovery to menu and order" },
  { image: img.officeCollab, alt: "Two strategists working through a client plan", caption: "Two strategists, one plan" },
  { image: img.webdev, alt: "Code editor open on a MacBook in a dim studio", caption: "Ship night" },
];

const widths = ["clamp(17rem, 25vw, 28rem)", "clamp(20rem, 29vw, 32rem)", "clamp(18rem, 26vw, 29rem)", "clamp(16rem, 23vw, 26rem)"];

function Strip({
  shots,
  reverse,
  compact,
}: {
  shots: Shot[];
  reverse: boolean;
  compact?: boolean;
}) {
  return (
    <div className={`${styles.rail} ${compact ? styles.railCompact : styles.railPrimary}`}>
      <div data-strip-track data-reverse={reverse ? "true" : "false"} className={styles.track}>
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.copy} aria-hidden={copy === 1}>
            {shots.map((shot, index) => (
              <figure
                key={`${copy}-${shot.caption}`}
                className={styles.frame}
                style={{ "--frame-width": widths[index % widths.length] } as FrameStyle}
              >
                <Image
                  src={shot.image.src}
                  alt={copy === 0 ? shot.alt : ""}
                  width={shot.image.width}
                  height={shot.image.height}
                  placeholder="blur"
                  blurDataURL={shot.image.blurDataURL}
                  quality={72}
                  sizes="(min-width: 1280px) 28rem, (min-width: 640px) 36vw, 72vw"
                  className={styles.image}
                />
                <div className={styles.wash} aria-hidden="true" />
                <figcaption className={styles.caption}>
                  <span className={styles.captionIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{shot.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * DISTINCT IDEA — "the contact sheet on rollers": two counter-running proof
 * reels react to page velocity, but only while the section is on screen.
 */
export default function GalleryStrip() {
  const rootRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tracks = gsap.utils.toArray<HTMLElement>("[data-strip-track]", root);
      const loops = tracks.map((track) => {
        const reverse = track.dataset.reverse === "true";
        return gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          {
            xPercent: reverse ? 0 : -50,
            ease: "none",
            duration: 42,
            repeat: -1,
            paused: true,
          },
        );
      });

      const speed = { value: 1 };
      const applySpeed = () => loops.forEach((loop) => loop.timeScale(speed.value));
      const speedTo = gsap.quickTo(speed, "value", {
        duration: 0.18,
        ease: "power2.out",
        onUpdate: applySpeed,
      });
      let returnTween: gsap.core.Tween | null = null;
      const settle = gsap
        .delayedCall(0.22, () => {
          returnTween?.kill();
          returnTween = gsap.to(speed, {
            value: 1,
            duration: 1.1,
            ease: "power2.out",
            onUpdate: applySpeed,
          });
        })
        .pause();

      const maxShear = window.matchMedia("(max-width: 767px)").matches ? 1.2 : 3.5;
      const skewTos = tracks.map((track) =>
        gsap.quickTo(track, "skewX", { duration: 0.45, ease: "power2.out" }),
      );

      const toggleLoops = (playing: boolean) => {
        gsap.set(tracks, { willChange: playing ? "transform" : "auto" });
        loops.forEach((loop) => (playing ? loop.play() : loop.pause()));
      };

      const stopLoops = () => {
        toggleLoops(false);
        settle.pause(0);
        returnTween?.kill();
        returnTween = null;
        speed.value = 1;
        applySpeed();
        skewTos.forEach((to) => to(0));
      };

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => toggleLoops(true),
        onEnterBack: () => toggleLoops(true),
        onLeave: stopLoops,
        onLeaveBack: stopLoops,
        onUpdate: (self) => {
          if (!self.isActive) return;
          const velocity = self.getVelocity();
          speedTo(gsap.utils.clamp(0.75, 4.2, 1 + Math.abs(velocity) / 1100));
          settle.restart(true);
          const shear = gsap.utils.clamp(-maxShear, maxShear, velocity / 320);
          skewTos.forEach((to, index) => to(index % 2 ? -shear : shear));
        },
      });

      if (trigger.isActive) toggleLoops(true);

      return () => {
        trigger.kill();
        settle.kill();
        returnTween?.kill();
        (speedTo as typeof speedTo & { tween?: gsap.core.Tween }).tween?.kill();
        skewTos.forEach((to) =>
          (to as typeof to & { tween?: gsap.core.Tween }).tween?.kill(),
        );
        loops.forEach((loop) => loop.kill());
        gsap.set(tracks, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="proof-reel-title" className={styles.section}>
      <div className={`wrap ${styles.intro}`}>
        <div>
          <h2 id="proof-reel-title" className={styles.title}>
            The work between the wins.
          </h2>
        </div>
        <p className={styles.copyText}>
          Reviews, rebuilds, ad iterations and handoffs — the unglamorous weekly work that turns a result into a repeatable system.
        </p>
      </div>

      <div className={styles.reels}>
        <Strip shots={rowA} reverse={false} />
        <Strip shots={rowB} reverse compact />
      </div>
    </section>
  );
}
