import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import Hero from "@/components/Hero";
import { AboutUsParallax } from "@/components/AboutUsParallax";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { ContactSection } from "@/components/ContactSection";
import {
  PricingSection,
  QrDownloadSection,
} from "@/components/HomeSections";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* Full-viewport India hero with scroll-driven zoom/fade */}
      <Hero />

      {/* About Us parallax section */}
      <AboutUsParallax />

      {/* Services showcase — horizontal scrolling cards */}
      <ServicesShowcase />

      {/* Contact Us section */}
      <ContactSection />

      <main className="mx-auto max-w-[1320px] px-6 pt-16 pb-16">
        <PricingSection />
        <QrDownloadSection />
      </main>

      <Footer />
    </div>
  );
}
