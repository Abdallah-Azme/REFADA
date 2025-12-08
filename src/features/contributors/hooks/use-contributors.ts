import { useQuery } from "@tanstack/react-query";
import { getContributorsApi } from "../api/contributors.api";

export function useContributors() {
  return useQuery({
    queryKey: ["contributors"],
    queryFn: () => getContributorsApi(),
  });
}
