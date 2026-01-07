"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";

export default function FooterControlPage() {
  const t = useTranslations("footer_control");
  const tCommon = useTranslations("common");

  const socialLinkSchema = useMemo(
    () =>
      z.object({
        platform: z.string().min(1, t("validation.platform_required")),
        url: z.string().url(t("validation.url_invalid")),
      }),
    [t]
  );

  const footerSchema = useMemo(
    () =>
      z.object({
        about: z.string().min(10, t("validation.about_min")),
        copyright: z.string().min(1, t("validation.copyright_required")),
        socialLinks: z.array(socialLinkSchema),
      }),
    [t, socialLinkSchema]
  );

  type FooterFormValues = z.infer<typeof footerSchema>;

  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      about: "",
      copyright: "",
      socialLinks: [
        { platform: "Facebook", url: "" },
        { platform: "Twitter", url: "" },
        { platform: "Instagram", url: "" },
        { platform: "LinkedIn", url: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const handleAddSocialLink = () => {
    append({ platform: "", url: "" });
  };

  const handleDeleteSocialLink = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: FooterFormValues) => {
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
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.about")}</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder={t("form.about_placeholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="copyright"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.copyright")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.copyright_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>{t("form.social_links")}</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSocialLink}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    {t("form.add_link")}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-lg space-y-3 relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">
                          {t("form.link_num")} {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSocialLink(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.platform`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.platform")}</FormLabel>
                            <FormControl>
                              <Input placeholder="Facebook" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.url")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://facebook.com/..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit">{tCommon("save_changes")}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
