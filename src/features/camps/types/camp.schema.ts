import { z } from "zod";

export const campSchema = z
  .object({
    name_ar: z.string().min(1, "الاسم بالعربية مطلوب"),
    name_en: z.string().min(1, "الاسم بالإنجليزية مطلوب"),
    location: z.string().min(1, "الموقع مطلوب"),
    description_ar: z.string().optional(),
    description_en: z.string().optional(),
    capacity: z.number().min(0, "السعة يجب أن تكون 0 أو أكبر").default(0),
    currentOccupancy: z.number().min(0).default(0),
    coordinates: z.object({
      lat: z.number().default(0),
      lng: z.number().default(0),
    }),
    governorate_id: z.string().min(1, "المحافظة مطلوبة"), // Using string for select value usually, or coerce number
    camp_img: z
      .any()
      .refine(
        (val) => val instanceof File || typeof val === "string",
        "صورة المخيم مطلوبة"
      ),
  })
  .refine((data) => data.currentOccupancy <= data.capacity, {
    message: "الإشغال الحالي لا يمكن أن يكون أكبر من السعة الكلية",
    path: ["currentOccupancy"],
  });

export type CampFormValues = z.infer<typeof campSchema>;

export interface Camp {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  governorate?: any;
  familyCount?: number;
  childrenCount?: number;
  elderlyCount?: number;
  location?: string;
  campImg?: string;
  status: "active" | "inactive";
  // Add other form values if they are part of the response
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type CreateCampDto = Omit<Camp, "id" | "status">;

export enum CampStatus {
  Active = "active",
  Inactive = "inactive",
}
