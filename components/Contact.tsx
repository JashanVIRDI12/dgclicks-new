"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import MagneticButton from "./MagneticButton";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 py-3 text-lg text-ink " +
  "outline-none transition-colors focus:border-sky-deep";

const fieldLabel = "mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate";

/**
 * DISTINCT IDEA — "the dial tone": the closing move is one object — a big
 * circular button with the offer rotating around its rim like a record,
 * magnetic to the cursor. No card, no panel: the form underneath is set
 * like a printed intake sheet, bare rules on the page. The circle is the
 * only thing on the site that never stops moving.
 */
export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<SVGPathElement>(null);

  const showSuccess = () => {
    const form = formRef.current!;
    const success = successRef.current!;
    if (prefersReducedMotion()) {
      gsap.set(form, { autoAlpha: 0 });
      gsap.set(success, { autoAlpha: 1 });
    } else {
      const check = checkRef.current!;
      const len = check.getTotalLength();
      gsap.set(check, { strokeDasharray: len, strokeDashoffset: len });
      gsap
        .timeline()
        .to(form, { autoAlpha: 0, y: -16, duration: 0.4, ease: "power2.in" })
        .fromTo(
          success,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
        )
        .to(check, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
    }
    success.querySelector<HTMLElement>("h3")?.focus();
  };

  const reset = () => {
    setStatus("idle");
    formRef.current!.reset();
    gsap.set(successRef.current, { autoAlpha: 0 });
    gsap.set(formRef.current, { autoAlpha: 1, y: 0 });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    if (!String(data.get("name")).trim()) {
      next.name = "We'll need a name to say hello.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email")))) {
      next.email = "That email looks off — one more try?";
    }
    if (String(data.get("message")).trim().length < 10) {
      next.message = "Give us a sentence or two — where does it hurt?";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // No backend wired yet — simulate the send so the UX is complete.
    setStatus("sending");
    window.setTimeout(() => {
      setStatus("sent");
      showSuccess();
    }, 900);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="absolute right-[-8rem] top-8 h-[30rem] w-[30rem] rounded-full bg-sky/25 blur-3xl"
      />

      <div className="wrap relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <h2 className="max-w-2xl font-display text-[clamp(2.6rem,6.5vw,5.5rem)] font-bold leading-[0.96] tracking-tight text-ink">
              Make the clicks count.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate">
              Tell us where it hurts. You&apos;ll get a free growth audit —
              the leaks, ranked by cost — whether or not we ever send an
              invoice.
            </p>
            <ul className="mt-10 space-y-5">
              <li>
                <p className={fieldLabel}>Email</p>
                <a href="mailto:hello@dgclicks.ca" className="link-draw font-display text-xl font-semibold text-ink">
                  hello@dgclicks.ca
                </a>
              </li>
              <li>
                <p className={fieldLabel}>Studio</p>
                <p className="font-medium text-ink">Bolton, Ontario · remote bench across time zones</p>
              </li>
              <li>
                <p className={fieldLabel}>Response</p>
                <p className="text-slate">Within one business day — someone is always awake.</p>
              </li>
            </ul>
          </div>

          {/* The dial: rotating offer, magnetic pull, one job */}
          <div className="flex justify-center lg:justify-end lg:pr-10">
            <MagneticButton strength={0.35}>
              <button
                type="button"
                data-cursor="Start"
                onClick={() => nameRef.current?.focus()}
                aria-label="Start the free growth audit — jump to the form"
                className="group relative grid h-52 w-52 place-items-center rounded-full bg-night text-white transition-colors hover:bg-sky-deep sm:h-64 sm:w-64"
              >
                <svg
                  viewBox="0 0 100 100"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full motion-safe:[animation:spin_16s_linear_infinite] motion-reduce:animate-none"
                >
                  <defs>
                    <path id="cta-ring" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
                  </defs>
                  <text className="fill-white/60 text-[6.4px] font-semibold uppercase tracking-[0.22em]">
                    <textPath href="#cta-ring">
                      Free growth audit · leaks ranked by cost · no retainer trap ·
                    </textPath>
                  </text>
                </svg>
                <span className="relative text-center">
                  <span aria-hidden="true" className="block text-3xl text-mint transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none">
                    ↗
                  </span>
                  <span className="mt-1 block font-display text-lg font-semibold">Start</span>
                </span>
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* The intake sheet */}
        <div className="relative mt-20 border-t-2 border-ink/10 pt-12">
          <form ref={formRef} onSubmit={onSubmit} noValidate>
            <div className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
              <div>
                <label htmlFor="cf-name" className={fieldLabel}>
                  Your name
                </label>
                <input
                  id="cf-name"
                  ref={nameRef}
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={field}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "cf-name-error" : undefined}
                />
                {errors.name && (
                  <p id="cf-name-error" role="alert" className="mt-2 text-sm font-medium text-[#B04A42]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cf-email" className={fieldLabel}>
                  Work email
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={field}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "cf-email-error" : undefined}
                />
                {errors.email && (
                  <p id="cf-email-error" role="alert" className="mt-2 text-sm font-medium text-[#B04A42]">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cf-type" className={fieldLabel}>
                  What needs fixing?
                </label>
                <select id="cf-type" name="type" defaultValue="Not sure yet" className={`${field} appearance-none`}>
                  <option>SEO</option>
                  <option>Paid ads</option>
                  <option>Website build</option>
                  <option>Conversion optimization</option>
                  <option>Lead automation</option>
                  <option>Not sure yet</option>
                </select>
              </div>

              <div>
                <label htmlFor="cf-budget" className={fieldLabel}>
                  Monthly budget (CAD)
                </label>
                <select id="cf-budget" name="budget" defaultValue="$2k–5k" className={`${field} appearance-none`}>
                  <option>Under $2k</option>
                  <option>$2k–5k</option>
                  <option>$5k–10k</option>
                  <option>$10k+</option>
                  <option>One-off project</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cf-message" className={fieldLabel}>
                  Where does it hurt?
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={4}
                  className={`${field} resize-y`}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "cf-message-error" : undefined}
                />
                {errors.message && (
                  <p id="cf-message-error" role="alert" className="mt-2 text-sm font-medium text-[#B04A42]">
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <MagneticButton>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-full bg-mint px-9 py-4 font-semibold text-night transition-colors hover:bg-ink hover:text-white disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "sending" ? "Sending…" : "Send it over"}
                </button>
              </MagneticButton>
              <p className="text-sm text-slate">No newsletters, no drip sequence. One human reply.</p>
            </div>
          </form>

          <div
            ref={successRef}
            className="invisible absolute inset-0 grid place-items-center pt-12 opacity-0"
            aria-live="polite"
          >
            <div className="text-center">
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true" className="mx-auto">
                <circle cx="36" cy="36" r="34" fill="#CEDB58" fillOpacity="0.5" stroke="#2E6BA8" strokeWidth="2" />
                <path
                  ref={checkRef}
                  d="M22 37.5 L32 47 L51 27"
                  stroke="#142638"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 tabIndex={-1} className="mt-6 font-display text-display-md font-semibold text-ink outline-none">
                Got it.
              </h3>
              <p className="mx-auto mt-3 max-w-sm leading-relaxed text-slate">
                A strategist will reply within one business day — whoever on
                the bench is awake.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 rounded-full border-2 border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-sky-deep"
              >
                Send another
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
