import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import ServicesShowcase from "@/components/services/ServicesShowcase";

export const metadata: Metadata = {
  title: "Growth services with measurable outputs | DG Clicks Canada",
  description:
    "Twenty connected growth disciplines — design, build, brand, search, paid, and automation — measured against qualified enquiries, not surface-level activity.",
  openGraph: {
    title: "DG Clicks services — everything a brand needs to grow",
    description:
      "An editorial index of twenty connected growth services, one accountable team, one Friday report.",
    type: "website",
    locale: "en_CA",
  },
};

export default function ServicesPage() {
  return (
    <main id="main" className="bg-[#070707] text-white">
      <ServicesShowcase />
      <SiteFooter />
    </main>
  );
}
