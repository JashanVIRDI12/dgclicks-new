/* ————————————————————————————————————————————————————————————————
   SERVICES SHOWCASE — the full DG Clicks growth ecosystem.
   Twenty disciplines, five of them promoted to full editorial spreads.
   Copy is written to sound confident and specific, never generic SaaS.
   ———————————————————————————————————————————————————————————————— */

export type ServiceCategory =
  | "Design"
  | "Build"
  | "Brand"
  | "Growth"
  | "Optimize"
  | "Systems";

export type FeaturedVisual = "browser" | "analytics" | "ads" | "brand" | "flow";

export type ShowcaseService = {
  id: string;
  num: string;
  name: string;
  category: ServiceCategory;
  accent: string;
  /** One-line editorial blurb. */
  blurb: string;
  /** Longer benefit copy — featured tiles only. */
  copy?: string;
  cta: string;
  image: string;
  /** Present only for the five promoted spreads. */
  featured?: FeaturedVisual;
};

const IMG = {
  webdev: "/images/hero-webgl/webdev-1280.webp",
  dashboard: "/images/hero-webgl/dashboard-1280.webp",
  workDesign: "/images/hero-webgl/work-design-1280.webp",
  harrier: "/images/hero-webgl/case-harrier-1280.webp",
  officeTeam: "/images/hero-webgl/office-team-1280.webp",
  smartx: "/images/webgl/case-smartx.webp",
  activecoach: "/images/webgl/case-activecoach.webp",
  chw: "/images/webgl/case-chw.webp",
  workCode: "/images/work-code.jpg",
  workSketch: "/images/work-sketch.jpg",
  workspace: "/images/workspace.jpg",
  officeWorkshop: "/images/office-workshop.jpg",
  officeCollab: "/images/office-collab.jpg",
  officeRemote: "/images/office-remote.jpg",
  restaurant: "/images/serve-restaurant.jpg",
  printing: "/images/serve-printing.jpg",
  realestate: "/images/serve-realestate.jpg",
  trades: "/images/serve-trades.jpg",
  texture: "/images/hero-texture.jpg",
} as const;

// Brand-adjacent accent palette — electric blue, lime, sky, violet, amber, chrome.
const A = {
  blue: "#4D9FFF",
  cobalt: "#2A5FD9",
  lime: "#CEDB58",
  sky: "#6FB8F2",
  violet: "#9B8CFF",
  amber: "#F2996F",
  chrome: "#D7DEE8",
} as const;

