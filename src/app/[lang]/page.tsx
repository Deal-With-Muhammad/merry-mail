import { DeadlineBanner } from "@/components/home/deadline";
import { Hero } from "@/components/home/hero";
import { QuickStart } from "@/components/home/quick-start";
import {
  AboutSnippet,
  Compare,
  ContactStrip,
  FaqPreview,
  FeaturedDesigns,
  HowItWorks,
  NewsletterSection,
  PaperOptions,
  Pricing,
  Stats,
  TeamSection,
  Testimonials,
} from "@/components/home/sections";
import { Showcase } from "@/components/home/showcase";
import { pageMetadata } from "@/i18n/metadata";

export function generateMetadata({ params }: PageProps<"/[lang]">) {
  return pageMetadata(params, "home");
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickStart />
      <Stats />
      <HowItWorks />
      <FeaturedDesigns />
      <Showcase />
      <DeadlineBanner />
      <PaperOptions />
      <Pricing />
      <Compare />
      <AboutSnippet />
      <TeamSection />
      <Testimonials />
      <FaqPreview />
      <NewsletterSection />
      <ContactStrip />
    </>
  );
}
