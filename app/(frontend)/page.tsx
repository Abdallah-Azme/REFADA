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
import { heroApi } from "@/features/home-control/api/hero.api";
import { campsApi } from "@/features/camps/api/camp.api";
import { partnerApi } from "@/features/partners/api/partner.api";

async function getHeroSlides() {
  try {
    const response = await heroApi.get();
    return response.data.slides || [];
  } catch (error) {
    console.error("Failed to fetch hero slides:", error);
    return [];
  }
}

async function getCamps() {
  try {
    const response = await campsApi.getAll();
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch camps:", error);
    return [];
  }
}

async function getPartners() {
  try {
    const response = await partnerApi.getAll();
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    return [];
  }
}

export default async function Home() {
  const slides = await getHeroSlides();
  const camps = await getCamps();
  const partners = await getPartners();

  return (
    <main className="flex flex-col gap-6 mt-10">
      <Hero slides={slides} />
      <div className="-mb-20 z-10">
        <Stats />
      </div>
      <AboutSection />
      <div className="-mt-20 z-10">
        <PolicySection />
        <PartnersSection partners={partners} />
      </div>
      <CampsSection camps={camps} />
      <CampsMapSection />
      <ShelterProjectsSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
