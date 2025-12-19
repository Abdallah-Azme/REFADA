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

export interface PageData {
  pageType: string;
  title: string;
  description: string;
  image: string;
  file?: string; // Document file URL
  isActive: boolean | null;
  // If API returns translations in a specific details endpoint
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
}
