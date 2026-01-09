// Types for contributor history

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

export interface ContributionProject {
  id: number;
  name: string;
  type: string;
  addedBy: string;
  DelegatePhone: string;
  beneficiaryCount: number;
  college: string;
  status: string;
  isApproved: boolean;
  notes: string | null;
  projectImage: string;
  totalReceived: number;
  totalRemaining: number;
  camp: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContributionHistoryItem {
  id: number;
  totalQuantity: number;
  confirmed_quantity: number | null;
  delegate: string;
  notes: string | null;
  status: string;
  project: ContributionProject;
  contributorFamilies: ContributorFamily[];
  createdAt: string;
  updatedAt: string;
}

export interface ContributionHistoryResponse {
  success: boolean;
  message: string;
  data: ContributionHistoryItem[];
}
