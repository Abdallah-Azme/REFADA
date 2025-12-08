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

      // If tokens are provided, auto-login
      if (response.data.accessToken) {
        const tokens = {
          accessToken: response.data.accessToken!,
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
          router.push("/dashboard/(superadmin)");
        } else if (role === "delegate") {
          router.push("/dashboard/(representative)");
        } else if (role === "contributor") {
          router.push("/dashboard/(contributor)");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Redirect to login if email verification is required
        toast.info("يرجى تسجيل الدخول باستخدام بيانات الاعتماد الخاصة بك");
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
