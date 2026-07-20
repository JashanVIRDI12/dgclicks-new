"use client";

import { useEffect, useState } from "react";
import { SERVICE_PAGE } from "./page-data";

/** Sticky side signal — desktop only, tracks which channel is in view. */
export default function ServicesSignalRail() {
  const [active, setActive] = useState(SERVICE_PAGE[0].id);

  useEffect(() => {
    const nodes = SERVICE_PAGE.map((s) =>
      document.getElementById(`service-${s.id}`),
    ).filter(Boolean) as HTMLElement[];

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id.replace("service-", ""));
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.4, 0.6] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Service channels"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex"
    >
      {SERVICE_PAGE.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#service-${s.id}`}
            className="pointer-events-auto group flex items-center justify-end gap-3"
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? "translate-x-0 opacity-100"
                  : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
              }`}
              style={{ color: isActive ? s.accent : undefined }}
            >
              {s.short}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive ? "h-8 w-1.5" : "h-2.5 w-1.5 opacity-40 group-hover:opacity-80"
              }`}
              style={{ backgroundColor: s.accent }}
              aria-hidden
            />
          </a>
        );
      })}
    </nav>
  );
}
