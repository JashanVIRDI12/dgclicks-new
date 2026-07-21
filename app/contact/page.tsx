import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import ContactExperience from "@/components/contact/ContactExperience";

export const metadata: Metadata = {
  title: "Contact Us | Digi Clicks",
  description:
    "Ready to build something bigger? Get in touch with Digi Clicks for website design, branding, social media, performance marketing, creative design, and AI-powered solutions.",
  openGraph: {
    title: "Contact Digi Clicks",
    description:
      "Tell us about your business and goals — a human reply within one business day.",
    type: "website",
    locale: "en_CA",
  },
};

export default function ContactPage() {
  return (
    <div>
      <main id="main" className="bg-[#070707]">
        <ContactExperience />
      </main>
      <SiteFooter />
    </div>
  );
}
