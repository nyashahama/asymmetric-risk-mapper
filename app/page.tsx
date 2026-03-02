import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FourBucketsSection } from "@/components/landing/FourBucketsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <LandingNav />
      <HeroSection />
      <HowItWorksSection />
      <FourBucketsSection />
      <TestimonialsSection />
      <PricingSection />
      <LandingFooter />
    </div>
  );
}
