import { useQuery } from "@tanstack/react-query";
import { getRelationshipsApi } from "../api/families.api";

export const useRelationships = () => {
  return useQuery({
    queryKey: ["relationships"],
    queryFn: getRelationshipsApi,
    staleTime: 1000 * 60 * 10, // 10 minutes - relationships rarely change
  });
};
