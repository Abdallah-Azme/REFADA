import { z } from "zod";

export const medicalConditionSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
});

export type MedicalConditionFormValues = z.infer<typeof medicalConditionSchema>;

export interface MedicalCondition {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