export const SHOWCASE: ShowcaseService[] = [
  {
    id: "website-development",
    num: "01",
    name: "Website Development",
    category: "Build",
    accent: A.blue,
    blurb: "Fast, accessible builds engineered around the next click.",
    copy: "We ship sites that load in under a second and answer the buyer's question before they scroll. Component-driven, CMS-ready, analytics wired at launch.",
    cta: "Explore service",
    image: IMG.webdev,
    featured: "browser",
  },
  {
    id: "seo",
    num: "02",
    name: "Search Engine Optimization",
    category: "Growth",
    accent: A.sky,
    blurb: "Rankings that keep paying rent after the campaign ends.",
    copy: "Technical fixes shipped, commercial intent mapped, pages that compound. We measure movement against calls and forms — not vanity keyword counts.",
    cta: "See the method",
    image: IMG.dashboard,
    featured: "analytics",
  },
  {
    id: "paid-ads",
    num: "03",
    name: "Paid Advertising",
    category: "Growth",
    accent: A.lime,
    blurb: "Budget behind demand you can actually prove.",
    copy: "Google and Meta tuned as one system — creative, landing page, and follow-up. Spend gets rebalanced weekly against qualified leads, documented in plain English.",
    cta: "View performance",
    image: IMG.harrier,
    featured: "ads",
  },
  {
    id: "branding",
    num: "04",
    name: "Brand Identity",
    category: "Brand",
    accent: A.amber,
    blurb: "A system people recognise before the logo lands.",
    copy: "Logotype, palette, type, and motion built as one disciplined kit — so every ad, deck, and page looks like it came from the same confident business.",
    cta: "See the system",
    image: IMG.workDesign,
    featured: "brand",
  },
  {
    id: "ai-automation",
    num: "05",
    name: "AI Automation",
    category: "Systems",
    accent: A.violet,
    blurb: "Connected workflows that do the busywork for you.",
    copy: "Lead routing, enrichment, replies, and reporting wired into one flow. The machine handles the repeatable so your team keeps the judgement calls.",
    cta: "Map a workflow",
    image: IMG.texture,
    featured: "flow",
  },

  // — The wider index —
  { id: "website-design", num: "06", name: "Website Design", category: "Design", accent: A.blue, blurb: "Interfaces designed around one useful action.", cta: "Learn more", image: IMG.workSketch },
  { id: "ui-ux", num: "07", name: "UI / UX Design", category: "Design", accent: A.sky, blurb: "Flows tested against real behaviour, not opinion.", cta: "Learn more", image: IMG.workCode },
  { id: "graphic-design", num: "08", name: "Graphic Design", category: "Brand", accent: A.amber, blurb: "Campaign creative that holds its shape everywhere.", cta: "Learn more", image: IMG.workDesign },
  { id: "copywriting", num: "09", name: "Copywriting", category: "Brand", accent: A.chrome, blurb: "Words that carry the offer, not the ego.", cta: "Learn more", image: IMG.workSketch },
  { id: "local-seo", num: "10", name: "Local SEO", category: "Growth", accent: A.sky, blurb: "Own the map pack in the towns that matter.", cta: "Learn more", image: IMG.restaurant },
  { id: "meta-ads", num: "11", name: "Meta Ads", category: "Growth", accent: A.lime, blurb: "Feed-native creative that earns the thumb-stop.", cta: "Learn more", image: IMG.workDesign },
  { id: "google-ads", num: "12", name: "Google Ads", category: "Growth", accent: A.cobalt, blurb: "Intent captured the moment it's expressed.", cta: "Learn more", image: IMG.dashboard },
  { id: "content-strategy", num: "13", name: "Content Strategy", category: "Growth", accent: A.chrome, blurb: "A publishing rhythm tied to buyer questions.", cta: "Learn more", image: IMG.officeWorkshop },
  { id: "social-media", num: "14", name: "Social Media", category: "Growth", accent: A.violet, blurb: "Attention converted into buyer signals.", cta: "Learn more", image: IMG.workDesign },
  { id: "email-marketing", num: "15", name: "Email Marketing", category: "Growth", accent: A.sky, blurb: "Automations that follow up so you don't have to.", cta: "Learn more", image: IMG.dashboard },
  { id: "landing-pages", num: "16", name: "Landing Pages", category: "Build", accent: A.blue, blurb: "Single-minded pages that match the ad promise.", cta: "Learn more", image: IMG.webdev },
  { id: "cro", num: "17", name: "Conversion Optimization", category: "Optimize", accent: A.lime, blurb: "Tested changes, measured against the baseline.", cta: "Learn more", image: IMG.dashboard },
  { id: "analytics", num: "18", name: "Analytics & Reporting", category: "Optimize", accent: A.cobalt, blurb: "One Friday report you can actually trust.", cta: "Learn more", image: IMG.smartx },
  { id: "performance", num: "19", name: "Performance Optimization", category: "Optimize", accent: A.sky, blurb: "Speed as a ranking factor and a closing factor.", cta: "Learn more", image: IMG.workCode },
  { id: "marketing-strategy", num: "20", name: "Marketing Strategy", category: "Growth", accent: A.amber, blurb: "The plan that decides where the budget goes.", cta: "Learn more", image: IMG.officeTeam },
];

export const FEATURED = SHOWCASE.filter((s) => s.featured);
export const CATEGORIES: ServiceCategory[] = [
  "Design",
  "Build",
  "Brand",
  "Growth",
  "Optimize",
  "Systems",
];
