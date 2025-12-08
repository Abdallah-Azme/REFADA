// app/providers.tsx
"use client";

import { toast } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ApiError } from "../utils";
import { AuthProvider } from "@/features/auth";
import { useState } from "react";

const handleError = (error: any) => {
  if (error instanceof ApiError) {
    if (error.validationErrors) {
      // Show validation errors
      Object.entries(error.validationErrors).forEach(([field, errors]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        const messages = Array.isArray(errors) ? errors : [errors];
        messages.forEach((msg) => {
          toast.error(`${fieldName}: ${msg}`);
        });
      });
    } else {
      toast.error(error.message);
    }
  } else if (error?.status >= 400 && error?.status < 500) {
    // Handle plain object errors with status (like from governorates.api.ts)
    toast.error(error.message || "حدث خطأ في الطلب");
  } else if (error instanceof Error) {
    // toast.error(error.message); // Too generic for all errors, maybe optional
  } else {
    // toast.error("حدث خطأ غير متوقع");
  }
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleError,
        }),
        mutationCache: new MutationCache({
          onError: handleError,
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
