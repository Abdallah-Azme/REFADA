import Hero from "@/components/hero";
import AboutSection from "@/components/pages/home/about-section";
import CampsMapSection from "@/components/pages/home/camps-map-section";
import ContactSection from "@/components/pages/home/contact-section";
import PartnersSection from "@/components/pages/home/partners-section";
import PolicySection from "@/components/pages/home/policy-section";
import ProjectsSection from "@/components/pages/home/projects-section";
import ShelterProjectsSection from "@/components/pages/home/shelter-projects-section";
import TestimonialsSection from "@/components/pages/home/testimonials-section";
import Stats from "@/components/stats";

export default async function Home() {
  return (
    <main className="flex flex-col gap-6 my-10">
      <Hero />
      <Stats />
      <AboutSection />
      <div className="-mt-10 z-10">
        <PolicySection />
        <PartnersSection />
      </div>
      <ProjectsSection />
      <CampsMapSection />
      <ShelterProjectsSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
