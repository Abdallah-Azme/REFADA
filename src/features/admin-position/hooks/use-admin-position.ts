import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminPositionApi } from "../api/admin-position.api";
import { AdminPositionFormValues } from "../types/admin-position.schema";

export function useAdminPositions() {
  return useQuery({
    queryKey: ["admin-positions"],
    queryFn: adminPositionApi.getAll,
  });
}

export function useAdminPosition(id: number) {
  return useQuery({
    queryKey: ["admin-position", id],
    queryFn: () => adminPositionApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAdminPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminPositionFormValues) =>
      adminPositionApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إضافة الصفة الإدارية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-positions"] });
    },
  });
}

export function useUpdateAdminPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminPositionFormValues }) =>
      adminPositionApi.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث الصفة الإدارية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-positions"] });
    },
  });
}

export function useDeleteAdminPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminPositionApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف الصفة الإدارية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["admin-positions"] });
    },
  });
}
