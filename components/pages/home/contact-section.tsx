"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().min(8, "رقم الجوال غير صالح"),
  subject: z.string().min(2, "الموضوع مطلوب"),
  message: z.string().min(5, "الرسالة مطلوبة"),
});

export default function ContactSection() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <section className="bg-[#1C3A34] text-white py-16 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* --- Right: Logo --- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <Image
            src="/logo-placeholder.png"
            alt="Refad Logo"
            width={180}
            height={180}
            className="object-contain"
          />
          <h3 className="text-xl font-semibold text-[#DCCDA5]">R E F A D</h3>
          <p className="text-sm text-gray-300">
            المنظمة الإنسانية الرشيدة
            <br />
            قطاع غزة
          </p>
        </motion.div>

        {/* --- Left: Form --- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-6">اتصل بنا</h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 text-[#1C3A34]"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="اسم المستخدم"
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="البريد الإلكتروني"
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="الموضوع"
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="رقم الجوال"
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="اكتب رسالتك إلينا..."
                        className="bg-[#F5F3EB] border-none focus-visible:ring-0 min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-start">
                <Button
                  type="submit"
                  className="rounded-full bg-[#C9B47A] text-[#1C3A34] hover:bg-[#b6a26e] flex items-center gap-2 px-6"
                >
                  <Send size={16} /> إرسال
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
