# DG Clicks

## What it is
Marketing site for DG Clicks, a digital growth studio offering SEO, Website Development, Paid Ads, Social Media Management, and Graphic Design. ONE studio in Bolton, Ontario, plus a remote team ("the bench") working from different locations — never describe it as two studios or name specific remote cities.

## Register
brand — the site is the product; a visitor's impression is the deliverable.

## Platform
web (Next.js 14 App Router, landing page plus dedicated service, about, and contact routes)

## Audience
Canadian SMB owners in transport, freight, hospitality, and home services who have been burned by vanity-metric agencies. They distrust "impressions" and want revenue proof before a call.

## The page's single job
Get a free growth audit started (`/contact`).

## Voice
Blunt, accountable, around-the-clock. Three physical-object words: a ledger, a Friday report, a dispatch board. Tagline (client-approved): "Clicks are cheap. Clients are the point."

## Constraints
- Font: Bricolage Grotesque for display, Manrope for body/UI, and Azeret Mono for utility labels (variable Google fonts; owner-approved).
- Palette: sky #7EC8E3 / sky-deep #4FA8D8 / mint #B8E6D3 / ink #2B3040 / night #12161F. Sky is an accent, not the default surface; one dark "night" section (Work) breaks the light page.
- Motion: GSAP 3.15 + ScrollTrigger + free club plugins; Lenis smooth scroll on gsap.ticker. Every animation needs a reduced-motion fallback; pinned sections need simplified mobile variants.
- Owner direction: image-forward layouts (all photos in lib/images.ts should be working), alternating capsule rows for services (owner-supplied reference), no section may share another's animation pattern.
