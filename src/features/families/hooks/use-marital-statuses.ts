import { useQuery } from "@tanstack/react-query";
import { getMaritalStatusesApi } from "../api/families.api";

export const useMaritalStatuses = () => {
  return useQuery({
    queryKey: ["marital-statuses"],
    queryFn: getMaritalStatusesApi,
    staleTime: 1000 * 60 * 10, // 10 minutes - marital statuses rarely change
  });
};
