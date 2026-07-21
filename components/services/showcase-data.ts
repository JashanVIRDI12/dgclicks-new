/* ————————————————————————————————————————————————————————————————
   SERVICES SHOWCASE — the full Digi Clicks growth ecosystem.
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
  webdev: "/images/generated/home-web-4k.png",
  seo: "/images/generated/home-seo-4k.png",
  paidAds: "/images/generated/home-ads-4k.png",
  branding: "/images/generated/home-design-4k.png",
  ai: "/images/generated/home-web-4k.png",
  uiUx: "/images/generated/home-web-4k.png",
  copywriting: "/images/generated/home-design-4k.png",
  localSeo: "/images/generated/home-seo-4k.png",
  metaAds: "/images/generated/home-social-4k.png",
  googleAds: "/images/generated/home-ads-4k.png",
  content: "/images/generated/home-social-4k.png",
  social: "/images/generated/home-social-4k.png",
  email: "/images/generated/home-design-4k.png",
  landing: "/images/generated/home-web-4k.png",
  cro: "/images/generated/home-ads-4k.png",
  analytics: "/images/generated/home-seo-4k.png",
  performance: "/images/generated/home-ads-4k.png",
  strategy: "/images/generated/home-team-4k.png",
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
    image: IMG.seo,
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
    image: IMG.paidAds,
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
    image: IMG.branding,
    featured: "brand",
  },
  {
    id: "ai-automation",
    num: "05",
    name: "AI-Powered Solutions",
    category: "Systems",
    accent: A.violet,
    blurb: "Helping your business work smarter with AI.",
    copy: "AI strategy, custom workflows, business knowledge assistants, and AI-accelerated content — practical automation that improves customer experience and decision-making.",
    cta: "Explore AI solutions",
    image: IMG.ai,
    featured: "flow",
  },

  // — The wider index —
  { id: "website-design", num: "06", name: "Website Design", category: "Design", accent: A.blue, blurb: "Interfaces designed around one useful action.", cta: "Learn more", image: IMG.landing },
  { id: "ui-ux", num: "07", name: "UI / UX Design", category: "Design", accent: A.sky, blurb: "Flows tested against real behaviour, not opinion.", cta: "Learn more", image: IMG.uiUx },
  { id: "graphic-design", num: "08", name: "Graphic Design", category: "Brand", accent: A.amber, blurb: "Campaign creative that holds its shape everywhere.", cta: "Learn more", image: IMG.branding },
  { id: "copywriting", num: "09", name: "Copywriting", category: "Brand", accent: A.chrome, blurb: "Words that carry the offer, not the ego.", cta: "Learn more", image: IMG.copywriting },
  { id: "local-seo", num: "10", name: "Local SEO", category: "Growth", accent: A.sky, blurb: "Own the map pack in the towns that matter.", cta: "Learn more", image: IMG.localSeo },
  { id: "meta-ads", num: "11", name: "Meta Ads", category: "Growth", accent: A.lime, blurb: "Feed-native creative that earns the thumb-stop.", cta: "Learn more", image: IMG.metaAds },
  { id: "google-ads", num: "12", name: "Google Ads", category: "Growth", accent: A.cobalt, blurb: "Intent captured the moment it's expressed.", cta: "Learn more", image: IMG.googleAds },
  { id: "content-strategy", num: "13", name: "Content Strategy", category: "Growth", accent: A.chrome, blurb: "A publishing rhythm tied to buyer questions.", cta: "Learn more", image: IMG.content },
  { id: "social-media", num: "14", name: "Social Media", category: "Growth", accent: A.violet, blurb: "Attention converted into buyer signals.", cta: "Learn more", image: IMG.social },
  { id: "email-marketing", num: "15", name: "Email Marketing", category: "Growth", accent: A.sky, blurb: "Automations that follow up so you don't have to.", cta: "Learn more", image: IMG.email },
  { id: "landing-pages", num: "16", name: "Landing Pages", category: "Build", accent: A.blue, blurb: "Single-minded pages that match the ad promise.", cta: "Learn more", image: IMG.landing },
  { id: "cro", num: "17", name: "Conversion Optimization", category: "Optimize", accent: A.lime, blurb: "Tested changes, measured against the baseline.", cta: "Learn more", image: IMG.cro },
  { id: "analytics", num: "18", name: "Analytics & Reporting", category: "Optimize", accent: A.cobalt, blurb: "Clear reporting you can actually trust.", cta: "Learn more", image: IMG.analytics },
  { id: "performance", num: "19", name: "Performance Optimization", category: "Optimize", accent: A.sky, blurb: "Speed as a ranking factor and a closing factor.", cta: "Learn more", image: IMG.performance },
  { id: "marketing-strategy", num: "20", name: "Marketing Strategy", category: "Growth", accent: A.amber, blurb: "The plan that decides where the budget goes.", cta: "Learn more", image: IMG.strategy },
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
