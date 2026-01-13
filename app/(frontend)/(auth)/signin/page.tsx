"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginSchema, useLogin, type LoginFormValues } from "@/features/auth";
import { useTranslations } from "next-intl";

export default function RefadLogin() {
  const t = useTranslations("signin");
  const { mutate: login, isPending } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <div className=" flex flex-col gap-5 ">
      <Tabs defaultValue="contributor" className=" w-full gap-10 ">
        <TabsList className="bg-gray-100 rounded-full p-1 w-60 mx-auto">
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
        <TabsContent value="contributor" className="w-full  ">
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <div className="relative ">
                        <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          placeholder={t("email_placeholder")}
                          className="ps-9 h-[50px] bg-[#EEEADD]"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />

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
                          placeholder={t("password_placeholder")}
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
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />

              <div className=" text-sm text-gray-600">
                <Link href="/forgot-password" className="hover:underline">
                  {t("forgot_password")}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full! bg-secondary hover:bg-[#b5a678] text-primary py-6 font-bold text-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("logging_in")}
                  </>
                ) : (
                  t("login")
                )}
              </Button>
            </form>
          </Form>{" "}
        </TabsContent>
        <TabsContent value="delegate" className="w-full  ">
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                        <Input
                          placeholder={t("email_placeholder")}
                          className="ps-9 h-[50px] bg-[#EEEADD]"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />

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
                          placeholder={t("password_placeholder")}
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
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />

              <div className=" text-sm text-gray-600">
                <Link href="/forgot-password" className="hover:underline">
                  {t("forgot_password")}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full! bg-secondary hover:bg-[#b5a678] text-primary py-6 font-bold text-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("logging_in")}
                  </>
                ) : (
                  t("login")
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm mt-4 text-gray-600">
        {t("no_account")}{" "}
        <Link
          href="/signup"
          className="text-[#c8b78a] font-semibold hover:underline"
        >
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
