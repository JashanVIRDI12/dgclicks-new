export type ServiceTone = "cloud" | "night" | "mist" | "azure" | "void";

export type ServicePageItem = {
  id: string;
  index: string;
  name: string;
  short: string;
  accent: string;
  tone: ServiceTone;
  outcome: string;
  headline: string;
  copy: string;
  measure: string;
  proof: string;
  deliverables: readonly [string, string, string, string];
  visual: "seo" | "web" | "ads" | "smm" | "graphic";
};

export const SERVICE_PAGE: readonly ServicePageItem[] = [
  {
    id: "seo",
    index: "01",
    name: "SEO",
    short: "Search",
    accent: "#2A5FD9",
    tone: "cloud",
    outcome: "Get found first.",
    headline: "Own the searches that already carry buying intent.",
    copy: "Be found when a buyer is already looking for the work you do. We repair technical gaps, map commercial intent, and publish pages that keep earning visibility after the campaign ends.",
    measure: "Ranking movement tied to calls and forms",
    proof: "63 page-one keywords — freight search outcome",
    deliverables: [
      "Commercial keyword and intent map",
      "Technical search fixes shipped",
      "Conversion-led service pages",
      "Monthly ranking and pipeline review",
    ],
    visual: "seo",
  },
  {
    id: "website-design",
    index: "02",
    name: "Website Development",
    short: "Web",
    accent: "#6FB8F2",
    tone: "night",
    outcome: "A shorter route to enquiry.",
    headline: "Build the site around the next useful action.",
    copy: "We plan, write, and build a fast, accessible site that answers buyer questions and makes the next step obvious — with forms and analytics working at launch.",
    measure: "Path from landing page to qualified enquiry",
    proof: "0.8s median load — DG Clicks build standard",
    deliverables: [
      "Positioning-led page architecture",
      "Responsive, accessible development",
      "Conversion-focused copy direction",
      "Forms and analytics live at launch",
    ],
    visual: "web",
  },
  {
    id: "paid-ads",
    index: "03",
    name: "Paid Ads",
    short: "Ads",
    accent: "#CEDB58",
    tone: "cloud",
    outcome: "Spend that answers for itself.",
    headline: "Put budget behind demand you can prove.",
    copy: "Campaigns, landing pages, and follow-up are tuned as one system so qualified leads move faster and wasted spend has nowhere to hide. Your Friday report connects spend to calls, forms, and booked work.",
    measure: "Spend divided by qualified leads",
    proof: "8 → 140+ enquiries/mo — Active Coachlines",
    deliverables: [
      "Account and wasted-spend audit",
      "Search and social campaign build",
      "Message-matched landing pages",
      "Weekly bid, budget, and creative review",
    ],
    visual: "ads",
  },
  {
    id: "social-media-management",
    index: "04",
    name: "Social Media Management",
    short: "Social",
    accent: "#9B8CFF",
    tone: "void",
    outcome: "Visible without a treadmill.",
    headline: "Turn real work into reasons to follow.",
    copy: "We turn finished jobs, client proof, and useful expertise into a steady social presence — measured by saves, replies, site visits, and enquiries, not a rising follower count alone.",
    measure: "Useful engagement that moves beyond the feed",
    proof: "4-week publishing rhythm — planned cadence",
    deliverables: [
      "Monthly editorial direction",
      "Platform-native content system",
      "Capture prompts for your team",
      "Performance review and next-month plan",
    ],
    visual: "smm",
  },
  {
    id: "graphic-design",
    index: "05",
    name: "Graphic Design",
    short: "Design",
    accent: "#F2996F",
    tone: "azure",
    outcome: "Recognition at a glance.",
    headline: "Build a brand people can pick out before the logo appears.",
    copy: "A disciplined visual system gives sales decks, campaigns, and day-to-day collateral one voice — with templates your team can keep using without the brand looking improvised.",
    measure: "Consistency across every sales touchpoint",
    proof: "1 system, every touchpoint",
    deliverables: [
      "Brand system and usage direction",
      "Campaign creative toolkit",
      "Sales deck and proposal templates",
      "Production-ready asset library",
    ],
    visual: "graphic",
  },
] as const;

export const COMPOUND_STEPS = [
  { id: "seo", label: "Search finds intent" },
  { id: "website-design", label: "Site converts it" },
  { id: "paid-ads", label: "Ads amplify it" },
  { id: "social-media-management", label: "Social proves it" },
  { id: "graphic-design", label: "Design unifies it" },
] as const;
