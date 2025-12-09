import { useQuery } from "@tanstack/react-query";
import { getProjectsApi } from "../api/projects.api";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsApi(),
  });
}
