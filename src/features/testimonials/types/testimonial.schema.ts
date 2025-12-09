import { z } from "zod";

export const testimonialSchema = z.object({
  user_name: z.string().min(2, "اسم المستخدم مطلوب"),
  user_image: z.any().optional(), // File or string URL
  opinion_ar: z.string().min(5, "الرأي (بالعربية) مطلوب"),
  opinion_en: z.string().min(5, "الرأي (بالنجليزي) مطلوب"),
  order: z
    .string()
    .or(z.number())
    .transform((val) => Number(val))
    .optional(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export interface Testimonial {
  id: number;
  user_name: string;
  user_image: string;
  opinion: string; // Depending on API, might be localized string or object.
  // Based on other features, it seems backend filters by Accept-Language.
  // But for admin editing, we need both.
  // API might return `opinion` as string if Accept-Language is set.
  // To edit, we might need to fetch without specific language or handle standard generic response.
  // Let's assume for listing it returns localized 'opinion'.
  // For editing (GET /:id), we hopefully get both or can deduce.
  // Actually, usually admin APIs return all translations or we might need separate fields.
  // Postman `store` sends `opinion[ar]`.
  // Let's check api.ts later. For now, I will assume the LIST endpoint returns localized `opinion`.
  // And the SHOW endpoint might return `opinion` as string too if we send AR header.
  // Wait, the update request requires sending both AR and EN.
  // If GET /:id only returns AR, we can't edit EN.
  // I'll assume the API returns an object for opinion or specific fields.
  // If not, I'll have to adjust.
  // For now, let's include separate fields if possible, or just `opinion`.
  // Let's look at a previous feature. Most features just had single language fields.
  // But here we explicitly see `opinion[ar]` and `opinion[en]` in POST.

  // Let's assume the response structure for listing:
  // id, user_name, user_image, opinion (localized), order, ...
  order: number;
  created_at?: string;
  updated_at?: string;
}

// Extended interface for editing if API returns full objects
export interface TestimonialDetail extends Testimonial {
  // If API returns translations
  opinion_ar?: string;
  opinion_en?: string;
  // Or if it returns `opinion` as object
  // opinion: { ar: string; en: string };
}
