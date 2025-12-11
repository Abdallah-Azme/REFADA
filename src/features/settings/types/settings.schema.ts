import { z } from "zod";

export const settingsSchema = z.object({
  id: z.number(),
  siteName: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  siteLogo: z.string(),
  favicon: z.string(),
  phone: z.string(),
  email: z.string(),
  facebook: z.string(),
  twitter: z.string(),
  instagram: z.string(),
  linkedin: z.string(),
  youtube: z.string(),
  whatsapp: z.string(),
});

export type Settings = z.infer<typeof settingsSchema>;
