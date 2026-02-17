const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ContributorFamily {
  id: number;
  familyName: string;
  nationalId: string;
  dob: string;
  phone: string;
  backupPhone: string | null;
  totalMembers: number;
  maritalStatus: string;
  tentNumber: string;
  location: string;
  notes: string | null;
  camp: string;
  quantity: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContributionHistoryProject {
  id: number;
  name: string;
  type: string;
  addedBy: string;
  beneficiaryCount: number;
  college: string;
  status: string;
  isApproved: boolean;
  notes: string | null;
  projectImage: string | null;
  totalReceived: number;
  totalRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContributorMember {
  id: number;
  name: string;
  nationalId: string;
  dob: string;
  gender: string;
  relationship: string;
  medicalConditions: string[];
}

export interface ContributorHistoryItem {
  id: number;
  totalQuantity: number;
  notes: string | null;
  status: string;
  project: ContributionHistoryProject;
  contributorFamilies: ContributorFamily[];
  contributorMembers: ContributorMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ContributorHistoryResponse {
  success: boolean;
  message: string;
  data: ContributorHistoryItem[];
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": "ar",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { ...data, status: response.status };
  }

  return data as T;
}

export const contributorHistoryApi = {
  getHistory: () =>
    apiRequest<ContributorHistoryResponse>("/contributor/history"),
};
