"use client";

import { useTranslations } from "next-intl";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createRegisterSchema,
  useRegister,
  type RegisterFormValues,
} from "@/features/auth";
import { useAdminPositions } from "@/features/admin-position";
import { useCamps } from "@/features/camps";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [activeRole, setActiveRole] = useState<"contributor" | "delegate">(
    "contributor"
  );
  const { mutate: register, isPending } = useRegister();
  const registerSchema = createRegisterSchema(t);

  // Fetch admin positions for delegates
  const { data: adminPositionsData } = useAdminPositions();
  const adminPositions = adminPositionsData?.data || [];

  // Fetch camps for delegate camp selection
  const { data: campsData } = useCamps();
  const camps = campsData?.data || [];

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
      admin_position: "",
      license_number: "",
      camp_id: "",
      accept_terms: false,
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    register(values);
  };

  const handleRoleChange = (role: string) => {
    setActiveRole(role as "contributor" | "delegate");
    form.setValue("role", role as "contributor" | "delegate");
    // Clear contributor-specific fields when switching to delegate
    if (role === "delegate") {
      form.setValue("admin_position", "");
      form.setValue("license_number", "");
    } else {
      // Clear delegate-specific fields when switching to contributor
      form.setValue("camp_id", "");
    }
  };

  const watchedAdminPosition = form.watch("admin_position");

  return (
    <div className="bg-white rounded-xl">
      <h2 className="text-center text-lg font-semibold mb-6">
        {t("create_account")}
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
            {t("contributor")}
          </TabsTrigger>
          <TabsTrigger
            value="delegate"
            className="data-[state=active]:bg-[#c8b78a] data-[state=active]:text-white rounded-full px-4 py-1 text-sm"
          >
            {t("delegate")}
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
                      placeholder={t("full_name")}
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
                      placeholder={t("id_number")}
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
                      placeholder={t("email")}
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
                      placeholder={t("phone")}
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
                      placeholder={t("backup_phone")}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contributor-specific fields */}
            {activeRole === "contributor" && (
              <>
                {/* الصفة الإدارية للمساهم */}
                <FormField
                  control={form.control}
                  name="admin_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-[50px] bg-[#EEEADD]">
                            <SelectValue
                              placeholder={t("admin_position_placeholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="مبادر">
                              {t("admin_position_initiator")}
                            </SelectItem>
                            <SelectItem value="فريق">
                              {t("admin_position_team")}
                            </SelectItem>
                            <SelectItem value="جمعية">
                              {t("admin_position_association")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* رقم الترخيص - يظهر فقط عند اختيار جمعية */}
                {watchedAdminPosition === "جمعية" && (
                  <FormField
                    control={form.control}
                    name="license_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="h-[50px] bg-[#EEEADD]"
                            placeholder={t("enter_license_number")}
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            {/* Delegate-specific fields */}
            {activeRole === "delegate" && (
              <>
                {/* الصفة الإدارية للمندوب - من API */}
                <FormField
                  control={form.control}
                  name="admin_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-[50px] bg-[#EEEADD]">
                            <SelectValue
                              placeholder={t("admin_position_placeholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {adminPositions.map((position) => (
                              <SelectItem
                                key={position.id}
                                value={position.id.toString()}
                              >
                                {position.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* اختيار الإيواء للمندوب */}
                <FormField
                  control={form.control}
                  name="camp_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <SelectTrigger className="h-[50px] bg-[#EEEADD]">
                            <SelectValue placeholder={t("select_camp")} />
                          </SelectTrigger>
                          <SelectContent>
                            {camps.map((camp) => {
                              const campName =
                                typeof camp.name === "string"
                                  ? camp.name
                                  : camp.name?.ar || camp.name?.en || "";
                              return (
                                <SelectItem
                                  key={camp.id}
                                  value={camp.id.toString()}
                                >
                                  {campName}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
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
                      placeholder={t("password")}
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
                      placeholder={t("confirm_password")}
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
                    {t("agree_to")}{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="text-secondary hover:underline font-medium"
                    >
                      {t("terms_conditions")}
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
                  {t("creating_account")}
                </>
              ) : (
                t("register")
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {t("already_have_account")}{" "}
              <Link
                href="/signin"
                className="text-[#c8b78a] font-medium hover:underline"
              >
                {t("sign_in")}
              </Link>
            </p>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
