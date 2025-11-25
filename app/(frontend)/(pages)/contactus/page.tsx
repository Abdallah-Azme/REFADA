"use client";

import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import ImageFallback from "@/components/shared/image-fallback";
import { MessageCirclePlus, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/use-direction";

// 🧩 Validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "nameRequired" }),
  phone: z.string().min(8, { message: "phoneRequired" }),
  email: z.string().email({ message: "invalidEmail" }),
  category: z.string().min(1, { message: "categoryRequired" }),
  subject: z.string().min(2, { message: "subjectRequired" }),
  message: z.string().min(5, { message: "messageRequired" }),
});

export default function ContactSection() {
  const t = useTranslations();

  const { isRTL } = useDirection();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <section className="bg-[#F4F4F4] overflow-hidden">
      {/* 🧭 Breadcrumb */}
      <Breadcrumb
        items={[
          { name: t("home"), href: "/" },
          { name: t("contactus"), href: "/contactus" },
        ]}
        className="container mx-auto px-4 py-2"
      />

      {/* 🧩 Title */}
      <motion.div
        className="flex items-center gap-2 container mx-auto px-4 py-2 mt-5"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MessageCirclePlus className="text-[#4A8279]" />
        <h1 className="text-xl font-bold text-[#1E1E1E]">{t("contactus")}</h1>
      </motion.div>

      {/* 🧱 Main form container */}
      <div className="w-full bg-white rounded-2xl mt-5 mb-10 py-12 relative overflow-hidden">
        {/* 🌾 Decorative images behind */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <ImageFallback
            src="/pages/pages/wheat.webp"
            width={136}
            height={184}
            className="absolute bottom-0 right-0 w-[136px] h-[184px] opacity-40"
          />
          <ImageFallback
            src="/pages/pages/heart.webp"
            width={78}
            height={64}
            className="absolute top-0 left-1/4 w-16 h-[78px] opacity-40"
          />
        </div>

        {/* 🧱 Foreground content (above decorations) */}
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center container mx-auto px-4">
          {/* 📝 Form slides from top */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: -80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="mb-6 text-[#1E1E1E]">{t("contactDescription")}</p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="h-[50px] bg-[#EEEADD]"
                            placeholder={t("namePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                            className="h-[50px] bg-[#EEEADD]"
                            placeholder={t("phonePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="h-[50px] bg-[#EEEADD]"
                            placeholder={t("emailPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-[50px]! bg-[#EEEADD]">
                              <SelectValue
                                placeholder={t("categoryPlaceholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical">
                              {t("categoryTechnical")}
                            </SelectItem>
                            <SelectItem value="suggestion">
                              {t("categorySuggestion")}
                            </SelectItem>
                            <SelectItem value="other">
                              {t("categoryOther")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subject */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="h-[50px] bg-[#EEEADD]"
                          placeholder={t("subjectPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="h-[150px] bg-[#EEEADD]"
                          placeholder={t("messagePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    className="bg-secondary flex gap-2 items-center px-15! font-semibold hover:bg-secondary/90 text-primary rounded-full p-6"
                  >
                    {t("send")}

                    <Send
                      className={cn(
                        "text-primary text-sm",
                        isRTL ? "-scale-x-100" : ""
                      )}
                    />
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>

          {/* 🖼 Illustration slides from bottom */}
          <motion.div
            className="flex-1 relative hidden md:flex h-[478px]"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <ImageFallback
              src="/pages/pages/carrying-peace.webp"
              alt={t("altImage")}
              className="object-contain"
              fill
            />
          </motion.div>
        </div>
      </div>

      {/* 💬 Support message */}
      <motion.p
        className="my-8 text-[#1B2540] text-center font-bold"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {t("supportMessage")}
      </motion.p>
    </section>
  );
}
