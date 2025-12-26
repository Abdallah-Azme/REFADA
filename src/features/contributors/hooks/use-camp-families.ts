"use client";

import { useQuery } from "@tanstack/react-query";
import { getRepresentativeCampFamiliesApi } from "../api/contributors.api";

export function useRepresentativeCampFamilies() {
  return useQuery({
    queryKey: ["representativeCampFamilies"],
    queryFn: () => getRepresentativeCampFamiliesApi(),
  });
}
