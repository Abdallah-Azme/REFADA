"use client";

import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../api/statistics.api";

export function useUserStatistics() {
  return useQuery({
    queryKey: ["user-statistics"],
    queryFn: statisticsApi.getUserStatistics,
  });
}
