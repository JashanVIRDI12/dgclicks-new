"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LINKS = [
  { label: "Work", href: "/#showcase" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

/* ————————————————————————————————————————————————————————————————
   Morphing dock nav. Airy and full-width over the hero; on scroll it
   contracts into a floating glass pill, hides when scrolling down and
   returns on scroll up. Theme-aware: a dark chrome-glass variant on
   the near-black Services route, the light variant everywhere else.
   ———————————————————————————————————————————————————————————————— */

export default function Nav() {
  const pathname = usePathname();
  const dark = pathname.startsWith("/services") || pathname.startsWith("/about");
  const navRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const activeIndex = LINKS.findIndex(
    (l) => !l.href.includes("#") && pathname === l.href,
  );
  const indicator = hovered ?? (activeIndex >= 0 ? activeIndex : null);

  useGSAP(() => {
    const hiddenRef = { v: false };

    const morph = ScrollTrigger.create({
      start: "top -64",
      end: "max",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    const dir = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const next = self.direction === 1 && self.scroll() > 260;
        if (next !== hiddenRef.v) {
          hiddenRef.v = next;
          setHidden(next);
        }
      },
    });

    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: "top top", end: "max", scrub: 0.4 },
        },
      );
    }

    if (navRef.current) {
      gsap.from(navRef.current, {
        y: -22,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2,
      });
    }

    return () => {
      morph.kill();
      dir.kill();
    };
  }, []);

  // Theme-dependent surface classes.
  const shell = dark
    ? scrolled
      ? "max-w-3xl border-white/12 bg-[#0b0b0f]/80 px-2.5 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:px-3"
      : "max-w-6xl border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur-md sm:px-4"
    : scrolled
      ? "max-w-3xl border-[rgba(15,27,45,0.1)] bg-white/80 px-2.5 py-2 shadow-[0_14px_44px_rgba(15,27,45,0.14)] backdrop-blur-xl sm:px-3"
      : "max-w-6xl border-transparent bg-white/10 px-3 py-2.5 backdrop-blur-[2px] sm:px-4";

  const brandText = dark ? "text-white" : "text-ink";
  const linkIdle = dark ? "text-white/55 hover:text-white" : "text-slate hover:text-ink";
  const linkActive = dark ? "text-white" : "text-ink";
  const indicatorBg = dark
    ? "bg-white/10 ring-1 ring-inset ring-white/10"
    : "bg-[rgba(15,27,45,0.06)]";
  const contactClass = dark
    ? "text-white/55 hover:text-white"
    : "text-slate hover:text-ink";
  const ctaClass = dark
    ? "bg-[#4D9FFF] text-[#05070c] hover:bg-[#CEDB58]"
    : "bg-ink text-white hover:bg-cobalt";
  const burgerClass = dark
    ? "border-white/15 bg-white/5"
    : "border-[rgba(15,27,45,0.12)] bg-white/60";
  const burgerLine = dark ? "bg-white" : "bg-ink";

  return (
    <>
      {/* Scroll progress */}
      <span
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
      >
        <span
          ref={barRef}
          className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-cobalt via-sky to-[#cedb58]"
        />
      </span>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
        <nav
          ref={navRef}
          aria-label="Primary"
          className={`pointer-events-auto relative mx-auto flex items-center justify-between rounded-pill border transition-[max-width,padding,background-color,box-shadow,border-color,transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${shell} ${
            hidden ? "-translate-y-[140%] opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {/* Brand */}
          <Link
            href="/"
            aria-label="DG Clicks — home"
            className="group flex shrink-0 items-center gap-2.5 rounded-pill py-1 pl-1 pr-2"
          >
            <span
              aria-hidden
              className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-cobalt to-[#4D9FFF] font-display text-[11px] font-bold tracking-tight text-white shadow-[0_4px_14px_rgba(77,159,255,0.45)] transition-transform duration-glass group-hover:scale-105"
            >
              DG
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#cedb58] opacity-70" />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full border-2 bg-[#cedb58] ${
                    dark ? "border-[#0b0b0f]" : "border-white"
                  }`}
                />
              </span>
            </span>
            <span className={`font-display text-sm font-semibold tracking-tight ${brandText}`}>
              Clicks<span className="text-[#4D9FFF]">.</span>
            </span>
          </Link>

          {/* Center links with sliding indicator */}
          <ul
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {LINKS.map((link, i) => (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  onMouseEnter={() => setHovered(i)}
                  aria-current={i === activeIndex ? "page" : undefined}
                  className={`relative z-10 inline-flex items-center rounded-pill px-4 py-2 text-sm transition-colors duration-300 ${
                    indicator === i ? linkActive : linkIdle
                  }`}
                >
                  {link.label}
                </Link>
                {indicator === i && (
                  <motion.span
                    layoutId="nav-indicator"
                    aria-hidden
                    className={`absolute inset-0 rounded-pill ${indicatorBg}`}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/contact"
              className={`hidden rounded-pill px-4 py-2 text-sm transition-colors duration-glass md:inline-flex ${contactClass}`}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className={`group hidden items-center gap-1.5 rounded-pill px-4 py-2 text-xs font-medium transition-colors duration-glass sm:inline-flex ${ctaClass}`}
            >
              Free growth audit
              <span
                aria-hidden
                className="transition-transform duration-glass group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
            <button
              type="button"
              className={`relative inline-flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-pill border md:hidden ${burgerClass}`}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                aria-hidden
                className={`block h-px w-4 transition-transform duration-glass ${burgerLine} ${
                  open ? "translate-y-[3px] rotate-45" : ""
                }`}
              />
              <span
                aria-hidden
                className={`block h-px w-4 transition-transform duration-glass ${burgerLine} ${
                  open ? "-translate-y-[3px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[55] flex flex-col bg-[#070707]/96 px-6 pb-10 pt-24 backdrop-blur-2xl md:hidden"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_10%,rgba(77,159,255,0.18),transparent_60%)]"
            />
            <ul className="relative flex flex-1 flex-col justify-center gap-1">
              {[...LINKS, { label: "Contact", href: "/contact" }].map(
                (link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      delay: 0.08 + i * 0.06,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-b border-white/10 py-4"
                    >
                      <span className="font-mono text-[11px] tracking-widest text-[#4D9FFF]">
                        0{i + 1}
                      </span>
                      <span className="font-display text-4xl font-semibold tracking-tight !text-white">
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                ),
              )}
            </ul>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5 }}
            >
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-pill bg-[#4D9FFF] px-6 py-4 text-sm font-medium text-[#05070c]"
              >
                Free growth audit <span aria-hidden>→</span>
              </Link>
              <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                Bolton, Ontario · Replies in 1 business day
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
