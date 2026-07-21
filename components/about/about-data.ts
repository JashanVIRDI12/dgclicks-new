/* ————————————————————————————————————————————————————————————————
   ABOUT — content for an alternating dark → white → dark narrative.
   Real photography over mockups; factual captions; brand accents.
   ———————————————————————————————————————————————————————————————— */

export const IMG = {
  dashboard: "/images/hero-webgl/dashboard-1280.webp",
  webdev: "/images/hero-webgl/webdev-1280.webp",
  workDesign: "/images/hero-webgl/work-design-1280.webp",
  harrier: "/images/hero-webgl/case-harrier-1280.webp",
  smartx: "/images/webgl/case-smartx.webp",
  activecoach: "/images/webgl/case-activecoach.webp",
  workCode: "/images/work-code.jpg",
  workSketch: "/images/work-sketch.jpg",
  workspace: "/images/workspace.jpg",
  officeTeam: "/images/office-team.jpg",
  officeCollab: "/images/office-collab.jpg",
  officeWorkshop: "/images/office-workshop.jpg",
  officeRemote: "/images/office-remote.jpg",
  strategyTable: "/images/brief-strategy-table.png",
  texture: "/images/hero-texture.jpg",
} as const;

export const ACCENT = {
  blue: "#4D9FFF",
  sky: "#6FB8F2",
  lime: "#CEDB58",
  violet: "#9B8CFF",
  amber: "#F2996F",
} as const;

/* — Process chapters (dark, photo per step) — */
export type ProcessChapter = {
  num: string;
  title: string;
  line: string;
  accent: string;
  deliverable: string;
  meta: string;
  image: string;
  shot: string; // caption describing the shot
};

export const PROCESS: ProcessChapter[] = [
  {
    num: "01",
    title: "Interrogate",
    line: "We tear down the funnel, the analytics, and the assumptions until the real leak is on the table.",
    accent: ACCENT.blue,
    deliverable: "Growth audit + leak map",
    meta: "Week 1",
    image: IMG.dashboard,
    shot: "Live analytics teardown — ActiveCoach account",
  },
  {
    num: "02",
    title: "Compose",
    line: "Positioning, system, and roadmap drawn as one instrument — ranked by expected revenue, dated to be judged.",
    accent: ACCENT.sky,
    deliverable: "90-day roadmap with targets",
    meta: "Week 2",
    image: IMG.officeWorkshop,
    shot: "Funnel + roadmap session, Bolton studio",
  },
  {
    num: "03",
    title: "Ship",
    line: "Pages, campaigns, and tracking go live in weekly sprints, each one measured against the week-one baseline.",
    accent: ACCENT.lime,
    deliverable: "Live campaigns + tracking",
    meta: "Weeks 3–6",
    image: IMG.webdev,
    shot: "Build + deploy — production sprint",
  },
  {
    num: "04",
    title: "Compound",
    line: "Budget flows to winners, losers retire without ceremony, and the Friday report tells the whole truth.",
    accent: ACCENT.violet,
    deliverable: "Weekly optimization loop",
    meta: "Ongoing",
    image: IMG.officeRemote,
    shot: "Friday report review with the client",
  },
];

/* — Proof photography (white section) — */
export type ProofShot = {
  image: string;
  label: string;
  meta: string;
  accent: string;
  span: string; // grid span classes
  ratio: string; // aspect-ratio
};

export const PROOF: ProofShot[] = [
  { image: IMG.workspace, label: "The bench", meta: "Bolton, Ontario", accent: ACCENT.blue, span: "md:col-span-7", ratio: "16 / 10" },
  { image: IMG.officeWorkshop, label: "Funnel sketches", meta: "Roadmap wall", accent: ACCENT.amber, span: "md:col-span-5", ratio: "16 / 10" },
  { image: IMG.dashboard, label: "ActiveCoach", meta: "8 → 140+ enquiries", accent: ACCENT.lime, span: "md:col-span-4", ratio: "4 / 5" },
  { image: IMG.webdev, label: "Hands on the build", meta: "Production sprint", accent: ACCENT.sky, span: "md:col-span-4", ratio: "4 / 5" },
  { image: IMG.officeCollab, label: "Two-up review", meta: "Weekly loop", accent: ACCENT.violet, span: "md:col-span-4", ratio: "4 / 5" },
  { image: IMG.harrier, label: "Harrier Transport", meta: "−41% cost / lead", accent: ACCENT.blue, span: "md:col-span-12", ratio: "21 / 9" },
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
  { image: IMG.workSketch, title: "Wireframes", spec: "Figma · low → high fidelity", note: "Every screen argued on paper before a line of code is written.", accent: ACCENT.amber },
  { image: IMG.dashboard, title: "Measurement", spec: "0.8s load · Lighthouse 98", note: "Speed and events wired at launch — the Friday number has a source.", accent: ACCENT.lime },
  { image: IMG.workDesign, title: "Design system", spec: "Bricolage · Manrope · Azeret", note: "One kit across ad, deck, and page so the brand never looks improvised.", accent: ACCENT.violet },
];

/* — Statement copy (dark) — */
export const MANIFESTO: { text: string; accentWord?: string }[] = [
  { text: "We don't sell clicks. We build the machine that turns them into booked work.", accentWord: "booked work" },
  { text: "Design is a business instrument, not decoration.", accentWord: "instrument" },
  { text: "If it can't be measured on Friday, it didn't happen.", accentWord: "Friday" },
];

export const STATEMENT_PHOTO = IMG.officeTeam;
