import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPasswordApi } from "../api";
import { authService } from "../services/auth.service";
import { ResetPasswordRequest, ApiErrorResponse } from "../types/auth.schema";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPasswordApi(data),
    onSuccess: (response) => {
      // Clear reset data
      authService.clearResetData();

      // Show success message
      toast.success(response.message || "تم إعادة تعيين كلمة المرور بنجاح");

      // Redirect to login
      router.push("/signin");
    },
    onError: (error: ApiErrorResponse) => {
      if (error.errors) {
        Object.values(error.errors).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
      }
    },
  });
}
