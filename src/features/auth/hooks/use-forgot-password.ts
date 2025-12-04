import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPasswordApi } from "../api";
import { authService } from "../services/auth.service";
import { ForgotPasswordRequest, ApiErrorResponse } from "../types/auth.schema";

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => forgotPasswordApi(data),
    onSuccess: (response, variables) => {
      // Store email for next step
      authService.storeResetEmail(variables.email);

      // Show success message
      toast.success(
        response.message || "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
      );

      // Redirect to verify code page
      router.push("/verify-reset-code");
    },
    onError: (error: ApiErrorResponse) => {
      if (error.errors) {
        Object.values(error.errors).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message || "حدث خطأ أثناء إرسال رمز التحقق");
      }
    },
  });
}
