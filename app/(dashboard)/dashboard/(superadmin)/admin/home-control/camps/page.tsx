"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "@/components/rich-text-editor";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";

export default function CampsControlPage() {
  const t = useTranslations("camps_control");
  const tCommon = useTranslations("common");

  const campsSchema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, t("validation.title_required")),
        description: z.string().min(10, t("validation.desc_min")),
      }),
    [t]
  );

  type CampsFormValues = z.infer<typeof campsSchema>;

  const form = useForm<CampsFormValues>({
    resolver: zodResolver(campsSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: CampsFormValues) => {
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.title")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.title_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.description")}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder={t("form.desc_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>{t("info_label")}</FormLabel>
                <p className="text-sm text-muted-foreground">
                  {t("info_text")}
                </p>
              </div>

              <Button type="submit">{tCommon("save_changes")}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
