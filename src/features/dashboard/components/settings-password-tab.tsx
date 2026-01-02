"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  useChangePassword,
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/features/profile";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function SettingsPasswordTab() {
  const changePassword = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const onPasswordSubmit = (data: ChangePasswordFormValues) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
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
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    كلمة المرور الحالية
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        className="h-11 text-base bg-gray-50 border-gray-200 text-right pe-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />
            <div className="hidden md:block" />

            {/* New Password */}
            <FormField
              control={passwordForm.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    كلمة المرور الجديدة
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        className="h-11 text-base bg-gray-50 border-gray-200 text-right pe-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
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

            {/* Confirm Password */}
            <FormField
              control={passwordForm.control}
              name="new_password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    تأكيد كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••"
                        className="h-11 text-base bg-gray-50 border-gray-200 text-right pe-10"
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
          </div>

          {/* Actions */}
          <div className="flex justify-start mt-8 gap-3">
            <Button
              type="submit"
              disabled={changePassword.isPending}
              className="bg-[#1B4854] hover:bg-[#1B4854]/90 text-white px-10 py-2.5 text-base rounded-lg shadow-sm"
            >
              {changePassword.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ ✓"
              )}
            </Button>

            <Button
              type="button"
              onClick={() => passwordForm.reset()}
              disabled={changePassword.isPending}
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
