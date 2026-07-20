export type ControlServiceId =
  | "seo"
  | "website-design"
  | "paid-ads"
  | "social-media-management"
  | "graphic-design";

export type ControlService = {
  id: ControlServiceId;
  name: string;
  shortName: string;
  headline: string;
  description: readonly [string, string];
  deliverables: readonly [string, string, string];
  measure: string;
  layout: "copy-left" | "copy-right" | "wide";
  tone: "cloud" | "ice" | "white" | "night" | "azure";
};

export const CONTROL_SERVICES = [
  {
    id: "seo",
    name: "SEO",
    shortName: "Search",
    headline: "Show up where buying starts.",
    description: [
      "We help your business rank when buyers are ready to call, book, or request a quote.",
      "We fix the site, build the right pages, and report organic calls and forms beside rankings so traffic has to answer for itself.",
    ],
    deliverables: [
      "Technical and local search audit",
      "Buyer-intent pages built to convert",
      "Call, form, and ranking reports",
    ],
    measure: "Ranking movement tied to calls and forms",
    layout: "copy-left",
    tone: "cloud",
  },
  {
    id: "website-design",
    name: "Website Development",
    shortName: "Web",
    headline: "Build the shortest route from visit to enquiry.",
    description: [
      "We plan, write, and build a fast, accessible site that answers buyer questions and makes the next step obvious.",
      "We launch with editing tools, forms, and analytics working, so your team can update the site and see what produces enquiries.",
    ],
    deliverables: [
      "Page plan and conversion-focused copy",
      "Responsive, accessible development",
      "Forms and analytics working at launch",
    ],
    measure: "The path from landing page to qualified enquiry",
    layout: "copy-right",
    tone: "ice",
  },
  {
    id: "paid-ads",
    name: "Paid Ads",
    shortName: "Ads",
    headline: "Make every ad dollar answer for itself.",
    description: [
      "We put budget behind searches and people showing clear buying intent, then cut what fails to produce qualified leads.",
      "Your Friday report connects spend to calls, forms, and booked work—not clicks or impressions alone.",
    ],
    deliverables: [
      "Account audit and campaign rebuild",
      "Message-matched ads and landing pages",
      "Conversion tracking and weekly control",
    ],
    measure: "Spend divided by qualified leads",
    layout: "wide",
    tone: "white",
  },
  {
    id: "social-media-management",
    name: "Social Media Management",
    shortName: "Social",
    headline: "Turn real work into reasons to follow.",
    description: [
      "We turn finished jobs, client proof, and useful expertise into a steady social presence your buyers recognize.",
      "We plan, create, publish, and learn from saves, replies, site visits, and enquiries—not a rising follower count on its own.",
    ],
    deliverables: [
      "Monthly content dispatch board",
      "Platform-ready copy, design, and edits",
      "Publishing and lead-focused reporting",
    ],
    measure: "Useful engagement that moves beyond the feed",
    layout: "wide",
    tone: "night",
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    shortName: "Design",
    headline: "Build a brand people can pick out at a glance.",
    description: [
      "We create a practical visual system that carries the same identity across ads, proposals, social posts, signage, and print.",
      "You get ready-to-use templates and assets that help your team move faster without making the brand look improvised.",
    ],
    deliverables: [
      "Logo, colour, type, and usage system",
      "Campaign and social templates",
      "Sales, print, and digital asset kit",
    ],
    measure: "Recognition and consistency across every touchpoint",
    layout: "copy-left",
    tone: "azure",
  },
] as const satisfies readonly ControlService[];

