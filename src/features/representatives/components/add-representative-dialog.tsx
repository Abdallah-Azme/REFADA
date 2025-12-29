"use client";

import { useTranslations, useLocale } from "next-intl";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CirclePlus, PlusCircle, UserCheck, Eye, EyeOff } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { createRepresentativeSchema } from "../types/create-representative.schema";
import { useCreateRepresentative } from "../hooks/use-create-representative";
import { useCamps } from "@/features/camps";
import { useAdminPositions } from "@/features/admin-position";

export default function AddRepresentativeDialog() {
  const t = useTranslations("representatives");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutateAsync: createRepresentative, isPending } =
    useCreateRepresentative();

  // Load camps for the select
  const { data: campsData } = useCamps();
  const camps = campsData?.data || [];

  // Load admin positions for the select
  const { data: adminPositionsData } = useAdminPositions();
  const adminPositions = adminPositionsData?.data || [];

  // Helper function to get camp name based on locale
  const getCampName = (camp: {
    name: string | { ar?: string; en?: string };
  }) => {
    if (typeof camp.name === "string") return camp.name;
    return locale === "ar"
      ? camp.name.ar || camp.name.en || ""
      : camp.name.en || camp.name.ar || "";
  };

  const form = useForm<z.infer<typeof createRepresentativeSchema>>({
    resolver: zodResolver(createRepresentativeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      id_number: "",
      password: "",
      password_confirmation: "",
      backup_phone: "",
      camp_id: "",
      admin_position: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof createRepresentativeSchema>
  ) => {
    try {
      await createRepresentative(values);
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Error creating representative:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <Button className="bg-[#1F423B] text-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-medium h-11">
          {t("add_representative")} <PlusCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      {/* DIALOG CONTENT */}
      <DialogContent className="rounded-md overflow-hidden max-w-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold flex gap-1 items-center">
            <UserCheck className="mx-1 text-primary" />
            {t("add_representative")}
          </DialogTitle>
        </div>

        {/* FORM */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* MAIN GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#F4F4F4] gap-4 p-4 rounded-xl">
                {/* الاسم */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder={t("name")}
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
                          type="email"
                          className="bg-white"
                          placeholder={t("email")}
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
                          className="bg-white"
                          placeholder={t("phone")}
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
                          className="bg-white"
                          placeholder={t("national_id")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* رقم الهاتف الاحتياطي */}
                <FormField
                  control={form.control}
                  name="backup_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="bg-white"
                          placeholder={t("backup_phone")}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* المخيم */}
                <FormField
                  control={form.control}
                  name="camp_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value
                              ? (() => {
                                  const camp = camps.find(
                                    (c) => c.id.toString() === field.value
                                  );
                                  return camp ? getCampName(camp) : t("camp");
                                })()
                              : t("camp")}
                          </SelectTrigger>
                          <SelectContent>
                            {camps.map((camp) => (
                              <SelectItem
                                key={camp.id}
                                value={camp.id.toString()}
                              >
                                {getCampName(camp)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* الصفة الإدارية */}
                <FormField
                  control={form.control}
                  name="admin_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full bg-white">
                            {field.value
                              ? adminPositions.find(
                                  (p) => p.id.toString() === field.value
                                )?.name || t("admin_position")
                              : t("admin_position")}
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
              </div>

              {/* PASSWORD SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#F4F4F4] gap-4 p-4 rounded-xl">
                {/* كلمة المرور */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="bg-white ltr:pr-10 rtl:pl-10"
                            placeholder={t("password")}
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
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="bg-white ltr:pr-10 rtl:pl-10"
                            placeholder={t("confirm_password")}
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
              </div>

              {/* FOOTER BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 mx-auto w-full sm:w-fit">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto bg-primary min-w-[172px] text-white px-8 rounded-xl"
                >
                  <CirclePlus className="mr-2 h-4 w-4" />
                  {isPending ? t("adding") : t("add_representative")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
