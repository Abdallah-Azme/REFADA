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
  image: z.string(),
});

export type AboutUsData = z.infer<typeof aboutUsSchema>;
