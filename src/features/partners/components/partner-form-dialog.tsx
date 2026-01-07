"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { PartnerFormValues, Partner } from "../types/partner.schema";
import { useEffect, useState, useMemo } from "react";
import { Loader2, Upload, Building2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import * as z from "zod";

interface PartnerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partner | null;
  onSubmit: (data: PartnerFormValues) => void;
  isPending?: boolean;
}

export function PartnerFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
}: PartnerFormDialogProps) {
  const t = useTranslations("partners_page");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const localizedSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t("validation.name_required")),
        order: z.number().min(0, t("validation.order_min")).default(0),
        logo: z.any().optional(),
      }),
    [t]
  );

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(localizedSchema),
    defaultValues: {
      name: "",
      order: 0,
      logo: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        order: initialData.order || 0,
      });

      if (initialData.logo) {
        setLogoPreview(initialData.logo);
      }
    } else {
      form.reset({
        name: "",
        order: 0,
        logo: undefined,
      });
      setLogoPreview(null);
    }
  }, [initialData, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (data: PartnerFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("dialog_form.title_edit")
              : t("dialog_form.title_add")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dialog_form.name_label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("dialog_form.name_placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo Upload */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>{t("dialog_form.logo_label")}</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div className="relative h-40 w-full rounded-lg overflow-hidden border-2 border-dashed bg-gray-50 flex items-center justify-center shrink-0">
                        {logoPreview ? (
                          <Image
                            src={logoPreview}
                            alt="Preview"
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <ImageIcon className="h-10 w-10" />
                            <span className="text-sm">
                              {t("dialog_form.logo_preview")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          {...field}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          {t("dialog_form.logo_hint")}
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("dialog_form.order_label")}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {t("dialog_form.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    {t("dialog_form.save_loading")}
                  </>
                ) : initialData ? (
                  t("dialog_form.update")
                ) : (
                  t("dialog_form.add")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
