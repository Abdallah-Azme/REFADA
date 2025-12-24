import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerApi } from "../api";
import { authService } from "../services/auth.service";
import { RegisterRequest, ApiErrorResponse } from "../types/auth.schema";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => registerApi(data),
    onSuccess: (response) => {
      // Show success message
      toast.success(response.message || "تم إنشاء الحساب بنجاح");

      // If tokens are provided, auto-login (only when data exists and has accessToken)
      if (response.data?.accessToken) {
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken!,
          tokenType: response.data.tokenType || "Bearer",
          accessExpiresIn: response.data.accessExpiresIn,
          refreshExpiresIn: response.data.refreshExpiresIn,
        };

        authService.storeTokens(tokens);
        authService.storeUser(response.data.user);

        // Redirect based on user role
        const role = response.data.user.role;
        if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "delegate") {
          router.push("/dashboard/families");
        } else if (role === "contributor") {
          router.push("/dashboard/contributor");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Account created but pending admin approval
        toast.info(
          "تم إنشاء حسابك بنجاح! يرجى انتظار موافقة المسؤول قبل تسجيل الدخول."
        );
        router.push("/signin");
      }
    },
    onError: (error: ApiErrorResponse) => {
      // Handle error messages
      if (error.errors) {
        // Display field-specific errors
        Object.entries(error.errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(message);
          });
        });
      } else {
        toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    },
  });
}
