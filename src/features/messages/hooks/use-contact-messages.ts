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
