"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";

export default function ContactControlPage() {
  const t = useTranslations("contact_control");
  const tCommon = useTranslations("common");

  const contactSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("validation.email_invalid")),
        phone: z.string().min(1, t("validation.phone_required")),
        address: z.string().min(1, t("validation.address_required")),
        mapUrl: z
          .string()
          .url(t("validation.map_invalid"))
          .optional()
          .or(z.literal("")),
      }),
    [t]
  );

  type ContactFormValues = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      phone: "",
      address: "",
      mapUrl: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    // Here you would typically save to your backend
    toast.success(tCommon("toast.save_success"));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t("page_title")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("card_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.email_placeholder")}
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
                    <FormLabel>{t("form.phone")}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="+970 59 000 0000"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.address")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.address_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mapUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.map_url")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.map_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">{tCommon("save_changes")}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
