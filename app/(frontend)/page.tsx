import dynamic from "next/dynamic";
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
import { testimonialApi } from "@/features/testimonials/api/testimonial.api";
import { HomePageData } from "@/features/home-control/types/hero.schema";
import AddFamilyDialog from "@/src/features/dashboard/components/add-family-dialog";
import { FamilyFormDialog } from "@/src/features/families/components/family-form-dialog";

async function getHomePageData(): Promise<HomePageData> {
  try {
    const response = await heroApi.get();
    return response.data;
  } catch (error) {
    return {
      slides: [],
      campsCount: 0,
      contributorsCount: 0,
      projectsCount: 0,
      familiesCount: 0,
    };
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
    return [];
  }
}

async function getTestimonials() {
  try {
    const response = await testimonialApi.getAll();
    return response.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const homePageData = await getHomePageData();
  console.log({ homePageData });
  const slides = homePageData.slides || [];
  const camps = await getCamps();
  const partners = await getPartners();
  const testimonials = await getTestimonials();

  return (
    <main className="flex flex-col gap-6 mt-10">
      <Hero slides={slides} />
      <div className="-mb-20 z-10">
        <Stats
          projectsCount={homePageData.projectsCount || 0}
          familiesCount={homePageData.familiesCount || 0}
          contributorsCount={homePageData.contributorsCount || 0}
          campsCount={homePageData.campsCount || 0}
          ageGroupsCount={homePageData.ageGroupsCount}
        />
      </div>
      <AboutSection
        title={homePageData.title?.ar}
        description={homePageData.description?.ar}
      />
      <div className="-mt-20 z-10">
        <PolicySection sections={homePageData.sections} />
        <PartnersSection partners={partners} />
      </div>
      <CampsSection camps={camps} />
      <CampsMapSection camps={camps} />
      <ShelterProjectsSection
        projects={camps.flatMap(
          (c) => c.projects?.map((p) => ({ ...p, campName: c.name })) || []
        )}
      />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
    </main>
  );
}
