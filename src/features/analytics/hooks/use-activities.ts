import { useQuery } from "@tanstack/react-query";
import { activityApi } from "../api/activity.api";
import { useState } from "react";

export function useActivities() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["activities", page],
    queryFn: () => activityApi.getAll(page),
  });

  return {
    ...query,
    page,
    setPage,
  };
}
