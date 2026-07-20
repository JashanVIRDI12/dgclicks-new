/* ————————————————————————————————————————————————————————————————
   ABOUT — "The Studio Exhibition". Content for an immersive narrative,
   not an about page. Copy is spare on purpose; the visuals do the
   talking. Palette is brand-adjacent: electric blue, sky, lime,
   violet, amber, chrome.
   ———————————————————————————————————————————————————————————————— */

export const IMG = {
  webdev: "/images/hero-webgl/webdev-1280.webp",
  dashboard: "/images/hero-webgl/dashboard-1280.webp",
  workDesign: "/images/hero-webgl/work-design-1280.webp",
  harrier: "/images/hero-webgl/case-harrier-1280.webp",
  smartx: "/images/webgl/case-smartx.webp",
  activecoach: "/images/webgl/case-activecoach.webp",
  chw: "/images/webgl/case-chw.webp",
  workCode: "/images/work-code.jpg",
  workSketch: "/images/work-sketch.jpg",
  workspace: "/images/workspace.jpg",
  texture: "/images/hero-texture.jpg",
  restaurant: "/images/serve-restaurant.jpg",
  printing: "/images/serve-printing.jpg",
  realestate: "/images/serve-realestate.jpg",
  furniture: "/images/serve-furniture.jpg",
  trades: "/images/serve-trades.jpg",
  freight: "/images/serve-freight-truck.jpg",
} as const;

export const ACCENT = {
  blue: "#4D9FFF",
  sky: "#6FB8F2",
  lime: "#CEDB58",
  violet: "#9B8CFF",
  amber: "#F2996F",
  chrome: "#D7DEE8",
} as const;

/* — Who we build for — */
export type Audience = {
  num: string;
  title: string;
  line: string;
  tag: string;
  accent: string;
  image: string;
};

export const AUDIENCES: Audience[] = [
  {
    num: "01",
    title: "The operators",
    line: "Fleets, freight, and field services scaling past word-of-mouth into a demand system they can turn up and down.",
    tag: "Logistics · Trades · B2B",
    accent: ACCENT.blue,
    image: IMG.harrier,
  },
  {
    num: "02",
    title: "The local heroes",
    line: "Restaurants, showrooms, and studios claiming their postcode before the national chains notice it exists.",
    tag: "Local · Retail · Hospitality",
    accent: ACCENT.amber,
    image: IMG.restaurant,
  },
  {
    num: "03",
    title: "The challengers",
    line: "Founders who need to look inevitable long before the market agrees — and have the receipts to back it.",
    tag: "Brand · Product · Growth",
    accent: ACCENT.lime,
    image: IMG.workDesign,
  },
];

/* — Process (pinned horizontal chapters) — */
export type ProcessChapter = {
  num: string;
  title: string;
  line: string;
  accent: string;
};

export const PROCESS: ProcessChapter[] = [
  { num: "01", title: "Interrogate", line: "We tear down the funnel, the analytics, and the assumptions until the real leak is on the table.", accent: ACCENT.blue },
  { num: "02", title: "Compose", line: "Positioning, system, and roadmap drawn as one instrument — ranked by expected revenue, dated to be judged.", accent: ACCENT.sky },
  { num: "03", title: "Ship", line: "Pages, campaigns, and tracking go live in weekly sprints, each one measured against the week-one baseline.", accent: ACCENT.lime },
  { num: "04", title: "Compound", line: "Budget flows to winners, losers retire without ceremony, and the Friday report tells the whole truth.", accent: ACCENT.violet },
];

/* — Manifesto lines — */
export const MANIFESTO: { text: string; accentWord?: string }[] = [
  { text: "We don't sell clicks. We build the machine that turns them into booked work.", accentWord: "booked work" },
  { text: "Design is a business instrument, not decoration.", accentWord: "instrument" },
  { text: "If it can't be measured on Friday, it didn't happen.", accentWord: "Friday" },
];

/* — Craft exhibition tiles — mixed images + code-drawn mockups — */
export type CraftTile = {
  id: string;
  label: string;
  kind: "image" | "browser" | "analytics" | "brand" | "flow";
  image?: string;
  accent: string;
  span: string; // tailwind grid span classes
};

export const CRAFT: CraftTile[] = [
  { id: "interface", label: "Interface", kind: "browser", accent: ACCENT.blue, span: "md:col-span-3 md:row-span-2" },
  { id: "type", label: "Type system", kind: "brand", accent: ACCENT.amber, span: "md:col-span-3 md:row-span-2" },
  { id: "code", label: "Engineering", kind: "image", image: IMG.workCode, accent: ACCENT.sky, span: "md:col-span-2 md:row-span-2" },
  { id: "data", label: "Measurement", kind: "analytics", accent: ACCENT.lime, span: "md:col-span-4" },
  { id: "sketch", label: "Wireframes", kind: "image", image: IMG.workSketch, accent: ACCENT.chrome, span: "md:col-span-2 md:row-span-2" },
  { id: "texture", label: "Material", kind: "image", image: IMG.texture, accent: ACCENT.violet, span: "md:col-span-2" },
  { id: "flow", label: "Automation", kind: "flow", accent: ACCENT.violet, span: "md:col-span-4" },
  { id: "campaign", label: "Campaign", kind: "image", image: IMG.workDesign, accent: ACCENT.amber, span: "md:col-span-2 md:row-span-2" },
];

/* — Technology ecosystem nodes — */
export type TechNode = {
  id: string;
  label: string;
  angle: number; // degrees around the core
  accent: string;
};

export const TECH_CORE = "Growth Engine";
export const TECH_NODES: TechNode[] = [
  { id: "next", label: "Next.js", angle: -90, accent: ACCENT.chrome },
  { id: "gsap", label: "GSAP", angle: -45, accent: ACCENT.lime },
  { id: "ai", label: "AI Automation", angle: 0, accent: ACCENT.violet },
  { id: "analytics", label: "Analytics", angle: 45, accent: ACCENT.sky },
  { id: "seo", label: "Search", angle: 90, accent: ACCENT.blue },
  { id: "cro", label: "CRO", angle: 135, accent: ACCENT.amber },
  { id: "perf", label: "Performance", angle: 180, accent: ACCENT.sky },
  { id: "report", label: "Reporting", angle: 225, accent: ACCENT.lime },
];

/* — Creative wall — the closing gallery — */
export const WALL: { image: string; label: string }[] = [
  { image: IMG.workDesign, label: "Brand system" },
  { image: IMG.dashboard, label: "Reporting" },
  { image: IMG.webdev, label: "Build" },
  { image: IMG.workSketch, label: "Concept" },
  { image: IMG.harrier, label: "Paid — Harrier" },
  { image: IMG.texture, label: "Material study" },
  { image: IMG.smartx, label: "SEO — Phantom" },
  { image: IMG.workCode, label: "Engineering" },
  { image: IMG.printing, label: "Print" },
  { image: IMG.workspace, label: "Studio" },
  { image: IMG.furniture, label: "Retail" },
  { image: IMG.realestate, label: "Property" },
];
