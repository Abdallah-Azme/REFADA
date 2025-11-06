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
import ImageFallback from "@/components/shared/image-fallback";

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
    <section className="bg-[#1C3A34] text-white   min-h-[600px]">
      <div className=" pe-4  flex gap-8 h-full   ">
        {/* --- Right: Logo --- */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="md:flex  relative h-full flex-1 min-h-[600px] hidden"
        >
          <div className="  w-full  absolute inset-0">
            <ImageFallback
              src="/pages/home/refad-org.webp"
              alt="Refad Logo"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* --- Left: Form --- */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-fit py-16 px-6 flex-1 h-auto my-auto  mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8  ">اتصل بنا</h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 text-primary w-full max-w-[600px]"
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
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0 h-12 rounded-md text-right"
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
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0 h-12 rounded-md text-right"
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
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0 h-12 rounded-md text-right"
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
                          className="bg-[#F5F3EB] border-none focus-visible:ring-0 h-12 rounded-md text-right"
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
                        className="bg-[#F5F3EB] border-none focus-visible:ring-0 min-h-[120px] rounded-md text-right"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300 text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-center md:justify-start pt-2">
                <Button
                  type="submit"
                  className="rounded-full bg-[#C9B47A] text-[#1C3A34] hover:bg-[#b6a26e] flex items-center gap-2 px-8 h-12 font-semibold text-base"
                >
                  <Send size={18} /> إرسال
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
