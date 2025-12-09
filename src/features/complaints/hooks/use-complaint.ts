import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { complaintApi } from "../api/complaint.api";
import { ComplaintFormValues } from "../types/complaint.schema";

export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: complaintApi.getAll,
  });
}

export function useComplaint(id: number) {
  return useQuery({
    queryKey: ["complaint", id],
    queryFn: () => complaintApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateComplaint() {
  return useMutation({
    mutationFn: (data: ComplaintFormValues) => complaintApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إرسال الشكوى/الاقتراح بنجاح");
    },
  });
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => complaintApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف الشكوى بنجاح");
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
    },
  });
}
