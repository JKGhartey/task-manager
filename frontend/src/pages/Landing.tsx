import { Contact } from "@/components/landing/Contact";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Pricing } from "@/components/landing/Pricing";
import { SEO } from "@/components/SEO";
import { Testimonials } from "@/components/landing/Testimonials";

export default function Landing() {
  return (
    <>
      <SEO
        title="TaskManager - Boost Your Team's Productivity | AI-Powered Task Management"
        description="Streamline your workflow and boost productivity with our intuitive task management platform. 10,000+ teams trust us to manage their most important work. Free forever."
        keywords="task management, project management, team collaboration, productivity tools, workflow automation, task tracking, team management, project planning, work management, task organization"
        url="https://taskmanager.com"
        type="website"
      />
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
    </>
  );
}
