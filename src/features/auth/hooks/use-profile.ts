import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../api/profile.api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileApi(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });
}
