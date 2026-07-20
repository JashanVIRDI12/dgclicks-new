export type ServiceId =
  | "seo"
  | "website-design"
  | "paid-ads"
  | "graphic-design"
  | "social-media-management";

export type ProjectedStat = {
  value: string;
  label: string;
};

export type ServiceComparison = {
  scope: string;
  cadence: string;
  fit: string;
};

export type ServiceDefinition = {
  id: ServiceId;
  name: string;
  headline: string;
  copy:
    | readonly [string, string]
    | readonly [string, string, string];
  deliverables: readonly [string, string, string, string];
  projectedStat: ProjectedStat;
  comparison: ServiceComparison;
};
export const SERVICES = [
  {
    id: "seo",
    name: "SEO",
    headline: "Own the searches that already carry buying intent.",
    copy: [
      "Be found when a buyer is already looking for the work you do.",
      "We repair technical gaps, map commercial intent, and publish pages that keep earning visibility after the campaign ends.",
    ],
    deliverables: [
      "Commercial keyword and intent map",
      "Technical search fixes shipped",
      "Conversion-led service pages",
      "Monthly ranking and pipeline review",
    ],
    projectedStat: {
      value: "63 page-one keywords",
      label: "Freight search outcome",
    },
    comparison: {
      scope: "Technical health, commercial search intent, and conversion pages",
      cadence: "Monthly roadmap with measured shipping cycles",
      fit: "Teams that need durable inbound demand, not a short traffic spike",
    },
  },
  {
    id: "website-design",
    name: "Website Design",
    headline: "Make every page a shorter route to enquiry.",
    copy: [
      "Turn the site into the clearest route from first visit to qualified enquiry.",
      "We pair sharp positioning with fast, accessible interfaces so every page answers the question that would otherwise make a buyer leave.",
    ],
    deliverables: [
      "Positioning-led page architecture",
      "Responsive interface design",
      "Conversion-focused copy direction",
      "Accessible production handoff",
    ],
    projectedStat: {
      value: "0.8s median load",
      label: "DG Clicks build standard",
    },
    comparison: {
      scope: "Positioning, UX, responsive interface, and production handoff",
      cadence: "Focused project with weekly decision and review sessions",
      fit: "Businesses whose current site obscures value or loses enquiries",
    },
  },
  {
    id: "paid-ads",
    name: "Paid Ads",
    headline: "Put spend behind demand you can prove.",
    copy: [
      "Put budget behind demand you can measure, not activity that photographs well in a report.",
      "Campaigns, landing pages, and follow-up are tuned as one system so qualified leads move faster and wasted spend has nowhere to hide.",
    ],
    deliverables: [
      "Account and wasted-spend audit",
      "Search and social campaign build",
      "Message-matched landing pages",
      "Weekly bid, budget, and creative review",
    ],
    projectedStat: {
      value: "8 → 140+ enquiries/mo",
      label: "Recorded Active Coachlines outcome",
    },
    comparison: {
      scope: "Account structure, creative, landing paths, and measurement",
      cadence: "Weekly optimization with a clear monthly learning review",
      fit: "Teams ready to turn active demand into a predictable lead flow",
    },
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    headline: "Build recognition into every sales touchpoint.",
    copy: [
      "Make the business recognizable before the logo even appears.",
      "A disciplined visual system gives sales decks, campaigns, and day-to-day collateral one voice without slowing the team down.",
    ],
    deliverables: [
      "Brand system and usage direction",
      "Campaign creative toolkit",
      "Sales deck and proposal templates",
      "Production-ready asset library",
    ],
    projectedStat: {
      value: "1 system, every touchpoint",
      label: "Planned visual consistency",
    },
    comparison: {
      scope: "Visual system, campaign toolkit, and working brand templates",
      cadence: "Defined sprint, then support as new applications emerge",
      fit: "Growing teams whose materials no longer look or sound connected",
    },
  },
  {
    id: "social-media-management",
    name: "Social Media Management",
    headline: "Stay visible without feeding a content treadmill.",
    copy: [
      "Stay present without feeding a content treadmill.",
      "We build a repeatable editorial rhythm that turns real work, proof, and expertise into useful posts your audience can recognize and trust.",
    ],
    deliverables: [
      "Monthly editorial direction",
      "Platform-native content system",
      "Capture prompts for the internal team",
      "Performance review and next-month plan",
    ],
    projectedStat: {
      value: "4-week publishing rhythm",
      label: "Planned content cadence",
    },
    comparison: {
      scope: "Editorial direction, content production, and performance learning",
      cadence: "Monthly plan with a steady weekly publishing rhythm",
      fit: "Expert teams with real insight but no sustainable content system",
    },
  },
] as const satisfies readonly ServiceDefinition[];

export const services = SERVICES;

export const SERVICE_COUNT = SERVICES.length;
