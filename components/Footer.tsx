"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";
import { gsap, scrollToSection, useIsoLayoutEffect } from "@/lib/gsap";

function OfficeTime({ tz }: { tz: string }) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const format = () =>
      setTime(
        new Intl.DateTimeFormat("en", {
          timeZone: tz,
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    format();
    const id = window.setInterval(format, 60_000);
    return () => window.clearInterval(id);
  }, [tz]);
  return <span className="font-mono tabular-nums">{time}</span>;
}

/**
 * DISTINCT IDEA — "sign the wall": the site signs off with its name in
 * outline letters the size of the viewport; run the cursor across them and
 * each letter fills lime, like wet paint the visitor gets to touch. The
 * section opens on the brand swatch's diagonal seam.
 */
export default function Footer() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rise = gsap.fromTo(
        markRef.current,
        { yPercent: 38 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
      return () => {
        rise.scrollTrigger?.kill();
        rise.kill();
        gsap.set(markRef.current, { clearProps: "all" });
      };
    });
    return () => mm.revert();
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null;
    if (pathname === "/" && hash && document.querySelector(hash)) {
      e.preventDefault();
      scrollToSection(hash);
    }
  };

  return (
    <footer ref={rootRef} className="relative">
      {/* Diagonal seam into the sign-off wall */}
      <div aria-hidden="true" className="relative h-[7vw] w-full bg-night">
        <div className="absolute inset-0 bg-mint" style={{ clipPath: "polygon(0 0, 100% 0, 100% 16%, 0 100%)" }} />
      </div>

      <div className="overflow-hidden bg-night pt-14 text-white">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
            <p className="max-w-xl font-display text-[clamp(1.8rem,4vw,3.2rem)] font-semibold leading-[1.02]">
              Revenue work, passed cleanly across the clock.
            </p>
            <div className="space-y-2 text-sm text-fog">
              <p>
                <span className="font-semibold text-white">Bolton, Ontario</span> · <OfficeTime tz="America/Toronto" /> — the studio
              </p>
              <p>
                <span className="font-semibold text-white">Remote bench</span> · different locations — build, tracking &amp; automation
              </p>
              <p>
                <a href="mailto:hello@dgclicks.ca" className="link-draw font-semibold text-white">
                  hello@dgclicks.ca
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 py-8 sm:flex-row sm:items-center">
            <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={go(link.href)}
                  className="link-draw text-sm font-medium text-white/80"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <p className="text-sm text-fog">© 2026 DG Clicks · Measured in booked calls, not impressions.</p>
          </div>
        </div>

        {/* The signature — letters fill lime under the cursor */}
        <p className="sr-only">DG Clicks</p>
        <p
          ref={markRef}
          aria-hidden="true"
          className="-mb-[1.5vw] mt-2 select-none whitespace-nowrap text-center font-display text-[15.5vw] font-bold leading-[0.8] tracking-tight text-transparent will-change-transform"
          style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.35)" }}
        >
          {"DG CLICKS".split("").map((ch, i) => (
            <span
              key={i}
              className={
                pathname === "/services" || pathname === "/about" || pathname === "/contact"
                  ? "inline-block"
                  : "inline-block transition-colors duration-300 hover:text-mint motion-reduce:transition-none"
              }
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
