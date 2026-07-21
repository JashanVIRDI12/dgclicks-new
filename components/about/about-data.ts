/* ————————————————————————————————————————————————————————————————
   ABOUT — content for a light-forward, rhythmic studio story. Real
   photography, brand tokens (cobalt / sky), short dark beats
   for punctuation instead of a wall-to-wall black page.
   ———————————————————————————————————————————————————————————————— */

import { bigNumbers } from "@/lib/data";

export const IMG = {
  aboutTeam: "/images/generated/about-studio-team.png",
  aboutWorkshop: "/images/generated/about-workshop.png",
  aboutCollab: "/images/generated/about-collaboration.png",
  aboutRemote: "/images/generated/about-remote.png",
  activeCoach: "/activecoach.png",
  phantom: "/phantom.png",
  smartxUpload: "/smartx.png",
  dashboard: "/images/hero-webgl/dashboard-1280.webp",
  webdev: "/images/hero-webgl/webdev-1280.webp",
  workDesign: "/images/hero-webgl/work-design-1280.webp",
  harrier: "/images/hero-webgl/case-harrier-1280.webp",
  smartx: "/images/webgl/case-smartx.webp",
  workCode: "/images/work-code.jpg",
  workSketch: "/images/work-sketch.jpg",
  workspace: "/images/workspace.jpg",
  officeTeam: "/images/office-team.jpg",
  officeCollab: "/images/office-collab.jpg",
  officeWorkshop: "/images/office-workshop.jpg",
  officeRemote: "/images/office-remote.jpg",
} as const;

export const ACCENT = {
  cobalt: "#2A5FD9",
  sky: "#6FB8F2",
} as const;

export { bigNumbers as LEDGER };

/* — Origin story (light) — */
export const ORIGIN = {
  eyebrow: "Who we are",
  heading: "Every business deserves a digital presence built for its ambition.",
  paragraphs: [
    "At Digi Clicks, we believe every business deserves a digital presence that reflects the quality of its work, the strength of its vision, and the ambition behind its growth.",
    "We partner with organizations to create digital experiences through strategic thinking, thoughtful design, and innovative solutions — from websites and branding to content and digital engagement, every project approached with a commitment to excellence and long-term value.",
  ],
  quote: "We help businesses establish credibility, strengthen their presence, and create lasting connections.",
  image: IMG.aboutWorkshop,
  alt: "Roadmap and funnel sketches on the studio wall",
};

/* — Studio & bench diptych (image-dark, section frame stays light) — */
export type StudioPanel = {
  key: string;
  heading: string;
  kicker: string;
  image: string;
  alt: string;
  roles: string;
  note: string;
};

export const STUDIO_PANELS: StudioPanel[] = [
  {
    key: "studio",
    heading: "Caledon, Ontario",
    kicker: "The studio",
    image: IMG.aboutTeam,
    alt: "Team gathered around laptops in the Caledon studio",
    roles: "Strategy · client calls · growth reviews",
    note: "Every plan is argued out loud in this room before it becomes a ticket.",
  },
  {
    key: "bench",
    heading: "Everywhere else",
    kicker: "The remote bench",
    image: IMG.aboutRemote,
    alt: "Remote teammate reviewing a build over a laptop",
    roles: "Design · build · tracking · creative",
    note: "Specialists working from different locations keep shipping after the studio lights go off.",
  },
];

/* — Process chapters (light cards) — */
export type ProcessChapter = {
  num: string;
  title: string;
  line: string;
  accent: string;
  deliverable: string;
  meta: string;
  image: string;
};

export const PROCESS: ProcessChapter[] = [
  {
    num: "01",
    title: "Discovery",
    line: "We learn about your business, goals, audience, challenges, and opportunities.",
    accent: ACCENT.cobalt,
    deliverable: "Business & goals discovery",
    meta: "Kickoff",
    image: IMG.aboutWorkshop,
  },
  {
    num: "02",
    title: "Research",
    line: "We analyze your industry, competitors, and market position to uncover strategic advantages.",
    accent: ACCENT.sky,
    deliverable: "Industry & competitor analysis",
    meta: "Analysis",
    image: IMG.dashboard,
  },
  {
    num: "03",
    title: "Strategy",
    line: "A customized roadmap is developed to align every creative and digital decision with your objectives.",
    accent: ACCENT.cobalt,
    deliverable: "Customized growth roadmap",
    meta: "Planning",
    image: IMG.aboutTeam,
  },
  {
    num: "04",
    title: "Execution",
    line: "Our team designs, develops, creates, and launches with precision and transparency.",
    accent: ACCENT.sky,
    deliverable: "Design, build & launch",
    meta: "Build",
    image: IMG.webdev,
  },
  {
    num: "05",
    title: "Optimization",
    line: "We continuously refine and improve performance through data-driven adjustments.",
    accent: ACCENT.cobalt,
    deliverable: "Data-driven refinement",
    meta: "Refine",
    image: IMG.workDesign,
  },
  {
    num: "06",
    title: "Growth",
    line: "With strong foundations in place, we help businesses scale confidently into new opportunities.",
    accent: ACCENT.sky,
    deliverable: "Confident, ongoing scaling",
    meta: "Scale",
    image: IMG.aboutRemote,
  },
];

