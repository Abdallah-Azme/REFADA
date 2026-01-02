const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Types for the statistics response
export interface MonthStats {
  familiesCount: number;
  projectsCount: number;
  contributionsPercentage: string;
}

export interface StatisticsData {
  total: MonthStats;
  lastMonths: Record<string, MonthStats>;
}

export interface StatisticsResponse {
  success: boolean;
  message: string;
  data: StatisticsData;
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export const statisticsApi = {
  getUserStatistics: async (): Promise<StatisticsResponse> => {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/user/statistics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Accept-Language": "ar",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { ...data, status: response.status };
    }

    return data;
  },
};
