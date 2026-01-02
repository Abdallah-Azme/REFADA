"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {
  resetPasswordSchema,
  useResetPassword,
  authService,
  type ResetPasswordFormValues,
} from "@/features/auth";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      reset_token: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Get reset token from session storage
  useEffect(() => {
    const resetToken = authService.getResetToken();
    if (!resetToken) {
      toast.error("رمز إعادة التعيين غير صالح. يرجى البدء من جديد");
      router.push("/forgot-password");
      return;
    }
    form.setValue("reset_token", resetToken);
  }, [form, router]);

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword(values);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            إعادة تعيين كلمة المرور
          </h1>
          <p className="text-gray-600 text-sm">
            أدخل كلمة المرور الجديدة الخاصة بك
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* كلمة المرور الجديدة */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة المرور الجديدة"
                        className="ps-9 pe-10 h-[50px] bg-[#EEEADD]"
                        disabled={isPending}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* تأكيد كلمة المرور */}
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="تأكيد كلمة المرور"
                        className="ps-9 pe-10 h-[50px] bg-[#EEEADD]"
                        disabled={isPending}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-secondary hover:bg-[#b5a678] text-primary py-6 font-bold text-lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري إعادة التعيين...
                </>
              ) : (
                "إعادة تعيين كلمة المرور"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/signin"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
