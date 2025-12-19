import { useQuery } from "@tanstack/react-query";
import { getMedicalConditionsApi } from "../api/families.api";

export const useMedicalConditions = () => {
  return useQuery({
    queryKey: ["medical-conditions"],
    queryFn: getMedicalConditionsApi,
    staleTime: 1000 * 60 * 10, // 10 minutes - medical conditions rarely change
  });
};
