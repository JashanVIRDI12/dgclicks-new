"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

type CursorShape = "pill" | "circle";

/**
 * Site-wide custom cursor: a blend-difference dot with a trailing ring that
 * grows over interactive elements and swaps into a labelled chip when the
 * target declares intent via data-cursor="View" / "Drag" / etc.
 * Fine pointers only; never mounted under reduced motion or touch.
 */
export default function Cursor() {
  const pathname = usePathname();
  const usesRouteSignature =
    pathname === "/services" || pathname === "/about" || pathname === "/contact";
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [shape, setShape] = useState<CursorShape>("pill");

  useIsoLayoutEffect(() => {
    if (usesRouteSignature) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const chip = chipRef.current;
    if (!dot || !ring || !chip) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        document.documentElement.classList.add("cc-on");
        gsap.set([dot, ring, chip], { xPercent: -50, yPercent: -50 });

        const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
        const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
        const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
        const chipX = gsap.quickTo(chip, "x", { duration: 0.35, ease: "power3.out" });
        const chipY = gsap.quickTo(chip, "y", { duration: 0.35, ease: "power3.out" });

        let visible = false;
        let activeElement: Element | null = null;
        let activeLabel = "";
        let activeShape: CursorShape = "pill";

        const updateLabel = (nextLabel = "", nextShape: CursorShape = "pill") => {
          activeLabel = nextLabel;
          activeShape = nextShape;
          setLabel((current) => (current === nextLabel ? current : nextLabel));
          setShape((current) => (current === nextShape ? current : nextShape));
        };

        const getInteractiveElement = (target: EventTarget | null) => {
          if (!(target instanceof Element)) return null;

          const formControl = target.closest("input, textarea, select, label");
          if (formControl) return formControl;

          return (
            target.closest("[data-cursor]") ??
            target.closest("a, button, [role='button']")
          );
        };

        const reset = () => {
          activeElement = null;
          updateLabel();
          gsap.to(ring, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(dot, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.3,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(chip, {
            autoAlpha: 0,
            scale: 0.5,
            duration: 0.2,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        const onMove = (e: PointerEvent) => {
          if (!visible) {
            visible = true;
            gsap.to([dot, ring], {
              autoAlpha: 1,
              duration: 0.25,
              ease: "power3.out",
            });
          }
          dotX(e.clientX);
          dotY(e.clientY);
          ringX(e.clientX);
          ringY(e.clientY);
          chipX(e.clientX);
          chipY(e.clientY);
        };

        const onOver = (e: PointerEvent) => {
          const el = getInteractiveElement(e.target);
          if (!el) {
            reset();
            return;
          }
          const tag = el.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "LABEL") {
            // Native caret/pointer is more usable inside forms.
            activeElement = el;
            updateLabel();
            gsap.to([dot, ring, chip], {
              autoAlpha: 0,
              duration: 0.15,
              ease: "power3.out",
              overwrite: "auto",
            });
            return;
          }
          const text = el.getAttribute("data-cursor");
          if (text) {
            const nextShape: CursorShape =
              el.getAttribute("data-cursor-shape") === "circle" ? "circle" : "pill";
            const changed =
              activeElement !== el || activeLabel !== text || activeShape !== nextShape;

            activeElement = el;
            updateLabel(text, nextShape);

            if (changed) {
              gsap.fromTo(
                chip,
                { scale: 0.82 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.3,
                  ease: "power3.out",
                  overwrite: "auto",
                },
              );
            } else {
              gsap.to(chip, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.3,
                ease: "power3.out",
                overwrite: "auto",
              });
            }
            gsap.to(ring, {
              autoAlpha: 0,
              duration: 0.15,
              ease: "power3.out",
              overwrite: "auto",
            });
            gsap.to(dot, {
              scale: 0,
              duration: 0.2,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else {
            activeElement = el;
            updateLabel();
            gsap.to(ring, {
              scale: 1.9,
              autoAlpha: 1,
              duration: 0.3,
              ease: "power3.out",
              overwrite: "auto",
            });
            gsap.to(dot, {
              scale: 0.5,
              autoAlpha: 1,
              duration: 0.3,
              ease: "power3.out",
              overwrite: "auto",
            });
            gsap.to(chip, {
              autoAlpha: 0,
              scale: 0.5,
              duration: 0.2,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const onOut = (e: PointerEvent) => {
          const from = getInteractiveElement(e.target);
          const to = getInteractiveElement(e.relatedTarget);
          if (from && from !== to && !to) {
            reset();
          }
        };

        const onLeaveDoc = () => {
          visible = false;
          activeElement = null;
          updateLabel();
          gsap.to(ring, {
            autoAlpha: 0,
            scale: 1,
            duration: 0.2,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(dot, {
            autoAlpha: 0,
            scale: 1,
            duration: 0.2,
            ease: "power3.out",
            overwrite: "auto",
          });
          gsap.to(chip, {
            autoAlpha: 0,
            scale: 0.5,
            duration: 0.2,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerover", onOver);
        document.addEventListener("pointerout", onOut);
        document.documentElement.addEventListener("pointerleave", onLeaveDoc);

        return () => {
          visible = false;
          activeElement = null;
          updateLabel();
          document.documentElement.classList.remove("cc-on");
          window.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerover", onOver);
          document.removeEventListener("pointerout", onOut);
          document.documentElement.removeEventListener("pointerleave", onLeaveDoc);
        };
      },
    );
    return () => mm.revert();
  }, [pathname, usesRouteSignature]);

  if (usesRouteSignature) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={dotRef}
        className="invisible fixed left-0 top-0 h-2.5 w-2.5 rounded-full bg-white opacity-0 mix-blend-difference will-change-transform"
      />
      <div
        ref={ringRef}
        className="invisible fixed left-0 top-0 h-9 w-9 rounded-full border border-white opacity-0 mix-blend-difference will-change-transform"
      />
      <div
        ref={chipRef}
        className={`invisible fixed left-0 top-0 grid scale-50 place-items-center whitespace-nowrap rounded-full uppercase opacity-0 will-change-transform ${
          shape === "circle"
            ? "h-16 w-16 bg-mint p-0 text-[11px] font-semibold tracking-[0.12em] text-night"
            : "bg-ink px-4 py-2 text-xs font-medium tracking-[0.14em] text-white"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
