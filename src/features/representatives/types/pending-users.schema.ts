import { z } from "zod";

// ============================================
// API Response Types (matching backend)
// ============================================

export interface PendingUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  backupPhone: string | null;
  campName: string | null;
  idNumber: string;
  role: "delegate" | "contributor" | "admin";
  adminPosition: string | null;
  licenseNumber: string | null;
  acceptTerms: boolean;
  status: "pending" | "approved" | "rejected";
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PendingUsersResponse {
  status: boolean;
  message: string;
  data: PendingUser[];
}

export interface ApproveUserRequest {
  camp_id?: number; // Required for delegates
  admin_position_id?: number; // Required for delegates
}

export interface ApproveUserResponse {
  status: boolean;
  message: string;
}

// ============================================
// Form Schemas
// ============================================

export const approveUserSchema = z.object({
  camp_id: z.number().optional(),
  admin_position_id: z.number().optional(),
});

export type ApproveUserFormValues = z.infer<typeof approveUserSchema>;
