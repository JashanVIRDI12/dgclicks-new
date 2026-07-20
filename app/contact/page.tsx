import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import ContactPageExperience from "@/components/contact/ContactPageExperience";

export const metadata: Metadata = {
  title: "Start a growth work order | DG Clicks Canada",
  description:
    "Tell DG Clicks what is blocking growth. Start a plain-language work order for SEO, website development, paid ads, social media management, or graphic design.",
  openGraph: {
    title: "Put the growth leak on the board | DG Clicks",
    description:
      "Start with the problem and the business context. DG Clicks replies within one business day.",
    type: "website",
    locale: "en_CA",
  },
};

export default function ContactPage() {
  return (
    <div>
      <main id="main">
        <ContactPageExperience />
      </main>
      <SiteFooter />
    </div>
  );
}
