import { img } from "./images";

export const heroStats = [
  "8 → 140+ qualified enquiries a month for Active Coachlines",
  "5.2× blended ROAS across managed ad accounts",
  "38 conversion-first websites shipped",
  "93% of clients stay past year one",
  "Bolton studio · remote bench · one pipeline",
];

export type Service = {
  id: string;
  title: string;
  outcome: string;
  headline: string;
  copy: string;
  proof: string;
  deliverables: string[];
  image: (typeof img)[keyof typeof img];
  alt: string;
  visual: "seo" | "web" | "ads" | "smm" | "graphic";
};

export const services: Service[] = [
  {
    id: "seo",
    title: "SEO",
    outcome: "Get found first.",
    headline: "Search that keeps paying rent.",
    copy: "Page-one visibility for the searches your buyers actually make — rankings that keep compounding while your ads take the week off.",
    proof: "63 page-one keywords — freight search outcome",
    deliverables: [
      "Keyword & intent map for your actual buyers",
      "Technical fixes shipped, not just listed",
      "Content engine with monthly ranking targets",
    ],
    image: img.dashboard,
    alt: "Analytics dashboard glowing on a laptop screen",
    visual: "seo",
  },
  {
    id: "web",
    title: "Website Development",
    outcome: "A shorter route to enquiry.",
    headline: "Build the site around the next useful action.",
    copy: "We design and build fast, conversion-first websites that explain the offer clearly, remove friction, and make it easy for the right visitor to enquire.",
    proof: "0.8s median load — DG Clicks build standard",
    deliverables: [
      "Page structure built around buyer questions",
      "Responsive development and launch support",
      "Analytics wired before launch day",
    ],
    image: img.webdev,
    alt: "Code editor open on a laptop in a studio",
    visual: "web",
  },
  {
    id: "ads",
    title: "Paid Ads",
    outcome: "Put spend behind proven demand.",
    headline: "Cut the spend that only looks busy.",
    copy: "We plan, launch, and tune Google and Meta campaigns around qualified leads, then rebalance spend every week using the numbers that matter.",
    proof: "−41% cost per lead, Harrier Transport",
    deliverables: [
      "Account teardown and wasted-spend report",
      "Landing pages that match the ad promise",
      "Weekly bid and budget decisions documented",
    ],
    image: img.caseHarrier,
    alt: "A transport truck on an open highway",
    visual: "ads",
  },
  {
    id: "social-media-management",
    title: "Social Media Management",
    outcome: "Turn attention into buyer signals.",
    headline: "Give useful content a commercial job.",
    copy: "We plan, create, publish, and review social content that earns attention from the right audience and gives interested buyers a clear next step.",
    proof: "Measured against enquiries, not applause",
    deliverables: [
      "Channel plan tied to customer questions",
      "Creative production and publishing cadence",
      "Monthly engagement and enquiry review",
    ],
    image: img.workDesign,
    alt: "A designer laying out campaign content on a desk",
    visual: "smm",
  },
  {
    id: "graphic-design",
    title: "Graphic Design",
    outcome: "Build recognition at every handoff.",
    headline: "Make the business easier to recognize.",
    copy: "We create brand systems and campaign graphics that make every ad, post, proposal, and page look like it came from the same confident business.",
    proof: "One visual system across every channel",
    deliverables: [
      "Identity and visual-system foundations",
      "Campaign and social creative production",
      "Practical templates your team can keep using",
    ],
    image: img.workSketch,
    alt: "Website designs displayed across desktop, tablet, and mobile screens",
    visual: "graphic",
  },
];

export type CaseMetric = { value: string; label: string };

export type CaseStudy = {
  client: string;
  sector: string;
  story: string;
  services: string[];
  metrics: [CaseMetric, ...CaseMetric[]];
  image: (typeof img)[keyof typeof img];
  webglImage: {
    src: string;
    mobileSrc: string;
    focal: [number, number];
  };
  alt: string;
};

