"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { CATEGORIES, SHOWCASE, type ServiceCategory } from "./showcase-data";

/* ————————————————————————————————————————————————————————————————
   THE INDEX — every discipline as one editorial list. Hovering a row
   dims the rest and floats a preview render that tracks the cursor
   (the Locomotive / Active Theory list-reveal). Category chips filter
   the list. Touch + reduced-motion degrade to a plain, legible list.
   ———————————————————————————————————————————————————————————————— */

export default function ServicesIndex() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<ServiceCategory | "All">("All");

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 170, damping: 22, mass: 0.6 });
  const y = useSpring(py, { stiffness: 170, damping: 22, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    px.set(e.clientX - bounds.left);
    py.set(e.clientY - bounds.top);
  };

  useGSAP(
    () => {
      if (prefersReducedMotion() || !headingRef.current) return;
      const split = new SplitText(headingRef.current, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
      });
      gsap.from("[data-index-row]", {
        yPercent: 40,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: { trigger: listRef.current, start: "top 80%" },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  const activeService = SHOWCASE.find((s) => s.id === active);
  const visible = (s: (typeof SHOWCASE)[number]) => filter === "All" || s.category === filter;

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      aria-label="Full service index"
      className="relative border-t border-white/8 bg-[#070707] py-24 md:py-32"
    >
      {/* floating cursor preview */}
      {!reducedMotion && (
        <motion.div
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
        >
          <motion.div
            animate={{ opacity: activeService ? 1 : 0, scale: activeService ? 1 : 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative -ml-[10rem] -mt-[7rem] h-[14rem] w-[20rem] overflow-hidden rounded-xl border border-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            {activeService && (
              <Image
                key={activeService.id}
                src={activeService.image}
                alt=""
                fill
                sizes="320px"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span
              className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full"
              style={{ background: activeService?.accent }}
            />
          </motion.div>
        </motion.div>
      )}

      <div className="wrap relative z-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              [ Full index — 20 disciplines ]
            </p>
            <h2
              ref={headingRef}
              className="mt-4 max-w-[14ch] font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white"
            >
              Everything under one roof.
            </h2>
          </div>

          {/* category filter */}
          <div className="flex flex-wrap gap-2">
            {(["All", ...CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  filter === cat
                    ? "border-white/70 bg-white text-[#070707]"
                    : "border-white/12 text-white/50 hover:border-white/30 hover:text-white/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <ul
          ref={listRef}
          className="mt-12"
          onMouseLeave={() => setActive(null)}
        >
          {SHOWCASE.map((s) => {
            const dim = active && active !== s.id;
            const hidden = !visible(s);
            return (
              <li
                key={s.id}
                data-index-row
                className="transition-[opacity,max-height,margin,padding] duration-500"
                style={{
                  opacity: hidden ? 0.12 : dim ? 0.32 : 1,
                  pointerEvents: hidden ? "none" : "auto",
                }}
                onMouseEnter={() => !hidden && setActive(s.id)}
              >
                <Link
                  href="/contact"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/10 py-5 sm:gap-8 sm:py-6"
                >
                  <span className="font-mono text-[11px] tabular-nums tracking-widest text-white/35">
                    {s.num}
                  </span>

                  <span className="flex items-baseline gap-4 overflow-hidden">
                    <span
                      className="inline-block h-2 w-2 shrink-0 translate-y-[-0.15em] rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                      style={{ background: s.accent }}
                    />
                    <span
                      className="font-display text-[clamp(1.5rem,3.6vw,3rem)] font-semibold leading-none tracking-[-0.03em] text-white/85 transition-[transform,color] duration-300 will-change-transform group-hover:translate-x-2 group-hover:[color:var(--hue)]"
                      style={{ ["--hue" as string]: s.accent }}
                    >
                      {s.name}
                    </span>
                  </span>

                  <span className="flex items-center gap-4 sm:gap-8">
                    <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-white/35 sm:inline">
                      {s.category}
                    </span>
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/12 text-white/50 transition-all duration-300 group-hover:border-transparent group-hover:text-[#070707] group-hover:[background-color:var(--bg)]"
                      style={{ ["--bg" as string]: s.accent }}
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
