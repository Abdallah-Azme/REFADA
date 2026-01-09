import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { countsApi } from "../api/counts.api";
import {
  AdminCounts,
  ContributorCounts,
  DelegateCounts,
} from "../types/counts.types";

type CountsData = AdminCounts | ContributorCounts | DelegateCounts | null;

export function useCounts() {
  const pathname = usePathname();

  // Detect role from URL path
  const isAdmin = pathname.includes("/dashboard/admin");
  const isContributor = pathname.includes("/dashboard/contributor");
  const isDelegate = !isAdmin && !isContributor;

  const role = isAdmin ? "admin" : isContributor ? "contributor" : "delegate";

  const query = useQuery<CountsData>({
    queryKey: ["counts", role],
    queryFn: async () => {
      if (isAdmin) {
        return countsApi.getAdminCounts();
      } else if (isContributor) {
        return countsApi.getContributorCounts();
      } else {
        return countsApi.getDelegateCounts();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    counts: query.data,
    isLoading: query.isLoading,
    error: query.error,
    role,
  };
}
