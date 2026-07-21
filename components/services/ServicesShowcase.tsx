"use client";

import Image from "next/image";
import Link from "next/link";
import { type PointerEvent, useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { FEATURED, SHOWCASE, type ShowcaseService } from "./showcase-data";
import { FeaturedViz } from "./ShowcaseVisuals";
import ServicesIndex from "./ServicesIndex";

/* ————————————————————————————————————————————————————————————————
   SERVICES SHOWCASE — an editorial exhibition, not a card grid.
   A kinetic masthead, five asymmetric featured spreads (each a unique
   composition with a floating instrument panel), then the full index.
   ———————————————————————————————————————————————————————————————— */

export default function ServicesShowcase() {
  return (
    <div className="bg-[#070707] text-white">
      <Masthead />
      <div className="wrap flex flex-col gap-28 py-20 md:gap-40 md:py-28">
        {FEATURED.map((service, i) => (
          <FeaturedSpread key={service.id} service={service} order={i} />
        ))}
      </div>
      <ServicesIndex />
      <Closing />
    </div>
  );
}

/* ————————————————————————————————————— Masthead ————————————————————————————————————— */
function Masthead() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      if (headlineRef.current) {
        // gsap.from records the natural (visible) end state, so a killed or
        // reverted tween always restores to visible — never strands hidden.
        const split = new SplitText(headlineRef.current, {
          type: "words,lines",
          linesClass: "block overflow-hidden",
        });
        gsap
          .timeline({ delay: 0.15 })
          .from(split.words, {
            yPercent: 110,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.06,
          })
          .from(
            "[data-mast-fade]",
            { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
            "-=0.7",
          );
      }

      // infinite marquee
      const track = marqueeRef.current;
      if (track) {
        const loop = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 75,
          repeat: -1,
        });
        return () => loop.kill();
      }
    },
    { scope: ref },
  );

  const names = SHOWCASE.map((s) => s.name);

  return (
    <section
      ref={ref}
      id="services-showcase"
      aria-label="Services"
      className="relative isolate overflow-hidden pt-28 md:pt-36"
    >
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_12%_-5%,rgba(77,159,255,0.26),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_25%,rgba(206,219,88,0.1),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_60%_100%,rgba(155,140,255,0.08),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      </div>

      <div className="wrap relative z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p
              data-mast-fade
              className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45"
            >
              <span className="h-px w-8 bg-white/30" />
              Digi Clicks — Capability index
            </p>
            <h1
              ref={headlineRef}
              className="mt-6 max-w-[11ch] font-display text-[clamp(2.6rem,6.4vw,5.6rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-white"
            >
              Everything a brand needs to{" "}
              <span className="italic text-[#4D9FFF]">grow.</span>
            </h1>
          </div>

          <div data-mast-fade className="lg:pb-3">
            <p className="max-w-sm text-base leading-relaxed text-white/60">
              Twenty connected disciplines, one accountable team. Design,
              build, brand, marketing, and AI — measured against real
              business impact, never surface-level activity.
            </p>
            <div className="mt-7 flex items-center gap-5">
              <Link href="/contact" className="btn-primary">
                Book a discovery call
              </Link>
              <span className="font-mono text-[42px] font-semibold leading-none tracking-tight text-white/10">
                20
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* kinetic marquee */}
      <div className="relative mt-16 overflow-hidden border-y border-white/8 py-5 md:mt-24">
        <div ref={marqueeRef} className="flex w-max whitespace-nowrap will-change-transform">
          {[...names, ...names].map((name, i) => (
            <span
              key={i}
              className="flex items-center font-display text-2xl font-medium uppercase tracking-tight text-white md:text-4xl"
            >
              {name}
              <span className="mx-6 text-[#CEDB58] md:mx-9">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ————————————————————————————————————— Featured spread ————————————————————————————————————— */
function FeaturedSpread({ service, order }: { service: ShowcaseService; order: number }) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const flip = order % 2 === 1;
  const wide = order === 2; // Paid Ads gets the wide banner treatment

  // tilt
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === "touch") return;
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 8);
    rx.set(((e.clientY - b.top) / b.height - 0.5) * -8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(ref);
      const inView = { trigger: ref.current, start: "top 78%" } as const;

      // media reveal via clip — gsap.from restores to the visible natural
      // state on revert, so media can never strand hidden.
      gsap.from(q("[data-media]"), {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: inView,
      });
      gsap.from(q("[data-media-img]"), {
        scale: 1.25,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: inView,
      });
      // parallax image on scroll
      gsap.fromTo(
        q("[data-media-img]"),
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      // text
      const title = q<HTMLElement>("[data-spread-title]")[0];
      if (title) {
        const split = new SplitText(title, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: inView,
        });
      }
      gsap.from(q("[data-spread-fade]"), {
        y: 26,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 72%" },
      });
      gsap.from(q("[data-spread-num]"), {
        yPercent: 30,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: inView,
      });

      // instrument-panel animations
      const vizTl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 60%" } });
      vizTl
        .from(q("[data-media] .viz-bar"), { scaleY: 0, transformOrigin: "bottom", duration: 0.7, stagger: 0.05, ease: "power2.out" }, 0)
        .from(q("[data-media] .viz-cell"), { autoAlpha: 0, scale: 0.4, duration: 0.5, stagger: 0.008, ease: "power1.out" }, 0)
        .from(q("[data-media] .viz-swatch"), { scaleX: 0, transformOrigin: "left", duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0)
        .from(q("[data-media] .viz-node, [data-media] .viz-mark, [data-media] .viz-specimen"), { scale: 0.6, autoAlpha: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)" }, 0.1);

      q<SVGPathElement>("[data-media] .viz-line, [data-media] .viz-wire").forEach((path) => {
        gsap.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, ease: "power2.inOut", scrollTrigger: { trigger: ref.current, start: "top 60%" } });
      });

      // count-ups
      q<HTMLElement>("[data-media] .viz-count").forEach((el) => {
        const to = parseFloat(el.dataset.to || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 60%" },
          onUpdate: () => {
            el.textContent = (decimals ? obj.v / Math.pow(10, decimals) : obj.v).toFixed(decimals);
          },
        });
      });
    },
    { scope: ref, dependencies: [] },
  );

  return (
    <article
      ref={ref}
      id={`service-${service.id}`}
      className="relative scroll-mt-28"
      style={{ ["--accent" as string]: service.accent }}
    >
      {/* oversized ghost index — faintly tinted with the channel accent */}
      <span
        data-spread-num
        aria-hidden
        className={`pointer-events-none absolute -top-14 z-0 select-none font-display text-[26vw] font-bold leading-none md:text-[16vw] ${
          flip ? "right-0" : "left-0"
        }`}
        style={{ color: service.accent, opacity: 0.07 }}
      >
        {service.num}
      </span>

      <div
        className={`relative z-10 grid items-center gap-8 md:gap-14 ${
          wide
            ? "lg:grid-cols-[0.85fr_1.15fr]"
            : "lg:grid-cols-2"
        }`}
      >
        {/* TEXT */}
        <div className={`${flip ? "lg:order-2" : ""} ${wide ? "" : ""}`}>
          <div data-spread-fade className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: service.accent }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
              {service.num} — {service.category}
            </span>
          </div>
          <h2
            data-spread-title
            className="mt-5 max-w-[16ch] font-display text-[clamp(2.1rem,4.6vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white"
          >
            {service.name}
          </h2>
          <p data-spread-fade className="mt-5 max-w-md text-lg leading-snug text-white/70">
            {service.blurb}
          </p>
          {service.copy && (
            <p data-spread-fade className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
              {service.copy}
            </p>
          )}
          <div data-spread-fade className="mt-8">
            <MagneticCta
              href={service.id === "ai-automation" ? "/ai" : "/contact"}
              accent={service.accent}
            >
              {service.cta}
            </MagneticCta>
          </div>
        </div>

        {/* MEDIA */}
        <motion.div
          className={`${flip ? "lg:order-1" : ""} relative`}
          onPointerMove={onMove}
          onPointerLeave={reset}
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
        >
          {/* ambient accent glow behind the panel */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] opacity-45 blur-3xl"
            style={{
              background: `radial-gradient(55% 55% at ${flip ? "75%" : "25%"} 60%, ${service.accent}66, transparent 72%)`,
            }}
          />
          <div
            data-media
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10"
          >
            {/* accent rim */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30 rounded-2xl"
              style={{ boxShadow: `inset 0 0 0 1px ${service.accent}26` }}
            />
            <div data-media-img className="absolute inset-0 will-change-transform">
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 1023px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: `radial-gradient(60% 60% at 50% 20%, ${service.accent}22, transparent 70%)` }}
            />

            {/* floating instrument panel overlapping the image */}
            <div
              className={`absolute z-20 w-[68%] max-w-[22rem] ${
                flip ? "bottom-5 right-5" : "bottom-5 left-5"
              }`}
            >
              <FeaturedViz kind={service.featured!} accent={service.accent} />
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
}

