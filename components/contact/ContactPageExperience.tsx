"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import {
  gsap,
  SplitText,
  prefersReducedMotion,
  useIsoLayoutEffect,
} from "@/lib/gsap";
import styles from "./ContactPageExperience.module.css";

const SERVICES = [
  "SEO",
  "Website Development",
  "Paid Ads",
  "Social Media Management",
  "Graphic Design",
  "Not sure yet",
] as const;

const BUDGETS = [
  "Still deciding",
  "Under $2,000 / month",
  "$2,000–$5,000 / month",
  "$5,000–$10,000 / month",
  "$10,000+ / month",
  "One-time project",
] as const;

type Values = {
  name: string;
  email: string;
  company: string;
  service: (typeof SERVICES)[number];
  budget: (typeof BUDGETS)[number];
  message: string;
};

type ValidatedField = "name" | "email" | "message";
type Errors = Partial<Record<ValidatedField, string>>;
type HandoffState = "idle" | "opening";

const initialValues: Values = {
  name: "",
  email: "",
  company: "",
  service: "Not sure yet",
  budget: "Still deciding",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(field: ValidatedField, value: string) {
  const cleanValue = value.trim();

  if (field === "name" && !cleanValue) {
    return "Tell us who should get the reply.";
  }
  if (field === "email" && !cleanValue) {
    return "Add your work email so we can return the audit.";
  }
  if (field === "email" && !emailPattern.test(cleanValue)) {
    return "Use an email in the form name@company.ca.";
  }
  if (field === "message" && cleanValue.length < 20) {
    return "Give us one concrete symptom so the audit has somewhere to start.";
  }
  return undefined;
}

function validate(values: Values): Errors {
  return {
    name: validateField("name", values.name),
    email: validateField("email", values.email),
    message: validateField("message", values.message),
  };
}

function trimPreview(value: string, fallback: string, limit = 118) {
  const cleanValue = value.trim().replace(/\s+/g, " ");
  if (!cleanValue) return fallback;
  return cleanValue.length > limit
    ? `${cleanValue.slice(0, limit).trimEnd()}…`
    : cleanValue;
}

function buildMailto(values: Values) {
  const identity = values.company.trim() || values.name.trim();
  const subject = `Growth work order — ${values.service} — ${identity}`;
  const body = [
    "Hi DG Clicks,",
    "",
    "Here is my first growth work order:",
    "",
    `Name: ${values.name.trim()}`,
    `Work email: ${values.email.trim()}`,
    `Company or website: ${values.company.trim() || "Not supplied"}`,
    `Service: ${values.service}`,
    `Working range (CAD): ${values.budget}`,
    "",
    "What is stuck:",
    values.message.trim(),
    "",
    "Please reply to the work email above.",
  ].join("\n");

  return `mailto:hello@dgclicks.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ContactPageExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const formHeadlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const routeTrackRef = useRef<HTMLDivElement>(null);
  const routeMarkerRef = useRef<HTMLDivElement>(null);
  const receiptRef = useRef<HTMLElement>(null);
  const dispatchTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  const [values, setValues] = useState<Values>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [handoffState, setHandoffState] = useState<HandoffState>("idle");

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;

      media.add(
        "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
        const splits: SplitText[] = [];
        const context = gsap.context(() => {
          if (heroHeadlineRef.current) {
            const heroSplit = SplitText.create(heroHeadlineRef.current, {
              type: "lines,words",
              mask: "words",
              aria: "auto",
            });
            splits.push(heroSplit);
            gsap.from(heroSplit.words, {
              yPercent: 112,
              opacity: 0,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.045,
              delay: 0.12,
            });
          }

          gsap.from("[data-hero-readout]", {
            y: 18,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.4,
          });

          if (formHeadlineRef.current) {
            const formSplit = SplitText.create(formHeadlineRef.current, {
              type: "lines,words",
              mask: "lines",
              aria: "auto",
            });
            splits.push(formSplit);
            gsap.from(formSplit.words, {
              yPercent: 108,
              opacity: 0,
              duration: 0.8,
              stagger: 0.04,
              ease: "power4.out",
              scrollTrigger: {
                trigger: formHeadlineRef.current,
                start: "top 82%",
                once: true,
              },
            });
          }

          const routeLine = root.querySelector<HTMLElement>("[data-route-line]");
          if (routeLine && formRef.current) {
            gsap.from(routeLine, {
              scaleY: 0,
              transformOrigin: "top center",
              ease: "none",
              scrollTrigger: {
                trigger: formRef.current,
                start: "top 84%",
                end: "bottom 68%",
                scrub: 0.55,
              },
            });
          }

          const rules = gsap.utils.toArray<HTMLElement>(
            "[data-receipt-rule]",
            receiptRef.current,
          );
          if (rules.length && receiptRef.current) {
            gsap.from(rules, {
              scaleX: 0,
              transformOrigin: "left center",
              stagger: 0.07,
              ease: "none",
              scrollTrigger: {
                trigger: receiptRef.current,
                start: "top 88%",
                end: "top 48%",
                scrub: 0.55,
              },
            });
          }
        }, root);

        return () => {
          context.revert();
          splits.forEach((split) => split.revert());
        };
        },
      );
    });

    return () => {
      cancelled = true;
      media.revert();
      dispatchTimelineRef.current?.kill();
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const moveRouteMarker = (target: EventTarget | null) => {
    if (prefersReducedMotion()) return;

    const element = target instanceof HTMLElement ? target : null;
    const row = element?.closest<HTMLElement>("[data-route-row]");
    const track = routeTrackRef.current;
    const marker = routeMarkerRef.current;
    if (!row || !track || !marker || track.offsetHeight === 0) return;

    const rowBox = row.getBoundingClientRect();
    const trackBox = track.getBoundingClientRect();
    const markerHeight = marker.offsetHeight;
    const targetY =
      rowBox.top + rowBox.height / 2 - trackBox.top - markerHeight / 2;
    const clampedY = gsap.utils.clamp(
      0,
      Math.max(0, trackBox.height - markerHeight),
      targetY,
    );

    gsap.to(marker, {
      y: clampedY,
      duration: 0.48,
      ease: "power3.out",
      overwrite: true,
    });
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const field = event.target.name as keyof Values;
    const value = event.target.value;
    setValues((current) => ({ ...current, [field]: value } as Values));

    if (field === "name" || field === "email" || field === "message") {
      if (errors[field]) {
        setErrors((current) => ({
          ...current,
          [field]: validateField(field, value),
        }));
      }
    }
  };

  const onBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const field = event.target.name;
    if (field === "name" || field === "email" || field === "message") {
      setErrors((current) => ({
        ...current,
        [field]: validateField(field, event.target.value),
      }));
    }
  };

  const openEmailHandoff = (mailto: string) => {
    const openEmail = () => {
      window.location.href = mailto;
      resetTimerRef.current = window.setTimeout(() => {
        setHandoffState("idle");
      }, 1600);
    };

    setHandoffState("opening");
    if (prefersReducedMotion()) {
      openEmail();
      return;
    }

    const marker = routeMarkerRef.current;
    const track = routeTrackRef.current;
    const slip = receiptRef.current?.querySelector<HTMLElement>(
      "[data-work-order-slip]",
    );
    if (!marker || !track || track.offsetHeight === 0) {
      openEmail();
      return;
    }

    dispatchTimelineRef.current?.kill();
    const dispatchTimeline = gsap
      .timeline({ onComplete: openEmail })
      .to(marker, {
        y: Math.max(0, track.offsetHeight - marker.offsetHeight),
        duration: 0.48,
        ease: "power3.inOut",
      });
    if (slip) {
      dispatchTimeline.to(
        slip,
        {
          x: 7,
          duration: 0.13,
          repeat: 1,
          yoyo: true,
          ease: "power1.inOut",
        },
        "-=0.12",
      );
    }
    dispatchTimelineRef.current = dispatchTimeline;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    const activeErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, error]) => Boolean(error)),
    ) as Errors;
    setErrors(activeErrors);

    const firstInvalid = (["name", "email", "message"] as const).find(
      (field) => activeErrors[field],
    );
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    openEmailHandoff(buildMailto(values));
  };

  const describedBy = (field: ValidatedField, hintId?: string) =>
    [hintId, errors[field] ? `work-${field}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div ref={rootRef} className={styles.page}>
      <section className={styles.hero} data-opaque-scene>
        <div className={styles.heroShell}>
          <div className={styles.utilityBar} data-hero-readout>
            <span>DG / NEW BUSINESS DESK</span>
            <span>INTAKE STATUS: OPEN</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker} data-hero-readout>
                First work order
              </p>
              <h1 ref={heroHeadlineRef}>Put the leak on the board.</h1>
              <p className={styles.heroLead} data-hero-readout>
                Start with what is stuck—not a polished brief. We&apos;ll read the
                numbers, find the pressure point, and reply with a useful next
                move.
              </p>
              <a href="#work-order" className={styles.heroAction} data-hero-readout>
                <span>Issue a work order</span>
                <i aria-hidden="true">↓</i>
              </a>
            </div>

            <div className={styles.routeDiagram} aria-hidden="true" data-hero-readout>
              <svg viewBox="0 0 540 420" role="presentation">
                <path d="M48 62H226V152H454V286H326V366H492" />
                <circle cx="48" cy="62" r="9" />
                <circle cx="226" cy="152" r="9" />
                <circle cx="454" cy="286" r="9" />
                <circle cx="326" cy="366" r="9" />
              </svg>
              <span className={styles.routeTagOne}>PROBLEM</span>
              <span className={styles.routeTagTwo}>CONTEXT</span>
              <span className={styles.routeTagThree}>HUMAN REPLY</span>
              <div className={styles.diagramTicket}>
                <b>WO</b>
                <span>UNFILED</span>
              </div>
            </div>
          </div>

          <dl className={styles.heroReadouts} data-hero-readout>
            <div>
              <dt>Studio</dt>
              <dd>Bolton, Ontario</dd>
            </div>
            <div>
              <dt>Reply window</dt>
              <dd>Within one business day</dd>
            </div>
            <div>
              <dt>Direct line</dt>
              <dd>
                <a href="mailto:hello@dgclicks.ca">hello@dgclicks.ca</a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="work-order" className={styles.dispatchSection}>
        <div className={styles.dispatchShell}>
          <header className={styles.dispatchHeader}>
            <p>INTAKE / PLAIN LANGUAGE ONLY</p>
            <h2 ref={formHeadlineRef}>Your first work order.</h2>
            <p>
              Give us enough context to spot the real constraint. You do not
              need to know which service fixes it yet.
            </p>
          </header>

          <div className={styles.dispatchGrid}>
            <div className={styles.formPanel}>
              <div className={styles.formTitleRow}>
                <span>CLIENT INPUT</span>
                <span>ALL CURRENCY IN CAD</span>
              </div>

              <form
                ref={formRef}
                onSubmit={onSubmit}
                onFocusCapture={(event) => moveRouteMarker(event.target)}
                noValidate
              >
                <div ref={routeTrackRef} className={styles.routeTrack} aria-hidden="true">
                  <span data-route-line />
                  <div ref={routeMarkerRef} className={styles.routeMarker}>
                    <b>WO</b>
                    <small>OPEN</small>
                  </div>
                </div>

                <div className={styles.formRows}>
                  <div className={styles.twoUp}>
                    <div className={styles.fieldBlock} data-route-row>
                      <label htmlFor="work-name">Your name</label>
                      <input
                        id="work-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={onChange}
                        onBlur={onBlur}
                        maxLength={80}
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={describedBy("name")}
                      />
                      {errors.name && (
                        <p id="work-name-error" className={styles.error} role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className={styles.fieldBlock} data-route-row>
                      <label htmlFor="work-email">Work email</label>
                      <input
                        id="work-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={onChange}
                        onBlur={onBlur}
                        maxLength={160}
                        required
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("email")}
                      />
                      {errors.email && (
                        <p id="work-email-error" className={styles.error} role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className={styles.fieldBlock} data-route-row>
                    <label htmlFor="work-company">Company or website</label>
                    <input
                      id="work-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={values.company}
                      onChange={onChange}
                      onBlur={onBlur}
                      maxLength={160}
                    />
                  </div>

                  <div className={styles.twoUp}>
                    <div className={styles.fieldBlock} data-route-row>
                      <label htmlFor="work-service">Closest service</label>
                      <select
                        id="work-service"
                        name="service"
                        value={values.service}
                        onChange={onChange}
                        onBlur={onBlur}
                      >
                        {SERVICES.map((service) => (
                          <option key={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.fieldBlock} data-route-row>
                      <label htmlFor="work-budget">Working range in CAD</label>
                      <select
                        id="work-budget"
                        name="budget"
                        value={values.budget}
                        onChange={onChange}
                        onBlur={onBlur}
                      >
                        {BUDGETS.map((budget) => (
                          <option key={budget}>{budget}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.fieldBlock} data-route-row>
                    <label htmlFor="work-message">What is stuck?</label>
                    <p id="work-message-hint" className={styles.fieldHint}>
                      A useful answer names the goal, the current result, and
                      what you have already tried.
                    </p>
                    <textarea
                      id="work-message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={onChange}
                      onBlur={onBlur}
                      maxLength={800}
                      required
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={describedBy(
                        "message",
                        "work-message-hint",
                      )}
                    />
                    <span className={styles.characterCount} aria-hidden="true">
                      {values.message.length} / 800
                    </span>
                    {errors.message && (
                      <p id="work-message-error" className={styles.error} role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className={styles.submitRow} data-route-row>
                    <button type="submit" disabled={handoffState === "opening"}>
                      <span>
                        {handoffState === "opening"
                          ? "Opening your email app…"
                          : "Open work order in email"}
                      </span>
                      <i aria-hidden="true">↗</i>
                    </button>
                    <p>
                      This opens a prefilled email. Nothing is sent until you
                      review and send it from your email app.
                    </p>
                  </div>

                  <p className={styles.privacyNote}>
                    No newsletter or drip sequence. One human reply.
                  </p>
                  <p className={styles.handoffStatus} role="status" aria-live="polite">
                    {handoffState === "opening"
                      ? "Preparing your work order. It has not been sent yet."
                      : ""}
                  </p>
                </div>
              </form>
            </div>

            <aside
              ref={receiptRef}
              className={styles.receipt}
              aria-labelledby="work-order-preview"
            >
              <div className={styles.workOrderSlip} data-work-order-slip>
                <span>LIVE WORK ORDER</span>
                <b>WO / DRAFT</b>
              </div>

              <div className={styles.receiptBody}>
                <div className={styles.receiptStatus}>
                  <span aria-hidden="true" />
                  <p>INTAKE / UNSENT</p>
                </div>
                <h3 id="work-order-preview">Routing receipt</h3>
                <p className={styles.receiptIntro}>
                  This readout mirrors the email you will review before sending.
                </p>

                <dl className={styles.receiptData}>
                  <div data-receipt-rule>
                    <dt>Client</dt>
                    <dd>{trimPreview(values.name, "Unassigned", 42)}</dd>
                  </div>
                  <div data-receipt-rule>
                    <dt>Company / site</dt>
                    <dd>{trimPreview(values.company, "Not supplied", 54)}</dd>
                  </div>
                  <div data-receipt-rule>
                    <dt>Route</dt>
                    <dd>{values.service}</dd>
                  </div>
                  <div data-receipt-rule>
                    <dt>Budget</dt>
                    <dd>{values.budget}</dd>
                  </div>
                </dl>

                <div className={styles.receiptIssue} data-receipt-rule>
                  <p>THE CONSTRAINT</p>
                  <strong>
                    {trimPreview(
                      values.message,
                      "Waiting for the problem, goal, and current result.",
                    )}
                  </strong>
                </div>

                <div className={styles.receiptFooter} data-receipt-rule>
                  <span>DISPATCH: BOLTON, ON</span>
                  <span>REPLY: ≤ 1 BUSINESS DAY</span>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.directLine}>
            <p>Prefer to write it yourself?</p>
            <a href="mailto:hello@dgclicks.ca">hello@dgclicks.ca</a>
          </div>
        </div>
      </section>
    </div>
  );
}
