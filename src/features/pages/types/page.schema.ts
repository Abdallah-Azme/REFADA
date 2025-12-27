import { z } from "zod";

export const pageUpdateSchema = z.object({
  title_ar: z.string().min(2, "العنوان (بالعربية) مطلوب"),
  title_en: z.string().min(2, "العنوان (بالإنجليزي) مطلوب"),
  description_ar: z.string().min(10, "الوصف (بالعربية) مطلوب"),
  description_en: z.string().min(10, "الوصف (بالإنجليزي) مطلوب"),
  image: z.any().optional(), // File or string URL
  file: z.any().optional(), // File or string URL for document upload
});

export type PageUpdateFormValues = z.infer<typeof pageUpdateSchema>;

// Localized text object structure used by the API
export interface LocalizedText {
  ar: string;
  en: string;
}

export interface PageData {
  pageType: string;
  title: LocalizedText;
  description: LocalizedText;
  image?: string | null;
  second_image?: string | null;
  file?: string | null;
  isActive?: boolean | null;
}
