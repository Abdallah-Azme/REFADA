import { z } from "zod";

export const familySchema = z.object({
  familyName: z.string().min(1, "اسم العائلة مطلوب"),
  headOfFamily: z.string().min(1, "رب الأسرة مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  address: z.string().min(1, "العنوان مطلوب"),
  membersCount: z.number().min(1, "عدد الأفراد يجب أن يكون على الأقل 1"),
  monthlyIncome: z.string(),
});

export type FamilyFormValues = z.infer<typeof familySchema>;

export interface Family extends FamilyFormValues {
  id: number;
  status: "active" | "inactive";
  needsAssessment: "urgent" | "high" | "medium" | "low";
}

export enum FamilyStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum NeedsAssessment {
  Urgent = "urgent",
  High = "high",
  Medium = "medium",
  Low = "low",
}
