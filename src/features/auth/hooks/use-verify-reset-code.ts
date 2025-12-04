import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verifyResetCodeApi } from "../api";
import { authService } from "../services/auth.service";
import { VerifyResetCodeRequest, ApiErrorResponse } from "../types/auth.schema";

export function useVerifyResetCode() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: VerifyResetCodeRequest) => verifyResetCodeApi(data),
    onSuccess: (response) => {
      // Store reset token for next step
      authService.storeResetToken(response.data.reset_token);

      // Show success message
      toast.success(response.message || "تم التحقق من الرمز بنجاح");

      // Redirect to reset password page
      router.push("/reset-password");
    },
    onError: (error: ApiErrorResponse) => {
      if (error.errors) {
        Object.values(error.errors).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message || "رمز التحقق غير صحيح");
      }
    },
  });
}
