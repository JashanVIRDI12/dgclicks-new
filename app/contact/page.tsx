import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import ContactExperience from "@/components/contact/ContactExperience";

export const metadata: Metadata = {
  title: "Start a growth work order | DG Clicks Canada",
  description:
    "Tell DG Clicks where growth is leaking. Start a plain-language work order — a human reply within one business day and a free growth audit either way.",
  openGraph: {
    title: "Tell us where it leaks | DG Clicks",
    description:
      "Start with the problem and the business context. DG Clicks replies within one business day.",
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
