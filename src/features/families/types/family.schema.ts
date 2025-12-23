import { z } from "zod";

// Member schema for individual family members
export const familyMemberSchema = z
  .object({
    id: z.number().optional(), // If present, it's an existing member being edited
    name: z.string().min(1, "اسم الفرد مطلوب"),
    nationalId: z.string().min(1, "رقم الهوية مطلوب"),
    originalNationalId: z.string().optional(), // Track original national_id for existing members
    gender: z.enum(["male", "female"], {
      required_error: "النوع مطلوب",
    }),
    dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
    relationshipId: z.string().min(1, "صلة القرابة مطلوبة"),
    medicalConditionId: z.string().optional(), // Optional - 'none' means healthy
    medicalConditionFile: z.any().optional(), // Optional file for medical condition
  })
  .refine(
    (data) => {
      // If medical condition is selected (not 'none' and has a value), file is required
      // BUT skip this check for existing members (those with an id) as they already have the file on server
      if (data.medicalConditionId && data.medicalConditionId !== "none") {
        // For existing members, file is optional (already uploaded)
        if (data.id) {
          return true;
        }
        // For new members, file is required
        return data.medicalConditionFile instanceof File;
      }
      return true;
    },
    {
      message: "الملف مطلوب عند اختيار حالة مرضية",
      path: ["medicalConditionFile"],
    }
  );

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>;

export const familySchema = z.object({
  familyName: z.string().min(1, "اسم العائلة مطلوب"),
  nationalId: z.string().min(8, "قم بإدخال رقم الهوية"),
  dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  backupPhone: z.string().optional(),
  gender: z.enum(["male", "female"], {
    required_error: "النوع مطلوب",
  }), // Gender for the head of family
  totalMembers: z.coerce.number().min(1, "عدد الأفراد مطلوب"),
  tentNumber: z.string().min(1, "رقم الخيمة مطلوب"),
  location: z.string().min(1, "العنوان/الموقع مطلوب"),
  notes: z.string().optional(),
  campId: z.string().min(1, "المعسكر مطلوب"),
  maritalStatusId: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  medicalConditionId: z.string().optional(), // Medical condition for the head of family
  file: z.any().optional(), // For file upload (required if medical condition is set)
  members: z.array(familyMemberSchema).optional(), // Dynamic members array
});

export type FamilyFormValues = z.infer<typeof familySchema>;

export interface Family {
  id: number;
  familyName: string;
  nationalId: string;
  dob: string;
  phone: string;
  backupPhone: string;
  totalMembers: number;
  fileUrl: string;
  maritalStatus: string; // The backend returns the name, not ID
  tentNumber: string;
  location: string;
  notes: string; // can be null in JSON but "notes notes" in example
  camp: string; // The backend returns the name
  quantity: number | null;
  createdAt: string;
  updatedAt: string;
  // Detail fields
  femalesCount?: number;
  malesCount?: number;
  members?: FamilyMember[];
}

export interface FamilyMember {
  id: number;
  name: string;
  nationalId: string;
  gender: "male" | "female";
  dob: string;
  relationship?: string;
  medicalCondition?: string;
}

export interface FamiliesResponse {
  success: boolean;
  message: string;
  data: Family[];
  meta?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface FamilyResponse {
  success: boolean;
  message: string;
  data: Family;
}
