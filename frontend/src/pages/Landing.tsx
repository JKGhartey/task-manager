import { Contact } from "@/components/landing/Contact";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}
