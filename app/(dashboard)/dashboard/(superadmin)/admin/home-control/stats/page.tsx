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
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";

export default function StatsControlPage() {
  const t = useTranslations("stats_control");
  const tCommon = useTranslations("common");

  const statSchema = useMemo(
    () =>
      z.object({
        label: z.string().min(1, t("validation.label_required")),
        value: z.string().min(1, t("validation.value_required")),
      }),
    [t]
  );

  const statsSchema = useMemo(
    () =>
      z.object({
        stats: z.array(statSchema).min(1, t("validation.min_stats")),
      }),
    [t, statSchema]
  );

  type StatsFormValues = z.infer<typeof statsSchema>;

  const form = useForm<StatsFormValues>({
    resolver: zodResolver(statsSchema),
    defaultValues: {
      stats: [
        { label: t("defaults.beneficiaries"), value: "1000+" },
        { label: t("defaults.projects"), value: "50+" },
        { label: t("defaults.volunteers"), value: "200+" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stats",
  });

  const handleAddStat = () => {
    append({ label: "", value: "" });
  };

  const handleDeleteStat = (index: number) => {
    if (fields.length <= 1) {
      toast.error(t("validation.min_stats"));
      return;
    }
    remove(index);
  };

  const onSubmit = (data: StatsFormValues) => {
    // Here you would typically save to your backend
    toast.success(tCommon("toast.save_success"));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("page_title")}</h1>
        <Button type="button" onClick={handleAddStat}>
          <Plus className="w-4 h-4 ml-2" />
          {t("add_stat")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("edit_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg space-y-4 relative"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {t("stat_item")} {index + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteStat(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`stats.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("label_label")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholders.label")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`stats.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("value_label")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("placeholders.value")}
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

              <Button type="submit">{t("save_changes")}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
