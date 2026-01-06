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
import { PhoneInput } from "@/components/ui/phone-input";
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
import { Loader2, MessageCirclePlus, Send } from "lucide-react";
import { useDirection } from "@/hooks/use-direction";
import { cn } from "@/lib/utils";
import { useCreateComplaint } from "@/features/complaints";
import { useCamps } from "@/features/camps";
import { toast } from "sonner";
import { useHero } from "@/features/home-control/hooks/use-hero";

// 🧩 Validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "nameRequired" }),
  phone: z.string().min(8, { message: "phoneRequired" }),
  email: z.string().email({ message: "invalidEmail" }),
  camp_id: z.string().min(1, { message: "campRequired" }),
  topic: z.string().min(2, { message: "subjectRequired" }),
  message: z.string().min(5, { message: "messageRequired" }),
});

export default function ContactSection() {
  const t = useTranslations();
  const { isRTL } = useDirection();
  const { data: campsData, isLoading: campsLoading } = useCamps();
  const { mutate: createComplaint, isPending } = useCreateComplaint();
  const { data: heroData } = useHero();

  const camps = campsData?.data || [];
  const complaintImage =
    heroData?.data?.complaintImage || "/pages/pages/meeting.webp";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      camp_id: "",
      topic: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createComplaint(
      {
        ...values,
        camp_id: parseInt(values.camp_id),
      },
      {
        onSuccess: () => {
          form.reset();
        },
        onError: (error: any) => {
          toast.error(error?.message || "حدث خطأ أثناء إرسال الشكوى/الاقتراح");
        },
      }
    );
  }

  return (
    <section className="bg-[#F4F4F4] overflow-hidden">
      {/* 🧭 Breadcrumb */}
      <Breadcrumb
        items={[
          { name: t("home"), href: "/" },
          { name: t("suggestions"), href: "/suggestions" },
        ]}
        className="container mx-auto px-4 pt-10"
      />

      {/*  Main form container */}
      <div className="w-full mb-10 py-6  relative overflow-hidden">
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
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start container mx-auto px-4">
          {/* 📝 Form slides from top */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: -80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* 🧩 Title - moved inside the form column */}
            <div className="flex items-center gap-2 mb-4">
              <MessageCirclePlus className="text-[#4A8279]" />
              <h1 className="text-xl font-bold text-[#1E1E1E]">
                {t("contactTitle")}
              </h1>
            </div>

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
                          <PhoneInput
                            className="h-[50px] [&_input]:bg-[#EEEADD] [&_input]:h-[50px] [&_button]:h-[50px] [&_button]:bg-[#EEEADD]"
                            placeholder={t("phonePlaceholder")}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email + Camp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
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
                    name="camp_id"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={campsLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full h-[50px]! bg-[#EEEADD] flex items-center">
                              <SelectValue
                                placeholder={
                                  campsLoading
                                    ? "جاري التحميل..."
                                    : "اختر الإيواء"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {camps.map((camp) => (
                              <SelectItem
                                key={camp.id}
                                value={camp.id.toString()}
                              >
                                {camp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Topic */}
                <FormField
                  control={form.control}
                  name="topic"
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
                          placeholder={t("messagePlaceholder")}
                          className="h-32 resize-none bg-[#EEEADD]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <motion.div
                  whileHover={{ scale: isPending ? 1 : 1.05 }}
                  whileTap={{ scale: isPending ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-secondary flex gap-2 items-center px-15! font-semibold hover:bg-secondary/90 text-primary rounded-full p-6"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        {t("send")}
                        <Send
                          className={cn(
                            "text-primary text-sm",
                            isRTL ? "-scale-x-100" : ""
                          )}
                        />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>

          {/* 🖼 Illustration slides from bottom */}
          <motion.div
            className="flex-1 relative hidden md:flex h-[450px]"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="w-full h-full relative rounded-2xl overflow-hidden">
              <ImageFallback
                src={complaintImage}
                alt={t("altImage")}
                className="object-cover"
                fill
              />
            </div>
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
