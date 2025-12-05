"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  registerSchema,
  useRegister,
  type RegisterFormValues,
} from "@/features/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const [activeRole, setActiveRole] = useState<"contributor" | "delegate">(
    "contributor"
  );
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      id_number: "",
      phone: "",
      backup_phone: "",
      role: "contributor",
      license_number: "",
      accept_terms: false,
      camp_name: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    register(values);
  };

  const handleRoleChange = (role: string) => {
    setActiveRole(role as "contributor" | "delegate");
    form.setValue("role", role as "contributor" | "delegate");

    // Clear delegate-specific fields when switching to contributor
    if (role === "contributor") {
      form.setValue("camp_name", "");
    }
  };

  return (
    <div className="bg-white rounded-xl">
      <h2 className="text-center text-lg font-semibold mb-6">
        تسجيل حساب جديد
      </h2>

      <Tabs
        value={activeRole}
        onValueChange={handleRoleChange}
        className="w-full"
      >
        <TabsList className="bg-gray-100 rounded-full p-1 w-60 mx-auto mb-6">
          <TabsTrigger
            value="contributor"
            className="data-[state=active]:bg-[#c8b78a] data-[state=active]:text-white rounded-full px-4 py-1 text-sm"
          >
            مساهم
          </TabsTrigger>
          <TabsTrigger
            value="delegate"
            className="data-[state=active]:bg-[#c8b78a] data-[state=active]:text-white rounded-full px-4 py-1 text-sm"
          >
            مندوب
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* الاسم الكامل */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-[50px] bg-[#EEEADD]"
                      placeholder="الاسم الكامل"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* رقم الهوية */}
            <FormField
              control={form.control}
              name="id_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-[50px] bg-[#EEEADD]"
                      placeholder="رقم الهوية"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* البريد الإلكتروني */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-[50px] bg-[#EEEADD]"
                      type="email"
                      placeholder="البريد الإلكتروني"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* رقم الهاتف */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-[50px] bg-[#EEEADD]"
                      placeholder="رقم الهاتف"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* رقم هاتف احتياطي */}
            <FormField
              control={form.control}
              name="backup_phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-[50px] bg-[#EEEADD]"
                      placeholder="رقم هاتف احتياطي (اختياري)"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Delegate-specific fields */}
            {activeRole === "delegate" && (
              <>
                {/* المنصب الإداري */}
                <FormField
                  control={form.control}
                  name="camp_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-[50px] bg-[#EEEADD]"
                          placeholder="اسم المخيم"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* رقم الترخيص */}
                <FormField
                  control={form.control}
                  name="license_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-[50px] bg-[#EEEADD]"
                          placeholder="رقم الترخيص"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* كلمة المرور */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-[50px] bg-[#EEEADD]"
                      type="password"
                      placeholder="كلمة المرور"
                      disabled={isPending}
                      {...field}
                    />
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
                    <Input
                      className="h-[50px] bg-[#EEEADD]"
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* الموافقة على الشروط */}
            <FormField
              control={form.control}
              name="accept_terms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-x-reverse">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <span className="text-sm text-gray-700">
                    أوافق على{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="text-secondary hover:underline font-medium"
                    >
                      الشروط والأحكام
                    </Link>
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-secondary rounded-full text-primary hover:bg-[#b5a678] py-6 font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                "تسجيل"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link
                href="/signin"
                className="text-[#c8b78a] font-medium hover:underline"
              >
                دخول
              </Link>
            </p>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