/* — Proof photography (light section) — */
export type ProofShot = {
  image: string;
  label: string;
  meta: string;
  accent: string;
  span: string;
  ratio: string;
};

/* — What sets us apart — */
export type ApartPoint = { title: string; note: string };

export const WHAT_SETS_APART: ApartPoint[] = [
  {
    title: "10+ years of industry experience",
    note: "Over a decade of experience across branding, website development, digital marketing, and creative design, delivering solutions backed by proven expertise.",
  },
  {
    title: "Market research & competitive analysis",
    note: "Every project begins with understanding your industry, competitors, and target audience, allowing us to build strategies based on insights rather than assumptions.",
  },
  {
    title: "Complete transparency",
    note: "From project timelines and milestones to reporting and communication, we keep you informed at every stage with complete clarity and accountability.",
  },
  {
    title: "Faster turnaround time",
    note: "Efficient workflows and streamlined project management enable us to deliver high-quality work without unnecessary delays.",
  },
  {
    title: "Tailored solutions, never templates",
    note: "Every business is different — we create customized strategies and designs that align with your goals instead of one-size-fits-all solutions.",
  },
  {
    title: "End-to-end digital expertise",
    note: "From branding and websites to SEO, performance marketing, social media, and creative design — every aspect of your digital presence, under one experienced team.",
  },
];

/* — Industries we serve — */
export const INDUSTRIES: string[] = [
  "Construction",
  "Real Estate",
  "Healthcare",
  "Legal Firms",
  "Restaurants & Cafés",
  "Automotive",
  "Manufacturing",
  "Retail & E-commerce",
  "Professional Services",
  "Home Services",
  "Education",
];

export const PROOF: ProofShot[] = [
  { image: IMG.aboutTeam, label: "The bench", meta: "Caledon, Ontario", accent: ACCENT.cobalt, span: "md:col-span-7", ratio: "16 / 10" },
  { image: IMG.aboutWorkshop, label: "Funnel sketches", meta: "Roadmap wall", accent: ACCENT.sky, span: "md:col-span-5", ratio: "16 / 10" },
  { image: IMG.activeCoach, label: "Active Coachlines", meta: "8 → 140+ enquiries", accent: ACCENT.cobalt, span: "md:col-span-4", ratio: "4 / 5" },
  { image: IMG.phantom, label: "Phantom Logistics", meta: "Search to quote", accent: ACCENT.sky, span: "md:col-span-4", ratio: "4 / 5" },
  { image: IMG.aboutCollab, label: "Two-up review", meta: "Weekly loop", accent: ACCENT.cobalt, span: "md:col-span-4", ratio: "4 / 5" },
  { image: IMG.smartxUpload, label: "SmartX Logistics", meta: "Brand-led enquiry path", accent: ACCENT.cobalt, span: "md:col-span-12", ratio: "21 / 9" },
];

/* — Systems / capability artifacts (light section) — */
export type SystemArtifact = {
  image: string;
  title: string;
  spec: string;
  note: string;
  accent: string;
};

export const SYSTEMS: SystemArtifact[] = [
  { image: IMG.workCode, title: "Engineering", spec: "Next.js 14 · TypeScript", note: "Component-driven builds, shipped from a real branch, not a page builder.", accent: ACCENT.sky },
  { image: IMG.workSketch, title: "Wireframes", spec: "Figma · low → high fidelity", note: "Every screen argued on paper before a line of code is written.", accent: ACCENT.cobalt },
  { image: IMG.dashboard, title: "Measurement", spec: "0.8s load · Lighthouse 98", note: "Speed and events wired at launch — every number has a source.", accent: ACCENT.cobalt },
  { image: IMG.workDesign, title: "Design system", spec: "Brand kit · one source of truth", note: "One kit across ad, deck, and page so the brand never looks improvised.", accent: ACCENT.sky },
];
