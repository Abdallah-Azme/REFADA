"use client";

import { useQuery } from "@tanstack/react-query";
import { getDelegateContributionsApi } from "../api/contributors.api";

export function useDelegateContributions() {
  return useQuery({
    queryKey: ["delegate-contributions"],
    queryFn: getDelegateContributionsApi,
  });
}
