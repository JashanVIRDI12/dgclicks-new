import { img } from "./images";

/** Reuse a generic blur placeholder for generated homepage photography. */
const blur = img.dashboard.blurDataURL;

function gen(src: string, alt?: string) {
  return {
    src,
    width: 1600,
    height: 900,
    blurDataURL: blur,
    alt,
  };
}

/** Fresh AI-generated homepage photography — Digi Clicks studio shots may include our logo. */
export const homeImg = {
  seo: gen("/images/generated/home-seo-4k.png"),
  web: gen("/images/generated/home-web-4k.png"),
  ads: gen("/images/generated/home-ads-4k.png"),
  social: gen("/images/generated/home-social-4k.png"),
  design: gen("/images/generated/home-design-4k.png"),
  team: gen("/images/generated/home-team-4k.png"),
  freight: gen("/images/generated/serve-freight-4k.png"),
  furniture: gen("/images/generated/serve-furniture-4k.png"),
  restaurant: gen("/images/generated/serve-restaurant-4k.png"),
  realestate: gen("/images/generated/serve-realestate-4k.png"),
  printing: gen("/images/generated/serve-printing-4k.png"),
  trades: gen("/images/generated/serve-trades-4k.png"),
} as const;

export type HomeImage = (typeof homeImg)[keyof typeof homeImg];
