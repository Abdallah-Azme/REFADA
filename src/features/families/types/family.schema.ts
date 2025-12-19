import { z } from "zod";

// Member schema for individual family members
export const familyMemberSchema = z.object({
  name: z.string().min(1, "اسم الفرد مطلوب"),
  nationalId: z.string().min(1, "رقم الهوية مطلوب"),
  gender: z.enum(["male", "female"], {
    required_error: "النوع مطلوب",
  }),
  dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
  relationshipId: z.string().min(1, "صلة القرابة مطلوبة"),
});

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>;

export const familySchema = z.object({
  familyName: z.string().min(1, "اسم العائلة مطلوب"),
  nationalId: z.string().min(8, "قم بإدخال رقم الهوية"),
  dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  backupPhone: z.string().optional(),
  totalMembers: z.coerce.number().min(1, "عدد الأفراد مطلوب"),
  tentNumber: z.string().min(1, "رقم الخيمة مطلوب"),
  location: z.string().min(1, "العنوان/الموقع مطلوب"),
  notes: z.string().optional(),
  campId: z.string().min(1, "المعسكر مطلوب"),
  maritalStatusId: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  file: z.any().optional(), // For file upload
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
