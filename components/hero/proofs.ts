export type ProofPlane = {
  id: string;
  src: string;
  mobileSrc: string;
  alt: string;
  client?: string;
  result?: string;
  position: [number, number, number];
  mobilePosition: [number, number, number];
  size: [number, number];
  mobileSize: [number, number];
  rotation: [number, number, number];
  annotationOffset?: [number, number, number];
  mobileAnnotationOffset?: [number, number, number];
  ambient?: boolean;
};

export const HERO_PROOFS: ProofPlane[] = [
  {
    id: "harrier",
    src: "/images/hero-webgl/case-harrier-1280.webp",
    mobileSrc: "/images/hero-webgl/case-harrier-720.webp",
    alt: "Harrier Transport truck on an open highway at dusk",
    client: "Harrier Transport",
    result: "Paid-search demand system",
    position: [3.35, 1.45, 0.75],
    mobilePosition: [1.42, 2.55, 0.72],
    size: [3.05, 1.93],
    mobileSize: [2.3, 1.45],
    rotation: [0.015, -0.075, -0.012],
    annotationOffset: [-0.62, -1.28, 0.12],
    mobileAnnotationOffset: [-0.18, -1.06, 0.12],
  },
  {
    id: "active-coachlines",
    src: "/images/hero-webgl/webdev-1280.webp",
    mobileSrc: "/images/hero-webgl/webdev-720.webp",
    alt: "Campaign visual for Active Coachlines charter bus service",
    client: "Active Coachlines",
    result: "8 → 140+ enquiries/mo",
    position: [3.25, -1.62, 0.05],
    mobilePosition: [1.48, -2.45, -0.05],
    size: [2.8, 1.76],
    mobileSize: [2.2, 1.38],
    rotation: [-0.025, -0.045, 0.01],
    annotationOffset: [-0.28, 1.18, 0.12],
    mobileAnnotationOffset: [-0.12, 0.93, 0.12],
  },
  {
    id: "phantom-logistics",
    src: "/images/hero-webgl/case-smartx-1280.webp",
    mobileSrc: "/images/hero-webgl/case-smartx-720.webp",
    alt: "Warehouse and freight operations for Phantom Logistics",
    client: "Phantom Logistics",
    result: "Freight search system",
    position: [5.55, 2.08, -2.0],
    mobilePosition: [-1.52, 3.15, -1.25],
    size: [3.0, 1.9],
    mobileSize: [2.2, 1.38],
    rotation: [0.01, -0.12, 0.014],
    annotationOffset: [-0.98, -1.24, 0.12],
    mobileAnnotationOffset: [0.15, -0.95, 0.12],
  },
  {
    id: "indian-bistro-barrie",
    src: "/images/hero-webgl/work-design-1280.webp",
    mobileSrc: "/images/hero-webgl/work-design-720.webp",
    alt: "Local campaign visual for Indian Bistro Barrie",
    client: "Indian Bistro Barrie",
    result: "Local discovery to order",
    position: [-5.0, -2.15, -1.6],
    mobilePosition: [-1.48, -3.1, -1.85],
    size: [2.8, 1.76],
    mobileSize: [2.15, 1.35],
    rotation: [-0.018, 0.1, -0.012],
    annotationOffset: [1.1, 1.17, 0.12],
    mobileAnnotationOffset: [0.18, 0.92, 0.12],
  },
  {
    id: "dashboard",
    src: "/images/hero-webgl/dashboard-1280.webp",
    mobileSrc: "/images/hero-webgl/dashboard-720.webp",
    alt: "Paid media performance dashboard",
    position: [-4.75, 2.5, -3.6],
    mobilePosition: [-2.1, 1.35, -3.6],
    size: [2.7, 1.7],
    mobileSize: [1.8, 1.13],
    rotation: [0.035, 0.12, -0.008],
    ambient: true,
  },
  {
    id: "team",
    src: "/images/hero-webgl/office-team-1280.webp",
    mobileSrc: "/images/hero-webgl/office-team-720.webp",
    alt: "DG Clicks team reviewing campaign work",
    position: [5.35, -0.12, -4.6],
    mobilePosition: [2.2, 0.35, -4.6],
    size: [2.6, 1.64],
    mobileSize: [1.8, 1.13],
    rotation: [-0.02, -0.13, 0.012],
    ambient: true,
  },
  {
    id: "webdev",
    src: "/images/hero-webgl/webdev-1280.webp",
    mobileSrc: "/images/hero-webgl/webdev-720.webp",
    alt: "Conversion website code on a studio laptop",
    position: [-4.4, -1.7, -3.0],
    mobilePosition: [-2.15, -0.45, -3.0],
    size: [2.8, 1.76],
    mobileSize: [1.8, 1.13],
    rotation: [-0.018, 0.09, 0.008],
    ambient: true,
  },
  {
    id: "creative",
    src: "/images/hero-webgl/work-design-1280.webp",
    mobileSrc: "/images/hero-webgl/work-design-720.webp",
    alt: "Paid campaign creative being designed",
    position: [0.5, 3.55, -5.4],
    mobilePosition: [0.15, 4.2, -5.4],
    size: [2.45, 1.88],
    mobileSize: [1.7, 1.33],
    rotation: [0.03, -0.025, -0.008],
    ambient: true,
  },
];
