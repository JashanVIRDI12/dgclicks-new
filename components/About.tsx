"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { img } from "@/lib/images";

function BoltonClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const format = () =>
      setTime(
        new Intl.DateTimeFormat("en", {
          timeZone: "America/Toronto",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}

const panels = [
  {
    key: "studio",
    heading: "Bolton, Ontario",
    kicker: "The studio",
    image: img.officeTeam,
    alt: "Team gathered around laptops in the Bolton studio",
    roles: "Strategy · client calls · growth reviews",
    note: "Every plan is argued out loud in this room before it becomes a ticket.",
  },
  {
    key: "bench",
    heading: "Everywhere else",
    kicker: "The remote bench",
    image: img.officeRemote,
    alt: "Remote teammate reviewing a build over a laptop",
    roles: "Design · build · tracking · creative",
    note: "Specialists working from different locations keep shipping after the studio lights go off.",
  },
];

/**
 * DISTINCT IDEA — "the diptych": one studio, one distributed bench — so the
 * section is split in two. The Bolton panel wears its live local time at
 * display scale; the remote panel wears a live 'online' pulse instead,
 * because the bench has no single clock. Lean on a side and it opens wider,
 * the other politely making room: the hand-off, as an interaction.
 */
export default function About() {
  const [lean, setLean] = useState<number | null>(null);

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="wrap mx-auto max-w-2xl text-center">
        <h2 className="font-display text-display-lg font-bold text-ink">
          One studio. One accountable queue.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate">
          DG Clicks runs from Bolton, Ontario, with a remote bench working
          from different locations — strategy in the room, execution around
          the clock.
        </p>
      </div>

      <div className="mt-14 flex flex-col lg:h-[74vh] lg:flex-row">
        {panels.map((panel, i) => (
          <div key={panel.key} className="contents">
            <article
              onPointerEnter={() => setLean(i)}
              onPointerLeave={() => setLean(null)}
              onFocus={() => setLean(i)}
              onBlur={() => setLean(null)}
              tabIndex={0}
              aria-label={`${panel.kicker}: ${panel.heading}`}
              className="group relative min-h-[340px] overflow-hidden outline-none transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:min-h-0"
              style={{ flexGrow: lean === null ? 1 : lean === i ? 1.7 : 1 }}
            >
              <Image
                src={panel.image.src}
                alt={panel.alt}
                width={panel.image.width}
                height={panel.image.height}
                placeholder="blur"
                blurDataURL={panel.image.blurDataURL}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/35 to-night/10" />
              <div className="relative flex h-full min-h-[340px] flex-col justify-end p-7 text-white sm:p-10">
                {i === 0 ? (
                  <p className="font-display text-[clamp(2.8rem,6vw,5.2rem)] font-bold leading-none">
                    <BoltonClock />
                  </p>
                ) : (
                  <p className="flex items-center gap-4 font-display text-[clamp(2.8rem,6vw,5.2rem)] font-bold leading-none">
                    <span aria-hidden="true" className="relative inline-flex h-[0.35em] w-[0.35em]">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-60 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-full w-full rounded-full bg-mint" />
                    </span>
                    Online
                  </p>
                )}
                <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                  {panel.heading}
                  <span className="ml-3 text-base font-medium text-fog">{panel.kicker}</span>
                </h3>
                <p className="mt-2 text-sm font-medium text-white/85">{panel.roles}</p>
                <p className="mt-1 max-w-md text-sm text-fog">{panel.note}</p>
              </div>
            </article>
            {i === 0 && (
              <div
                aria-hidden="true"
                className="relative z-10 hidden w-2 shrink-0 -skew-x-3 bg-mint lg:block"
              />
            )}
          </div>
        ))}
      </div>

      <p className="wrap mx-auto mt-14 max-w-2xl text-center font-display text-display-sm font-semibold text-ink">
        <a href="/about" className="link-draw">
          Follow one brief from Bolton to the remote bench and back into the Friday report.
        </a>
      </p>
    </section>
  );
}