export const caseStudies: CaseStudy[] = [
  {
    client: "Harrier Transport",
    sector: "Freight & logistics · Canada",
    story:
      "Referrals kept the trucks half-full. Paid search plus rebuilt landing pages turned demand into a dial they control.",
    services: ["Paid Ads", "Landing Pages", "Automation"],
    metrics: [
      { value: "−41%", label: "cost per lead" },
      { value: "Paid", label: "search demand" },
      { value: "Weekly", label: "optimization" },
    ],
    image: img.caseHarrier,
    webglImage: {
      src: "/images/hero-webgl/case-harrier-1280.webp",
      mobileSrc: "/images/hero-webgl/case-harrier-720.webp",
      focal: [0.64, 0.5],
    },
    alt: "Semi truck on an open highway at dusk",
  },
  {
    client: "Active Coachlines",
    sector: "Charter bus company · Canada",
    story:
      "A clearer charter-booking journey brings fleet options, trip details, and quote requests into one focused path.",
    services: ["Website", "Local Search", "Lead Generation"],
    metrics: [
      { value: "8 → 140+", label: "enquiries / month" },
      { value: "Charter", label: "service focus" },
      { value: "Quote", label: "primary action" },
    ],
    image: img.workspace,
    webglImage: {
      src: "/images/hero-webgl/webdev-1280.webp",
      mobileSrc: "/images/hero-webgl/webdev-720.webp",
      focal: [0.53, 0.5],
    },
    alt: "Active Coachlines charter service campaign visual",
  },
  {
    client: "Phantom Logistics",
    sector: "Freight & logistics · Canada",
    story:
      "Freight services are organized around buyer intent so shippers can understand the offer and request capacity faster.",
    services: ["SEO", "Web Development", "Content"],
    metrics: [
      { value: "Freight", label: "market" },
      { value: "SEO", label: "acquisition channel" },
      { value: "Quote", label: "conversion path" },
    ],
    image: img.caseSmartx,
    webglImage: {
      src: "/images/hero-webgl/case-smartx-1280.webp",
      mobileSrc: "/images/hero-webgl/case-smartx-720.webp",
      focal: [0.54, 0.5],
    },
    alt: "Warehouse and freight operations for Phantom Logistics",
  },
  {
    client: "Indian Bistro Barrie",
    sector: "Restaurant · Barrie, Ontario",
    story:
      "A local restaurant presence built to move diners from discovery to menu, directions, and ordering without friction.",
    services: ["Local SEO", "Website", "Social Content"],
    metrics: [
      { value: "Barrie", label: "local market" },
      { value: "Menu", label: "buyer priority" },
      { value: "Order", label: "primary action" },
    ],
    image: img.workDesign,
    webglImage: {
      src: "/images/hero-webgl/work-design-1280.webp",
      mobileSrc: "/images/hero-webgl/work-design-720.webp",
      focal: [0.5, 0.48],
    },
    alt: "Indian Bistro Barrie restaurant campaign visual",
  },
  {
    client: "Bridge for Freight",
    sector: "Freight services · Canada",
    story:
      "A practical digital system that connects freight capabilities, route enquiries, and shipper trust in one consistent experience.",
    services: ["Website", "SEO", "Brand System"],
    metrics: [
      { value: "Freight", label: "market" },
      { value: "Routes", label: "content focus" },
      { value: "Enquire", label: "primary action" },
    ],
    image: img.workspace,
    webglImage: {
      src: "/images/hero-webgl/webdev-1280.webp",
      mobileSrc: "/images/hero-webgl/webdev-720.webp",
      focal: [0.5, 0.5],
    },
    alt: "Freight route planning for Bridge for Freight",
  },
  {
    client: "Sunrise Blinds",
    sector: "Window coverings · Canada",
    story:
      "A local-service journey that makes products easier to compare and guides homeowners toward a consultation or quote.",
    services: ["Website", "Local SEO", "Paid Ads"],
    metrics: [
      { value: "Blinds", label: "product focus" },
      { value: "Local", label: "service area" },
      { value: "Quote", label: "primary action" },
    ],
    image: img.officeCollab,
    webglImage: {
      src: "/images/hero-webgl/office-team-1280.webp",
      mobileSrc: "/images/hero-webgl/office-team-720.webp",
      focal: [0.5, 0.5],
    },
    alt: "Window-covering consultation for Sunrise Blinds",
  },
];

// Flagship growth curve: Active Coachlines monthly enquiries
export const flagshipCurve = [8, 11, 17, 26, 38, 55, 78, 96, 118, 132, 140];

export type ProcessStep = {
  number: string;
  title: string;
  hook: string;
  copy: string;
  deliverable: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Audit",
    hook: "We find the leaks.",
    copy: "Week one: accounts, analytics, and funnel — torn down and mapped. You get a plainspoken list of what's quietly costing you money, whether or not you hire us to fix it.",
    deliverable: "Growth audit + leak map",
  },
  {
    number: "02",
    title: "Roadmap",
    hook: "Bets, ranked.",
    copy: "A 90-day plan ordered by expected revenue impact — not by what's fashionable to build. Every line has a number attached and a date it gets judged on.",
    deliverable: "90-day roadmap with targets",
  },
  {
    number: "03",
    title: "Launch",
    hook: "Ship in sprints.",
    copy: "Campaigns, pages, and tracking go live in weekly sprints. Every change is measured against the baseline we set in week one, so 'it feels better' never counts as a result.",
    deliverable: "Live campaigns + tracking",
  },
  {
    number: "04",
    title: "Scale",
    hook: "Double what works.",
    copy: "Budget flows to winners; losers are retired without ceremony. You get a Friday report in plain English: what moved, why, and what we're doing about it next week.",
    deliverable: "Weekly optimization loop",
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  result: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "harrier-transport",
    quote:
      "DG Clicks took us from praying for referrals to turning ad spend up and down like a tap.",
    name: "Owner",
    role: "Harrier Transport",
    result: "Paid-search demand system",
  },
  {
    id: "active-coachlines",
    quote:
      "Charter options, trip details, and quote requests now follow one clear booking path.",
    name: "Project record",
    role: "Active Coachlines",
    result: "8 → 140+ qualified enquiries/month",
  },
  {
    id: "phantom-logistics",
    quote:
      "Freight capabilities were rebuilt around the searches and questions shippers actually use.",
    name: "Project record",
    role: "Phantom Logistics",
    result: "SEO and freight enquiry system",
  },
  {
    id: "indian-bistro-barrie",
    quote: "Menu, location, and ordering are now easier to reach from local search and social traffic.",
    name: "Project record",
    role: "Indian Bistro Barrie",
    result: "Local restaurant discovery path",
  },
  {
    id: "bridge-for-freight",
    quote: "The digital presence now connects services, routes, and shipper enquiries in one consistent system.",
    name: "Project record",
    role: "Bridge for Freight",
    result: "Freight website and brand system",
  },
  {
    id: "sunrise-blinds",
    quote: "Product discovery now leads homeowners toward a consultation without unnecessary steps.",
    name: "Project record",
    role: "Sunrise Blinds",
    result: "Local quote-generation journey",
  },
];

