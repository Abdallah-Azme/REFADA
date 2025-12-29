import { z } from "zod";

export const adminPositionSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
});

export type AdminPositionFormValues = z.infer<typeof adminPositionSchema>;

export interface AdminPosition {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
