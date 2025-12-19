import { z } from "zod";

export const heroSchema = z.object({
  hero_title_ar: z.string().min(2, "العنوان (بالعربية) مطلوب"),
  hero_title_en: z.string().min(2, "العنوان (بالإنجليزي) مطلوب"),
  hero_description_ar: z.string().min(10, "الوصف (بالعربية) مطلوب"),
  hero_description_en: z.string().min(10, "الوصف (بالإنجليزي) مطلوب"),
  hero_subtitle_ar: z.string().optional(),
  hero_subtitle_en: z.string().optional(),
  hero_image: z.any().optional(), // File or string URL
  small_hero_image: z.any().optional(), // File or string URL
  id: z.number().optional(),
});

export type HeroFormValues = z.infer<typeof heroSchema>;

export interface HeroSlide {
  id: number;
  heroTitle: {
    ar: string;
    en: string;
  };
  heroDescription: {
    ar: string;
    en: string;
  };
  heroSubtitle: {
    ar: string;
    en: string;
  };
  heroImage: string | null;
  smallHeroImage: string | null;
}

export interface AgeGroupsCount {
  newborns: number;
  infants: number;
  veryEarlyChildhood: number;
  toddlers: number;
  earlyChildhood: number;
  children: number;
  adolescents: number;
  youth: number;
  youngAdults: number;
  middleAgeAdults: number;
  lateMiddleAge: number;
  seniors: number;
}

export interface LocalizedText {
  ar: string;
  en: string;
}

export interface Section {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  image?: string | null;
}

export interface HomePageData {
  slides: HeroSlide[];
  campsCount: number;
  contributorsCount: number;
  projectsCount: number;
  familiesCount: number;
  ageGroupsCount?: AgeGroupsCount;
  title?: LocalizedText;
  description?: LocalizedText;
  sections?: Section[];
  complaintImage?: string | null;
  contactImage?: string | null;
}