export type BigNumber = {
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
  note: string;
};

/** The ledger — one line per number the studio is judged on. */
export const bigNumbers: BigNumber[] = [
  {
    value: 5.2,
    decimals: 1,
    suffix: "×",
    label: "blended ROAS",
    note: "across every ad account we manage. Spend in, revenue out, documented in Friday reports.",
  },
  {
    value: 140,
    suffix: "+",
    label: "enquiries a month",
    note: "for Active Coachlines, growing charter enquiries from eight through a clearer acquisition and booking path.",
  },
  {
    value: 93,
    suffix: "%",
    label: "stay past year one",
    note: "because the weekly loop keeps finding upside worth paying for.",
  },
  {
    value: 0.8,
    decimals: 1,
    suffix: "s",
    label: "median load time",
    note: "on every build we ship. Speed is a ranking factor and a closing factor.",
  },
];

export const clientLogos: Array<{
  name: string;
  src: string;
  /** Logos with white/light artwork need a dark tile to stay legible. */
  dark?: boolean;
}> = [
  { name: "Harrier Transport", src: "/logos/harrier-transport.png" },
  { name: "Bridge for Freight", src: "/logos/bridge-for-freight.png", dark: true },
  { name: "Phantom Logistics", src: "/logos/phantom-logistics.png" },
  { name: "Active Coach", src: "/logos/active-coach.png" },
  { name: "Next Level Transport", src: "/logos/next-level-transport.png" },
  { name: "Dee Gee Graphics", src: "/logos/dee-gee-graphics.png", dark: true },
];

export const aboutShots = [
  {
    image: img.officeTeam,
    alt: "Team gathered around laptops in a bright studio",
    caption: "Growth reviews, every Friday",
    speed: 1.06,
  },
  {
    image: img.officeCollab,
    alt: "Two strategists working through a client plan",
    caption: "The Bolton studio",
    speed: 0.94,
  },
  {
    image: img.officeWorkshop,
    alt: "Campaign planning wall covered in notes",
    caption: "Roadmaps, argued out loud",
    speed: 1.08,
  },
  {
    image: img.officeRemote,
    alt: "Team reviewing a build over a laptop",
    caption: "The remote bench",
    speed: 0.92,
  },
];

/** Work grid for the HeroParallax hero — 3 rows of 5. */
export const portfolioItems = [
  { title: "Harrier Transport · Paid Ads", link: "#results", thumbnail: "/images/case-harrier.jpg" },
  { title: "Growth Dashboard · Reporting", link: "#results", thumbnail: "/images/dashboard.jpg" },
  { title: "Active Coachlines · Charter Leads", link: "#results", thumbnail: "/images/workspace.jpg" },
  { title: "Build Pipeline · Web Dev", link: "#services", thumbnail: "/images/webdev.jpg" },
  { title: "Phantom Logistics · SEO", link: "#results", thumbnail: "/images/case-smartx.jpg" },
  { title: "Indian Bistro Barrie · Local", link: "#results", thumbnail: "/images/work-design.jpg" },
  { title: "Conversion Lab · Experiments", link: "#services", thumbnail: "/images/work-code.jpg" },
  { title: "Campaign Studio · Ad Creative", link: "#services", thumbnail: "/images/work-design.jpg" },
  { title: "Brand Sprint · Identity", link: "#services", thumbnail: "/images/work-sketch.jpg" },
  { title: "Bridge for Freight · Web", link: "#results", thumbnail: "/images/workspace.jpg" },
  { title: "Bolton Studio", link: "/about", thumbnail: "/images/office-team.jpg" },
  { title: "Roadmap Sessions · Strategy", link: "#process", thumbnail: "/images/office-workshop.jpg" },
  { title: "Liquid Light · Design System", link: "#services", thumbnail: "/images/hero-texture.jpg" },
  { title: "Remote Bench", link: "/about", thumbnail: "/images/office-remote.jpg" },
  { title: "Sunrise Blinds · Local SEO", link: "#results", thumbnail: "/images/office-collab.jpg" },
];

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
