import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectsApi,
  createProjectApi,
  updateProjectApi,
  approveProjectApi,
  deleteProjectApi,
} from "../api/projects.api";
import { toast } from "sonner";
import {
  ProjectsQueryParams,
  buildProjectsQueryString,
  DEFAULT_PROJECTS_QUERY,
} from "../types/projects-query.types";

export function useProjects(
  params: ProjectsQueryParams = DEFAULT_PROJECTS_QUERY,
) {
  const queryString = buildProjectsQueryString(params);
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjectsApi(queryString),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => createProjectApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("تم إضافة المشروع بنجاح");
    },
    onError: (error: any) => {
      const message = error?.message || "حدث خطأ أثناء إضافة المشروع";
      const validationErrors = error?.errors
        ? Object.values(error.errors).flat().join(", ")
        : "";
      toast.error(
        validationErrors ? `${message}: ${validationErrors}` : message,
      );
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      updateProjectApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("تم تحديث المشروع بنجاح");
    },
    onError: (error: any) => {
      toast.error(error?.message || "حدث خطأ أثناء تحديث المشروع");
    },
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
