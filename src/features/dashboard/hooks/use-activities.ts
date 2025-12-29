import { useQuery } from "@tanstack/react-query";
import { activitiesApi } from "../api/activities.api";

export function useMyActivities() {
  return useQuery({
    queryKey: ["my-activities"],
    queryFn: activitiesApi.getMyActivities,
  });
}
