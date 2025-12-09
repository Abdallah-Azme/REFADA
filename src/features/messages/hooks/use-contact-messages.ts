import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { contactMessagesApi } from "../api/contact-message.api";
import { ContactMessageFormValues } from "../types/message.schema";

export function useContactMessages() {
  return useQuery({
    queryKey: ["contact-messages"],
    queryFn: contactMessagesApi.getAll,
  });
}

export function useContactMessage(id: number) {
  return useQuery({
    queryKey: ["contact-message", id],
    queryFn: () => contactMessagesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ContactMessageFormValues, "subject">) =>
      contactMessagesApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إرسال رسالتك بنجاح");
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactMessagesApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف الرسالة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف الرسالة");
    },
  });
}
