import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import AboutExperience from "@/components/about/AboutExperience";

export const metadata: Metadata = {
  title: "About Us | Digi Clicks",
  description:
    "Digi Clicks is a digital agency in Caledon, Ontario, bringing 10+ years of industry experience to branding, website development, digital marketing, and creative design.",
  openGraph: {
    title: "Digi Clicks — About Us",
    description:
      "More than a service provider — a growth partner. Meet the team, the process, and what sets us apart.",
    type: "website",
    locale: "en_CA",
  },
};

export default function AboutPage() {
  return (
    <div>
      <main id="main" className="theme-light bg-cloud text-slate">
        <AboutExperience />
      </main>
      <SiteFooter />
    </div>
  );
}
