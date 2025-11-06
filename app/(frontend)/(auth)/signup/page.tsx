"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const formSchema = z.object({
  fullName: z.string().min(3, "يرجى إدخال الاسم الكامل"),
  nationalId: z.string().min(10, "يرجى إدخال رقم هوية صالح"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صالح"),
  phone: z.string().min(8, "يرجى إدخال رقم تواصل صالح"),
  role: z.string().min(1, "يرجى اختيار الصفة الإدارية"),
  license: z.string().optional(),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  terms: z.boolean().refine((val) => val === true, {
    message: "يجب الموافقة على الشروط والأحكام",
  }),
});

export default function ContributorRegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      nationalId: "",
      email: "",
      phone: "",
      role: "",
      license: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="  bg-white rounded-xl  ">
      <h2 className="text-center text-lg font-semibold mb-6">
        تسجيل حساب جديد للمساهم
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* الاسم رباعي */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="الاسم رباعي" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* رقم الهوية */}
          <FormField
            control={form.control}
            name="nationalId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="رقم الهوية" {...field} />
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
                    placeholder="البريد الإلكتروني"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* رقم التواصل */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="رقم التواصل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* الصفة الإدارية */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="الصفة الإدارية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">مدير</SelectItem>
                      <SelectItem value="member">عضو</SelectItem>
                      <SelectItem value="supervisor">مشرف</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* رقم الترخيص */}
          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="رقم الترخيص" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* كلمة المرور */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="كلمة المرور" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Checkbox */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-x-reverse">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
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
            className="w-full bg-[#c8b78a] hover:bg-[#b5a678] text-gray-800 font-semibold"
          >
            دخول
          </Button>

          <p className="text-center text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link href="/signin" className="text-[#c8b78a] font-medium">
              دخول
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
