"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";

// ----------------------
// 🟦 ZOD SCHEMA
// ----------------------
const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "كلمة المرور الحالية يجب أن تكون 6 أحرف على الأقل"),
    newPassword: z
      .string()
      .min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمتا المرور غير متطابقتين",
  });

// TypeScript type inferred from schema
type PasswordFormType = z.infer<typeof passwordSchema>;

export default function SettingsPasswordTab() {
  const passwordForm = useForm<PasswordFormType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = (data: PasswordFormType) => {
    console.log("Password submitted:", data);
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-gray-600 mb-6 text-right text-sm leading-relaxed">
        لأمان حسابك، يرجى إدخال كلمة المرور الحالية قبل تعيين كلمة مرور جديدة
      </p>

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Password */}
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    كلمة المرور الحالية
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••••"
                      className="h-11 text-base bg-gray-50 border-gray-200 text-right"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <div className="hidden md:block" />
            {/* New Password */}
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    كلمة المرور الجديدة
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••••"
                      className="h-11 text-base bg-gray-50 border-gray-200 text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    تأكيد كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••••"
                      className="h-11 text-base bg-gray-50 border-gray-200 text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-start mt-8 gap-3">
            <Button
              type="submit"
              className="bg-[#1B4854] hover:bg-[#1B4854]/90 text-white px-10 py-2.5 text-base rounded-lg shadow-sm"
            >
              حفظ ✓
            </Button>

            <Button
              type="button"
              onClick={() => passwordForm.reset()}
              className="bg-[#C4A862] hover:bg-[#C4A862]/90 text-white px-10 py-2.5 text-base rounded-lg shadow-sm"
            >
              إلغاء ✗
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
