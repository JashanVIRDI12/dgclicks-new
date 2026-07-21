import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import ServicesShowcase from "@/components/services/ServicesShowcase";

export const metadata: Metadata = {
  title: "Services | Digi Clicks",
  description:
    "Website design & development, brand strategy & identity, social media management, performance marketing, and creative design solutions — one experienced team, twenty connected disciplines.",
  openGraph: {
    title: "Digi Clicks services — everything a brand needs to grow",
    description:
      "An editorial index of twenty connected growth services, delivered by one accountable team.",
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
