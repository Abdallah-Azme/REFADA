// Types for dashboard counts API responses

export interface AdminCounts {
  campsCount: number;
  contactUsCount: number;
  complaintsCount: number;
  projectsCount: number;
  delegatesCount: number;
  contributorsCount: number;
  pendingUsersCount: number;
  activityLogsCount: number;
  governoratesCount: number;
  maritalStatusesCount: number;
  medicalConditionsCount: number;
  relationsCount: number;
  contributionsCount: number;
  testimonialCount: number;
}

export interface DelegateCounts {
  campId: number;
  familiesCount: number;
  contributionsCount: number;
  projectsCount: number;
}

export interface ContributorCounts {
  campsCount: number;
  contributionsCount: number;
}

export interface CountsResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
