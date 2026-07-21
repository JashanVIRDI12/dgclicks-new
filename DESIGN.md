# DG Clicks — design system

## Color — client-supplied two-color brand (azure + lime swatch, 2026-07-14)
| Token | Hex | Role |
|---|---|---|
| sky | #4A89C8 | azure — committed brand color; drenches the Numbers ledger |
| sky-deep | #2E6BA8 | azure ink: text accents, drawn lines, links on light |
| mint | #CEDB58 | chartreuse lime — the accent that marks a WIN: proof tags, CTAs, open/hover states, highlighter, nodes. Never body text on light (fails contrast) |
| ink | #142638 | headings, primary buttons on light |
| slate | #46586C | body text on light (≥4.5:1) |
| mist | #7C8FA3 | hairline labels ONLY |
| night | #0E1A28 | navy (derived from azure): hero, Work, footer |
| fog | #A7BCD2 | body text on night |

Strategy: committed→drenched — navy hero/work/proof reel/client ledger/footer, azure-drenched results meter, light elsewhere; lime reserved for wins so it stays electric.
Contrast rules: lime only as bg-chip with night text, or as graphic strokes on navy/photos; on azure surfaces use night (4.6:1) or white (3.7:1, large text only).

## Type
Site-wide type system: Bricolage Grotesque carries expressive editorial headlines, Manrope is the clear workhorse for body and UI copy, and Azeret Mono carries instrument labels, docket fields, clocks, and numeric readouts. The homepage and dispatch routes share this trio so the measurement language reads as one identity rather than a route-specific treatment.
Scale: display-xl clamp(2.75rem→6rem) / display-lg / display-md / display-sm (tailwind.config). Display tracking floor: -0.03em. Numbers always `tabular-nums`.
h1–h3 get `text-wrap: balance`; long prose gets `text-wrap: pretty`.

## Signatures (one distinct move per section, never repeated)
- Global navigation — "the growth switchboard": a compact white instrument rail with a sky signal line, square DG beacon, divided audit control, and an accessible service-routing panel that names the five commercial outcomes. It uses 10–12px geometry and hairline structure rather than the previous glass capsule.
- Hero — "the proof archive": one full-bleed WebGL scene of individually textured proof planes at real Z depths over a navy→azure→sky-cyan brand field. A damped camera leans with the pointer and recedes on scroll; Bokeh separates near evidence from blurred context, while technical leader-line placards appear only inside the camera focus zone. The headline stays DOM text inside a shader-darkened quiet field.
- Services route — "the live growth readout": a night hero opens the five-channel index, then five full-viewport service chapters alternate cloud/night/void/azure with scroll-scrubbed instrument visuals (rank ladder, page assembly, spend equation, engagement trace, mark lock). A sticky desktop signal rail tracks the active channel; a compound finale shows how the five engines feed one Friday report. Lime marks proof chips and live status only. Mobile stays in normal flow with the same content readable; reduced motion skips SplitText and idle spins.
- Work — "the developed proof reel": one full-viewport WebGL stage; Observer turns wheel/touch drag into an eased horizontal case rail while photographs develop through a thresholded grain wipe. Results assemble as particles on a separate depth plate, so the number—not a decorative badge—owns the lime accent.
- Numbers — "the meter": azure drench cut by diagonal swatch-angle caps; digits ROLL like mechanical odometer columns; lines leaf on scrub.
- GalleryStrip — "the contact sheet on rollers": a thin lime seam resolves the results meter directly into one continuous navy proof surface. Two square-edged contact-sheet strips counter-run and answer scroll velocity; flat technical caption rails replace floating tags, and loops sleep offscreen.
- Process — "the growth chamber": seven image windows zoom at different rates inside one GSAP-pinned scene while five service chapters explain how SEO, web development, paid ads, social media, and graphic design compound. Mobile and reduced-motion modes become a normal-flow editorial service ledger with the same value, proof, and deliverables.
- Testimonials — "the client ledger": each client voice is filed beside its recorded outcome in one asymmetric, hairline-bounded navy ledger. Stable stacked panels prevent layout shift; one quiet entry transition and visible previous/pause/next controls replace the tab strip. Rotation sleeps offscreen and is disabled under reduced motion.
- About route — "the Friday handoff": one client work ticket travels through a pinned, image-led Bolton → remote bench → Friday report sequence. The ticket, clipped evidence windows, and SplitText headings share one scrubbed GSAP timeline; the static mobile/reduced-motion docket stays in normal flow. It describes one studio and a distributed bench, never two offices.
- Contact route — "the first work order": a square-rule intake sheet writes a live carbon copy beside the form. Scroll draws its route, field focus selects the matching docket row, and a valid request feeds toward an honest prefilled email handoff; the page never invents backend delivery or a case ID.
- Footer — "sign the wall": viewport-scale outline wordmark; letters fill lime under the cursor; diagonal lime seam on entry.

Recurring brand motif: the DIAGONAL of the client's two-colour swatch — section caps, document registration marks, and the Footer entry seam.

## Motion rules
Lenis on gsap.ticker (one RAF). Transform/opacity only for scroll-linked work; `ScrollTrigger.batch` for repeated elements; expo/power ease-outs, no bounce. Reduced motion: content visible by default, GSAP animates *from* hidden, matchMedia-gated.
Dispatch routes: desktop-only pin/scrub via ScrollTrigger where the narrative benefits from it; SplitText and route/ticket mechanisms share scroll progress. No independent idle timelines, tickers, or looping readouts. Contact field feedback may use short, user-triggered GSAP transitions.

## Bans honored (impeccable)
No eyebrow-chip grammar repeated per section; no numbered markers outside real sequences (Process only); no gradient text; glass only as accent; cards max ~16px radius except the owner's capsule/section surfaces; display clamp ≤6rem.
