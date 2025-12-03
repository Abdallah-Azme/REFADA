import { z } from "zod";

export const contributorSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  type: z.enum(["organization", "individual", "company"]),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  totalContributions: z.string(),
});

export type ContributorFormValues = z.infer<typeof contributorSchema>;

export interface Contributor extends ContributorFormValues {
  id: number;
  status: "active" | "inactive";
}

export type ContributorType = "organization" | "individual" | "company";

export enum ContributorStatus {
  Active = "active",
  Inactive = "inactive",
}