/* ————————————————————————————————————— Magnetic CTA ————————————————————————————————————— */
function MagneticCta({
  children,
  href,
  accent,
}: {
  children: React.ReactNode;
  href: string;
  accent: string;
}) {
  const reducedMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 240, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 240, damping: 18, mass: 0.5 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reducedMotion || e.pointerType === "touch") return;
    const b = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (b.left + b.width / 2)) * 0.3);
    my.set((e.clientY - (b.top + b.height / 2)) * 0.4);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y, ["--h" as string]: accent }}
      className="group inline-flex items-center gap-3 rounded-full border border-white/15 py-3 pl-6 pr-3 text-sm font-medium text-white transition-colors duration-300 hover:border-transparent hover:[background-color:var(--h)]"
    >
      <span className="transition-colors group-hover:text-[#070707]">{children}</span>
      <span
        className="grid h-8 w-8 place-items-center rounded-full text-[#070707] transition-transform duration-300 group-hover:translate-x-0.5"
        style={{ background: accent }}
      >
        →
      </span>
    </motion.a>
  );
}

/* ————————————————————————————————————— Closing ————————————————————————————————————— */
function Closing() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const h = ref.current.querySelector("h2");
      if (!h) return;
      const split = new SplitText(h, { type: "words", mask: "words" });
      gsap.from(split.words, {
        yPercent: 120,
        duration: 0.9,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });
    },
    { scope: ref },
  );
  return (
    <section ref={ref} className="border-t border-white/8 bg-[#070707] py-24 md:py-32">
      <div className="wrap text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#CEDB58]">
          Ready to build something bigger?
        </p>
        <h2 className="mx-auto mt-6 max-w-[18ch] font-display text-[clamp(2rem,5vw,4.2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
          Pick the services. We'll bring them together under one team.
        </h2>
        <div className="mt-10 flex justify-center">
          <Link href="/contact" className="btn-primary">
            Book a discovery call
          </Link>
        </div>
      </div>
    </section>
  );
}
