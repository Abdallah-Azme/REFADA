import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { partnerApi } from "../api/partner.api";
import { PartnerFormValues } from "../types/partner.schema";

export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: partnerApi.getAll,
  });
}

export function usePartner(id: number) {
  return useQuery({
    queryKey: ["partner", id],
    queryFn: () => partnerApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PartnerFormValues) => partnerApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إضافة الشريك بنجاح");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة الشريك");
    },
  });
}

export function useUpdatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PartnerFormValues }) =>
      partnerApi.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث الشريك بنجاح");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الشريك");
    },
  });
}

export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => partnerApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف الشريك بنجاح");
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الشريك");
    },
  });
}
