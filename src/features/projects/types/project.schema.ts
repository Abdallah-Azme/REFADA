import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "اسم المشروع مطلوب"),
  representative: z.string().min(1, "المندوب مطلوب"),
  date: z.string(),
  budget: z.string().min(1, "الميزانية مطلوبة"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export interface Project extends ProjectFormValues {
  id: number;
  status: "pending" | "approved" | "rejected";
}

export enum ProjectStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}
