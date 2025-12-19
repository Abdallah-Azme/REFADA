import { z } from "zod";

export const aboutUsSchema = z.object({
  id: z.number(),
  title: z.object({
    ar: z.string(),
    en: z.string(),
  }),
  description: z.object({
    ar: z.string(),
    en: z.string(),
  }),
  image: z.string().nullable().optional(),
  second_image: z.string().nullable().optional(),
  file: z.string().nullable().optional(),
});

export type AboutUsData = z.infer<typeof aboutUsSchema>;
