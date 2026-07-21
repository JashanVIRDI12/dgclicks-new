"use client";

import Link from "next/link";
import { type PointerEvent, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

/* ════════════════════════════════════════════════════════════════
   CONTACT — "the first work order". A dark intake sheet on the left
   writes a live carbon copy on the right. No invented backend: a
   valid brief hands off to a prefilled email. Matches the studio's
   dark-luxury language.
   ════════════════════════════════════════════════════════════════ */

const SERVICES = [
  "SEO / Search",
  "Website / Build",
  "Paid Ads",
  "Social Media",
  "Brand / Design",
  "Not sure yet",
] as const;

const BUDGETS = ["< $2k / mo", "$2–5k / mo", "$5–10k / mo", "$10k+ / mo"] as const;

const STEPS = [
  { n: "01", t: "You send the brief", d: "The problem and the business context — not a spec." },
  { n: "02", t: "We reply in 1 day", d: "A human, with first questions and whether we're a fit." },
  { n: "03", t: "Free growth audit", d: "The leak map, whether or not you hire us to fix it." },
];

const CONTACT_EMAIL = "hello@dgclicks.com";

export default function ContactExperience() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "" as (typeof SERVICES)[number] | "",
    budget: "" as (typeof BUDGETS)[number] | "",
    message: "",
  });

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const orderId = useMemo(() => {
    const d = new Date();
    return `DGC-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  }, []);

  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.message.trim();

  const mailto = useMemo(() => {
    const subject = `Growth work order — ${form.name || "New enquiry"}`;
    const body = [
      `Work order: ${orderId}`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company / site: ${form.company || "—"}`,
      `Channel: ${form.service || "—"}`,
      `Budget: ${form.budget || "—"}`,
      "",
      "What's blocking growth:",
      form.message,
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [form, orderId]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, {
          type: "lines,words",
          linesClass: "block overflow-hidden",
        });
        gsap
          .timeline({ delay: 0.15 })
          .from(split.words, { yPercent: 120, duration: 1, ease: "power4.out", stagger: 0.05 })
          .from("[data-c-fade]", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, "-=0.7");
      }
      gsap.from("[data-c-panel]", {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-c-grid]", start: "top 82%" },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[#070707] pb-28 pt-32 text-white md:pt-40"
    >
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_0%,rgba(77,159,255,0.26),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_100%_15%,rgba(206,219,88,0.08),transparent_55%)]" />
      </div>

      <div className="wrap relative z-10">
        {/* header */}
        <div className="max-w-3xl">
          <p data-c-fade className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
            <span className="h-px w-8 bg-white/30" />
            Start a work order
          </p>
          <h1
            ref={headlineRef}
            className="mt-6 max-w-[14ch] font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
          >
            Tell us where it leaks.
          </h1>
          <p data-c-fade className="mt-6 max-w-md text-lg leading-snug text-white/60">
            Start with the problem, not a shopping list. You'll get a human reply
            within one business day and a free growth audit either way.
          </p>
        </div>

        {/* grid */}
        <div data-c-grid className="mt-16 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          {/* form */}
          <form
            data-c-panel
            onSubmit={(e) => e.preventDefault()}
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" required value={form.name} onChange={set("name")} placeholder="Jane Doe" />
              <Field label="Email" required type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" />
            </div>
            <div className="mt-5">
              <Field label="Company / website" value={form.company} onChange={set("company")} placeholder="company.com" />
            </div>

            <fieldset className="mt-7">
              <legend className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Channel
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <Chip key={s} active={form.service === s} onClick={() => set("service")(form.service === s ? "" : s)}>
                    {s}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                Monthly budget
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <Chip key={b} active={form.budget === b} onClick={() => set("budget")(form.budget === b ? "" : b)}>
                    {b}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <div className="mt-7">
              <label className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                What's blocking growth? <span className="text-[#4D9FFF]">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => set("message")(e.target.value)}
                rows={4}
                placeholder="Referrals dried up, ads aren't converting, the site is slow…"
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-[#4D9FFF]/60"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <MagneticSubmit href={valid ? mailto : undefined} disabled={!valid} />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                {valid ? "Opens your email, prefilled" : "Name, email & the problem to send"}
              </p>
            </div>
          </form>

          {/* live carbon copy */}
          <div data-c-panel className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0c10] p-6 sm:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{ background: "radial-gradient(80% 60% at 100% 0%, rgba(77,159,255,0.18), transparent 60%)" }}
              />
              <div className="relative flex items-center justify-between border-b border-dashed border-white/12 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                  Carbon copy
                </span>
                <span className="font-mono text-[10px] tracking-widest text-[#4D9FFF]">{orderId}</span>
              </div>
              <dl className="relative mt-5 space-y-3.5 font-mono text-[12px]">
                <Row k="Client" v={form.name} />
                <Row k="Contact" v={form.email} />
                <Row k="Company" v={form.company} />
                <Row k="Channel" v={form.service} />
                <Row k="Budget" v={form.budget} />
                <div className="pt-1">
                  <dt className="text-white/40">Brief</dt>
                  <dd className="mt-1.5 min-h-[3.5rem] whitespace-pre-wrap rounded-lg border border-white/8 bg-black/30 p-3 leading-relaxed text-white/80">
                    {form.message || <span className="text-white/25">The problem, in your words…</span>}
                  </dd>
                </div>
              </dl>
              <div className="relative mt-5 flex items-center gap-2 border-t border-dashed border-white/12 pt-4">
                <span className={`h-2 w-2 rounded-full ${valid ? "bg-[#CEDB58]" : "bg-white/20"}`} />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {valid ? "Ready to send" : "Draft"}
                </span>
              </div>
            </div>

            {/* what happens next */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                What happens next
              </p>
              <ol className="mt-5 space-y-5">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex gap-4">
                    <span className="font-mono text-[11px] tracking-widest text-[#4D9FFF]">{s.n}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{s.t}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45">{s.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/8 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-[#4D9FFF]">
                  {CONTACT_EMAIL}
                </a>
                <span>Bolton, Ontario</span>
                <span className="text-white/30">Replies in 1 business day</span>
              </div>
            </div>
          </div>
        </div>

        <p data-c-fade className="mt-10 max-w-xl text-xs leading-relaxed text-white/30">
          Prefer to keep it casual? Email us directly at{" "}
          <Link href={`mailto:${CONTACT_EMAIL}`} className="text-white/60 underline-offset-4 hover:underline">
            {CONTACT_EMAIL}
          </Link>{" "}
          — the work order just gives us a head start.
        </p>
      </div>
    </section>
  );
}

