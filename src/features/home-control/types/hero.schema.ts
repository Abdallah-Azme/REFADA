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
});

export type HeroFormValues = z.infer<typeof heroSchema>;

export interface HeroData {
  id?: number;
  hero_title: string; // Localized from API? Or localized object?
  // API response usually matches the GET structure.
  // The Postman GET response body was empty `[]` in the snippet provided.
  // But typically it returns similar fields.
  // Based on other endpoints, it might return { hero_title: "...", ... } localized if Accept-Language is set.
  // OR it might return { hero_title_ar: "...", hero_title_en: "..." } if requested for editing.
  // Given the `update` payload requires [ar] and [en], we likely need raw data or we need to fetch twice?
  // Usually admin APIs return all translations or we assume standard structure.
  // I'll assume the API returns an object or array containing the keys.
  // If GET /homepage returns a list, and update is /homepage/1, then it returns a collection.
  // I'll define a loose interface for now to adapt to what we find or standard expectation.

  // Actually, let's look at `pages` experience. It returned localized single string.
  // Here we need to edit.
  // I'll define fields as optional strings for now.
  hero_title_ar?: string;
  hero_title_en?: string;
  hero_description_ar?: string;
  hero_description_en?: string;
  hero_subtitle_ar?: string;
  hero_subtitle_en?: string;
  hero_image?: string;
  small_hero_image?: string;

  // Fallback for localized view
  hero_title?: string;
  hero_description?: string;
  hero_subtitle?: string;
}
