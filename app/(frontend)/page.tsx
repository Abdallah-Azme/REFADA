import Hero from "@/components/hero";
import AboutSection from "@/components/pages/home/about-section";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import ContactSection from "@/components/pages/home/contact-section";
import PartnersSection from "@/components/pages/home/partners-section";
import PolicySection from "@/components/pages/home/policy-section";
import CampsSection from "@/components/pages/home/camps-section";
import ShelterProjectsSection from "@/components/pages/home/shelter-projects-section";
import TestimonialsSection from "@/components/pages/home/testimonials-section";
import Stats from "@/components/stats";

export default async function Home() {
  return (
    <main className="flex flex-col gap-6 mt-10">
      <Hero />
      <div className="-mb-20 z-10">
        <Stats />
      </div>
      <AboutSection />
      <div className="-mt-20 z-10">
        <PolicySection />
        <PartnersSection />
      </div>
      <CampsSection />
      <CampsMapSection />
      <ShelterProjectsSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
