import { z } from "zod";

export interface Governorate {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  created_at: string;
  updated_at: string;
}

export interface GovernoratesResponse {
  success: boolean;
  message: string;
  data: Governorate[];
}

export interface GovernorateResponse {
  success: boolean;
  message: string;
  data: Governorate;
}

export const governorateSchema = z.object({
  name_ar: z.string().min(1, "الاسم بالعربية مطلوب"),
  name_en: z.string().min(1, "الاسم بالإنجليزية مطلوب"),
});

export type GovernorateFormValues = z.infer<typeof governorateSchema>;
