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
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import ImageFallback from "@/components/shared/image-fallback";
import { useTranslations } from "next-intl";
import { useDirection } from "@/hooks/use-direction";
import { contactMessagesApi } from "@/features/messages/api/contact-message.api";
import { toast } from "sonner";
import { useState } from "react";

export default function ContactSection() {
  const t = useTranslations();
  const { isRTL } = useDirection();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define schema inside component to use translations
  const formSchema = z.object({
    name: z.string().min(2, t("required_name")),
    email: z.string().email(t("invalid_email")),
    phone: z.string().min(8, t("invalid_phone")),
    subject: z.string().min(2, t("required_subject")),
    message: z.string().min(5, t("required_message")),
  });

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await contactMessagesApi.create(values);
      toast.success(response.message);
      form.reset();
    } catch (error: any) {
      console.error("Failed to send message:", error);
      const errors = error?.errors || {};
      // If validation errors, showing first one or generic
      if (Object.keys(errors).length > 0) {
        Object.values(errors)
          .flat()
          .forEach((err: any) => {
            toast.error(err as string);
          });
      } else {
        toast.error(t("messages.error_sending"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-[#274540] text-white h-fit md:min-h-[600px]">
      <div className="  flex gap-8 h-full">
        {/* --- Right: Logo (TOP) --- */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="md:flex relative h-full flex-1  min-h-[600px] hidden"
        >
          <div className="w-full absolute inset-0">
            <ImageFallback
              src="/refad.png"
              alt="Refad Logo"
              fill
              quality={100}
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* --- Left: Form (BOTTOM) --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-fit py-10 px-6 flex-1 h-auto my-auto mx-auto  "
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {t("contact_title")}
          </h2>

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
                          placeholder={t("name_placeholder")}
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
                          placeholder={t("email_placeholder")}
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
                          placeholder={t("subject_placeholder")}
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
                        <PhoneInput
                          placeholder={t("phone_placeholder")}
                          className="[&_input]:bg-[#F5F3EB] [&_input]:border-none [&_input]:focus-visible:ring-0 [&_input]:h-12 [&_button]:h-12 [&_button]:bg-[#F5F3EB] [&_button]:border-none"
                          value={field.value}
                          onChange={field.onChange}
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
                        placeholder={t("message_placeholder")}
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
                  disabled={isSubmitting}
                  className="rounded-full bg-[#C9B47A] text-primary hover:bg-[#b6a26e] flex items-center gap-2 px-8 h-12 font-semibold text-base"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    t("send_button")
                  )}
                  {!isSubmitting && (
                    <Send size={18} className={isRTL ? "scale-x-[-1]" : ""} />
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
