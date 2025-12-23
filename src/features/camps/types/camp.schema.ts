import { z } from "zod";

export const createCampSchema = (t: any) =>
  z
    .object({
      name_ar: z.string().min(1, t("validation.name_ar_required")),
      name_en: z.string().min(1, t("validation.name_en_required")),
      location: z.string().min(1, t("validation.location_required")),
      description_ar: z.string().optional(),
      description_en: z.string().optional(),
      capacity: z.number().min(0, t("validation.capacity_min")).default(0),
      currentOccupancy: z.number().min(0).default(0),
      coordinates: z
        .object({
          lat: z.coerce.number().default(0),
          lng: z.coerce.number().default(0),
        })
        .optional()
        .default({ lat: 0, lng: 0 }),
      governorate_id: z.string().min(1, t("validation.governorate_required")),
      camp_img: z
        .any()
        .refine(
          (val) =>
            !val ||
            val instanceof File ||
            typeof val === "string" ||
            val === undefined,
          t("validation.camp_img_invalid")
        )
        .optional(),
    })
    .refine((data) => data.currentOccupancy <= data.capacity, {
      message: t("validation.occupancy_error"),
      path: ["currentOccupancy"],
    });

export type CampFormValues = z.infer<ReturnType<typeof createCampSchema>>;

export interface Project {
  id: number;
  name: string;
  type: string;
  addedBy: string;
  beneficiaryCount: number;
  college: string;
  status: string;
  isApproved: boolean;
  notes: string | null;
  projectImage: string;
  totalReceived: number;
  totalRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface Camp {
  id: number;
  name: string | { ar?: string; en?: string };
  description?: string | { ar?: string; en?: string };
  slug?: string;
  governorate?: string | { id: number; name: string } | null;
  governorate_id?: number | string;
  familyCount?: number;
  childrenCount?: number;
  elderlyCount?: number;
  latitude?: number | null;
  longitude?: number | null;
  location?: string;
  bankAccount?: string | null;
  campImg?: string;
  projects?: Project[];
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "inactive";
  capacity?: number;
  currentOccupancy?: number;
  // Form-specific coordinates (for backward compatibility)
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

export interface CampStatistics {
  id: number;
  name: string;
  registeredFamilies: number;
  currentProjects: number;
  contributionsPercentage: string;
}

export interface CampStatisticsResponse {
  success: boolean;
  message: string;
  data: CampStatistics[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
}
