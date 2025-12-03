import { z } from "zod";

export const campSchema = z
  .object({
    name: z.string().min(1, "اسم المخيم مطلوب"),
    location: z.string().min(1, "الموقع مطلوب"),
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    capacity: z.number().min(1, "السعة يجب أن تكون أكبر من 0"),
    currentOccupancy: z.number().min(0, "الإشغال يجب أن يكون 0 أو أكثر"),
    coordinates: z.object({
      lat: z.number().min(-90).max(90, "خط العرض يجب أن يكون بين -90 و 90"),
      lng: z.number().min(-180).max(180, "خط الطول يجب أن يكون بين -180 و 180"),
    }),
  })
  .refine((data) => data.currentOccupancy <= data.capacity, {
    message: "الإشغال الحالي لا يمكن أن يكون أكبر من السعة الكلية",
    path: ["currentOccupancy"],
  });

export type CampFormValues = z.infer<typeof campSchema>;

export interface Camp extends CampFormValues {
  id: string;
  status: "active" | "inactive";
}

export type CreateCampDto = Omit<Camp, "id" | "status">;

export enum CampStatus {
  Active = "active",
  Inactive = "inactive",
}
