import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginApi } from "../api";
import { authService } from "../services/auth.service";
import { LoginRequest, ApiErrorResponse } from "../types/auth.schema";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: (response) => {
      // Store tokens and user data
      authService.storeTokens(response.data.tokens);
      authService.storeUser(response.data.user);

      // Show success message
      toast.success(response.message || "تم تسجيل الدخول بنجاح");

      // Redirect based on user role
      const role = response.data.user.role;
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "delegate") {
        router.push("/dashboard");
      } else if (role === "contributor") {
        router.push("/dashboard/contributor");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: ApiErrorResponse) => {
      // Handle error messages
      if (error.errors) {
        // Display field-specific errors
        Object.values(error.errors).forEach((messages) => {
          messages.forEach((message) => toast.error(message));
        });
      } else {
        toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
      }
    },
  });
}
