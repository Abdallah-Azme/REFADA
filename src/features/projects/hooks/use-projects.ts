import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectsApi,
  approveProjectApi,
  deleteProjectApi,
} from "../api/projects.api";
import { toast } from "sonner";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsApi(),
  });
}

export function useApproveProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "in_progress" | "cancelled";
    }) => approveProjectApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("تم الموافقة على المشروع بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء الموافقة على المشروع");
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("تم حذف المشروع بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء حذف المشروع");
    },
  });
}