/* ————————————————————————————— inputs ————————————————————————————— */
function Field({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
        {label} {required && <span className="text-[#4D9FFF]">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2.5 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:border-[#4D9FFF]/60"
      />
    </label>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-2 text-xs transition-all duration-300 ${
        active
          ? "border-[#4D9FFF] bg-[#4D9FFF] font-medium text-[#05070c]"
          : "border-white/12 text-white/60 hover:border-white/30 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-white/40">{k}</dt>
      <dd className={`truncate text-right ${v ? "text-white/85" : "text-white/25"}`}>
        {v || "—"}
      </dd>
    </div>
  );
}

function MagneticSubmit({ href, disabled }: { href?: string; disabled?: boolean }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 240, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 240, damping: 18, mass: 0.5 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || disabled || e.pointerType === "touch") return;
    const b = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (b.left + b.width / 2)) * 0.3);
    my.set((e.clientY - (b.top + b.height / 2)) * 0.4);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-3 rounded-full bg-white/10 py-4 pl-7 pr-4 text-sm font-semibold text-white/40">
        Send the work order
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/40">→</span>
      </span>
    );
  }

  return (
    <motion.a
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#4D9FFF] to-[#2A5FD9] py-4 pl-7 pr-4 text-sm font-semibold text-white shadow-[0_0_28px_-6px_rgba(77,159,255,0.7)] ring-1 ring-inset ring-white/25 transition-shadow duration-300 hover:shadow-[0_0_34px_-2px_rgba(77,159,255,0.9)]"
    >
      Send the work order
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#0b2a52] transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </motion.a>
  );
}
