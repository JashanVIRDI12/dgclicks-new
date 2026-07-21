import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import AISolutions from "@/components/ai-solutions";

export const metadata: Metadata = {
  title: "AI-Powered Solutions | Digi Clicks",
  description:
    "Helping businesses work smarter with AI. AI strategy & consultation, custom AI workflows, business knowledge AI, AI content & marketing, and future-ready integrations.",
  openGraph: {
    title: "AI-Powered Solutions | Digi Clicks",
    description:
      "Automate processes, improve customer experiences, and support smarter decision-making with AI built around your business.",
    type: "website",
    locale: "en_CA",
  },
};

export default function AIPage() {
  return (
    <main id="main" className="bg-[#070707] text-white">
      <AISolutions />
      <SiteFooter />
    </main>
  );
}
