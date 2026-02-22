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
          t("validation.camp_img_invalid"),
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

// Delegate associated with a camp
export interface CampDelegate {
  id: number;
  name: string;
  email: string;
  phone: string;
  backupPhone?: string | null;
  campName: string;
  idNumber: string;
  role: string;
  adminPositionName?: string | null;
  adminPosition?: string | null;
  licenseNumber?: string | null;
  acceptTerms: boolean;
  status: string; // "approved" | "rejected" | "pending"
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  camp?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface CampFamilyMember {
  id: number;
  name: string;
  gender: string;
  dob: string;
  nationalId: string;
  relationship?: string;
  medicalConditions?: string[]; // Array of medical condition names from backend
  createdAt?: string;
  updatedAt?: string;
}

export interface CampFamily {
  id: number;
  familyName: string;
  nationalId: string;
  dob: string;
  phone: string;
  backupPhone?: string | null;
  totalMembers?: number | null;
  membersCount?: number | null;
  malesCount?: number | null;
  femalesCount?: number | null;
  maritalStatus: string;
  tentNumber?: string | null;
  location?: string | null;
  notes?: string | null;
  camp: string;
  quantity?: number | null;
  members?: CampFamilyMember[];
  medicalConditions?: string[]; // Array of medical conditions for the family
  ageGroups?: string[]; // Array of age group identifiers from backend
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
  latitude?: number | string | null;
  longitude?: number | string | null;
  location?: string;
  bankAccount?: string | null;
  campImg?: string;
  projects?: Project[];
  families?: CampFamily[];
  delegates?: string[] | CampDelegate[]; // Array of delegates associated with the camp
  statistics?: {
    familyCount: number;
    memberCount: number;
    projectCount: number;
  };
  createdAt?: string;
  updatedAt?: string;
  status?: "active" | "inactive";
  capacity?: number;
  currentOccupancy?: number;
  delegate?: string | null; // Legacy single delegate name field
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

export interface CampFamilyStatistics {
  id: number;
  name: string;
  familyCount: number;
  projectCount: number;
  memberCount: number;
}

export interface CampFamilyStatisticsResponse {
  success: boolean;
  message: string;
  data: CampFamilyStatistics[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface CampDashboardStatistics {
  currentProjects: number;
  currentProjectsLastWeek: number;
  currentProjectsLastWeekPercentage: string;
  deliveredProjects: number;
  deliveredProjectsLastWeek: number;
  deliveredProjectsLastWeekPercentage: string;
  familiesCount: number;
  familiesGrowthPercentage: string;
  contributionsCount: number;
}

export interface CampDashboardStatisticsResponse {
  success: boolean;
  message: string;
  data: CampDashboardStatistics;
}
