"use client";

import { useEffect } from "react";
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
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  verifyResetCodeSchema,
  useVerifyResetCode,
  authService,
  type VerifyResetCodeFormValues,
} from "@/features/auth";
import { toast } from "sonner";

export default function VerifyResetCodePage() {
  const router = useRouter();
  const { mutate: verifyCode, isPending } = useVerifyResetCode();

  const form = useForm<VerifyResetCodeFormValues>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: {
      email: "",
      reset_code: "",
    },
  });

  // Get email from session storage
  useEffect(() => {
    const email = authService.getResetEmail();
    if (!email) {
      toast.error("لم يتم العثور على البريد الإلكتروني. يرجى البدء من جديد");
      router.push("/forgot-password");
      return;
    }
    form.setValue("email", email);
  }, [form, router]);

  const onSubmit = (values: VerifyResetCodeFormValues) => {
    verifyCode(values);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            تحقق من بريدك الإلكتروني
          </h1>
          <p className="text-gray-600 text-sm">
            أدخل رمز التحقق المكون من 6 أرقام المرسل إلى بريدك الإلكتروني
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="reset_code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="000000"
                      className="h-[50px] bg-[#EEEADD] text-center text-2xl tracking-widest font-mono"
                      maxLength={6}
                      disabled={isPending}
                      {...field}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
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
                  جاري التحقق...
                </>
              ) : (
                "تحقق من الرمز"
              )}
            </Button>

            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                لم تستلم الرمز؟{" "}
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-secondary hover:underline font-medium"
                  disabled={isPending}
                >
                  إعادة الإرسال
                </button>
              </p>

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
