import CaseStudiesShowcase from "@/components/case-studies-showcase";
import FeatureShowcase from "@/components/feature-showcase";
import FinalCta from "@/components/final-cta";
import HomeHero from "@/components/home-hero";
import HowWeScale from "@/components/how-we-scale";
import PartnerLogos from "@/components/partner-logos";
import ServicesInMotion from "@/components/services-in-motion";
import SiteFooter from "@/components/site-footer";
import TechStack from "@/components/tech-stack";
import WhoWeServe from "@/components/who-we-serve";
import WhyBrands from "@/components/why-brands";

export default function Home() {
  return (
    <main id="main" className="theme-light bg-cloud text-slate">
      <HomeHero />
      <PartnerLogos />
      <ServicesInMotion />
      <HowWeScale />
      <FeatureShowcase />
      <WhoWeServe />
      <CaseStudiesShowcase />
      <WhyBrands />
      <TechStack />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
