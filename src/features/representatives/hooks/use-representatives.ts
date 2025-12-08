import { useQuery } from "@tanstack/react-query";
import { getRepresentativesApi } from "../api/representatives.api";

export function useRepresentatives() {
  return useQuery({
    queryKey: ["representatives"],
    queryFn: () => getRepresentativesApi(),
  });
}
