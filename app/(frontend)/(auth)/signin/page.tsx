"use client";

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
import { Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صالح" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

export default function RefadLogin() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {};

  return (
    <div className=" flex flex-col gap-5 ">
      <Tabs defaultValue="contributor" className=" w-full gap-10 ">
        <TabsList className="bg-gray-100 rounded-full p-1 w-60 mx-auto">
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
                          placeholder="البريد الإلكتروني"
                          className="ps-9 h-[50px] bg-[#EEEADD]"
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
                          type="password"
                          placeholder="كلمة المرور"
                          className="ps-9 h-[50px] bg-[#EEEADD]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />

              <div className=" text-sm text-gray-600">
                {/* <Link href="#" className="hover:underline">
                  نسيت كلمة المرور
                </Link> */}
              </div>

              <Button
                type="submit"
                className="w-full rounded-full! bg-secondary hover:bg-[#b5a678] text-primary py-6 font-bold text-lg"
              >
                دخول
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
                          placeholder="البريد الإلكتروني"
                          className="ps-9 h-[50px] bg-[#EEEADD]"
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
                          type="password"
                          placeholder="كلمة المرور"
                          className="ps-9 h-[50px] bg-[#EEEADD]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-full! bg-secondary hover:bg-[#b5a678] text-primary py-6 font-bold text-lg"
              >
                دخول
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      <p className="text-center text-sm mt-4 text-gray-600">
        ليس لديك حساب؟{" "}
        <Link
          href="/signup"
          className="text-[#c8b78a] font-semibold hover:underline"
        >
          تسجيل حساب جديد
        </Link>
      </p>
    </div>
  );
}
