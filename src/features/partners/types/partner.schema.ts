import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string().min(2, "اسم السريك مطلوب"),
  logo: z.any().optional(), // File or string URL
  order: z
    .string()
    .or(z.number())
    .transform((val) => Number(val))
    .optional(),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;

export interface Partner {
  id: number;
  name: string;
  logo: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}
