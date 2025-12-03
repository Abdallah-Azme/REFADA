import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  targetAmount: z.number().min(1, "المبلغ المستهدف مطلوب"),
  currentAmount: z.number().min(0),
  startDate: z.string(),
  endDate: z.string(),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;

export interface Campaign extends CampaignFormValues {
  id: string;
  status: "active" | "completed" | "cancelled";
  category: string;
}

export enum CampaignStatus {
  Active = "active",
  Completed = "completed",
  Cancelled = "cancelled",
}
