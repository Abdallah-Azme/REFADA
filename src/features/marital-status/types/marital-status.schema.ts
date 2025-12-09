import { z } from "zod";

export const maritalStatusSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
});

export type MaritalStatusFormValues = z.infer<typeof maritalStatusSchema>;

export interface MaritalStatus {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
