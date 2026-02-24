import { useQuery } from "@tanstack/react-query";
import {
  getRepresentativesApi,
  GetRepresentativesParams,
} from "../api/representatives.api";

export function useRepresentatives(params?: GetRepresentativesParams) {
  return useQuery({
    queryKey: ["representatives", params],
    queryFn: () => getRepresentativesApi(params),
  });
}
