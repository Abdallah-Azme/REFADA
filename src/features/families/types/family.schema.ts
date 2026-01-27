import { z } from "zod";

// Member schema for individual family members
export const familyMemberSchema = z.object({
  id: z.number().optional(), // If present, it's an existing member being edited
  name: z.string().min(1, "اسم الفرد مطلوب"),
  nationalId: z.string().length(9, "رقم الهوية يجب أن يكون 9 أرقام"),
  originalNationalId: z.string().optional(), // Track original national_id for existing members
  gender: z.enum(["male", "female"], {
    required_error: "النوع مطلوب",
  }),
  dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
  relationshipId: z.string().min(1, "صلة القرابة مطلوبة"),
  medicalConditionIds: z.array(z.string()).optional(), // Array of medical condition IDs - empty means healthy, 'other' means custom text
  medicalConditionText: z.string().optional(), // Custom text when 'other' is selected
});

export type FamilyMemberFormValues = z.infer<typeof familyMemberSchema>;

export const familySchema = z.object({
  familyName: z.string().min(1, "اسم العائلة مطلوب"),
  nationalId: z.string().length(9, "رقم الهوية يجب أن يكون 9 أرقام"),
  dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  backupPhone: z.string().optional(),
  gender: z.enum(["male", "female"], {
    required_error: "النوع مطلوب",
  }), // Gender for the head of family
  totalMembers: z.coerce.number().min(1, "عدد الأفراد مطلوب"),
  tentNumber: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  campId: z.string().min(1, "المعسكر مطلوب"),
  maritalStatusId: z.string().min(1, "الحالة الاجتماعية مطلوبة"),
  medicalConditionIds: z.array(z.string()).optional(), // Array of medical condition IDs for head of family - 'other' means custom text
  medicalConditionText: z.string().optional(), // Custom text when 'other' is selected
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
  // New array fields from API
  ageGroups?: string[]; // Array of age group categories
  medicalConditions?: string[]; // Array of medical condition names
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

export interface DeletedFamily extends Family {
  deleteReason: string;
  deletedBy: string;
  deletedAt: string;
}

export interface DeletedFamiliesResponse {
  success: boolean;
  message: string;
  data: DeletedFamily[];
}
