import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { complaintApi } from "../api/complaint.api";
import { ComplaintFormValues } from "../types/complaint.schema";

export function useCreateComplaint() {
  return useMutation({
    mutationFn: (data: ComplaintFormValues) => complaintApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إرسال الشكوى/الاقتراح بنجاح");
    },
  });
}
