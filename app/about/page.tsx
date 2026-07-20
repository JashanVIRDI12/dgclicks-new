import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import AboutExperience from "@/components/about/AboutExperience";

export const metadata: Metadata = {
  title: "Inside the studio | DG Clicks",
  description:
    "Not an about page — a scrolling studio exhibition. See who DG Clicks builds for, how the work moves, the craft, the thinking, the ecosystem, and the proof.",
  openGraph: {
    title: "DG Clicks — Inside the studio",
    description:
      "An immersive look at how one growth studio turns attention into booked work, filed as proof every Friday.",
    type: "website",
    locale: "en_CA",
  },
};

export default function AboutPage() {
  return (
    <div>
      <main id="main" className="bg-[#070707] text-white">
        <AboutExperience />
      </main>
      <SiteFooter />
    </div>
  );
}
