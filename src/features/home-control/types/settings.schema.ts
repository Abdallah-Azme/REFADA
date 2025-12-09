import { z } from "zod";

export const websiteSettingsSchema = z.object({
  siteName: z.object({
    en: z.string().min(1, "Site name in English is required"),
    ar: z.string().min(1, "اسم الموقع بالعربية مطلوب"),
  }),
  siteLogo: z.any().optional(),
  favicon: z.any().optional(),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  facebook: z.string().url("رابط فيسبوك غير صحيح").optional().or(z.literal("")),
  twitter: z.string().url("رابط تويتر غير صحيح").optional().or(z.literal("")),
  instagram: z
    .string()
    .url("رابط انستغرام غير صحيح")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("رابط لينكد إن غير صحيح")
    .optional()
    .or(z.literal("")),
  youtube: z.string().url("رابط يوتيوب غير صحيح").optional().or(z.literal("")),
  whatsapp: z.string().min(1, "رقم الواتساب مطلوب"),
});

export type WebsiteSettingsFormValues = z.infer<typeof websiteSettingsSchema>;

export interface WebsiteSettings {
  id: number;
  siteName: {
    en: string;
    ar: string;
  };
  siteLogo: string;
  favicon: string;
  phone: string;
  email: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp: string;
}
