const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
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

export interface Project {
  id: number;
  name: string;
  type: string;
  addedBy: string;
  beneficiaryCount: number;
  college: string;
  status: string; // "pending" | "approved" | "rejected"
  isApproved: boolean;
  notes: string | null;
  projectImage: string;
  totalReceived: number;
  totalRemaining: number;
  camp: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export async function getProjectsApi(): Promise<ProjectsResponse> {
  return apiRequest<ProjectsResponse>(`/projects`, {
    method: "GET",
  });
}

export async function createProjectApi(
  data: FormData
): Promise<{ success: boolean; message: string; data: Project }> {
  return apiRequest(`/projects`, {
    method: "POST",
    body: data,
  });
}

export async function updateProjectApi(
  id: number,
  data: FormData
): Promise<{ success: boolean; message: string; data: Project }> {
  return apiRequest(`/projects/${id}`, {
    method: "POST",
    body: data,
  });
}

export async function approveProjectApi(
  id: number,
  status: "in_progress" | "cancelled"
): Promise<{ success: boolean; message: string; data: Project }> {
  const formData = new FormData();
  formData.append("status", status);

  return apiRequest(`/projects/${id}/approve`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteProjectApi(
  id: number
): Promise<{ success: boolean; message: string }> {
  return apiRequest(`/projects/${id}`, {
    method: "DELETE",
  });
}
