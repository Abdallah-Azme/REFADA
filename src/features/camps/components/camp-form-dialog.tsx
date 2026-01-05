"use client";

import { useTranslations } from "next-intl";
import React, { lazy, Suspense, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const RichTextEditor = lazy(() => import("@/components/rich-text-editor"));
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampForm } from "../hooks/use-camp-form";
import { Camp, CampFormValues } from "../types/camp.schema";
import { useGovernorates } from "@/features/dashboard/hooks/use-governorates";
import { ImageUpload } from "@/components/ui/image-upload";
import LocationPickerMap from "./location-picker-map";

interface CampFormDialogProps {
  initialData: Camp | null;
  onSubmit: (data: CampFormValues) => void;
  onCancel: () => void;
  role?: "admin" | "representative";
  isLoading?: boolean;
}

export function CampFormDialog({
  initialData,
  onSubmit,
  onCancel,
  role = "representative",
  isLoading = false,
}: CampFormDialogProps) {
  const t = useTranslations("camps");
  const { form } = useCampForm(initialData);
  const { data: governorates } = useGovernorates();

  // Find governorate ID by name when governorate is a string
  useEffect(() => {
    if (initialData && governorates?.data) {
      let governorateId = "";

      if (initialData.governorate_id) {
        governorateId = initialData.governorate_id.toString();
      } else if (initialData.governorate) {
        if (
          typeof initialData.governorate === "object" &&
          "id" in initialData.governorate
        ) {
          governorateId = initialData.governorate.id.toString();
        } else if (typeof initialData.governorate === "string") {
          // Find governorate by name
          const foundGov = governorates.data.find(
            (gov) => gov.name === initialData.governorate
          );
          if (foundGov) {
            governorateId = foundGov.id.toString();
          }
        }
      }

      if (governorateId && form.getValues("governorate_id") !== governorateId) {
        form.setValue("governorate_id", governorateId);
      }
    }
  }, [initialData, governorates, form]);

  const handleSubmit = (data: CampFormValues) => {
    onSubmit(data);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {initialData ? t("edit_camp") : t("add_camp")}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, (errors) => {
            console.error(
              "[DEBUG CampFormDialog] Form validation FAILED! Errors:",
              errors
            );
          })}
          className="space-y-4 py-4"
        >
          <FormField
            control={form.control}
            name="camp_img"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>{t("camp_img")}</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={value}
                    onChange={(file) => onChange(file)}
                    onRemove={() => onChange(undefined)}
                    placeholder={t("upload_placeholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("camp_name_ar")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("name_ar_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("camp_name_en")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("name_en_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="governorate_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("governorate")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger
                      className={
                        form.formState.errors.governorate_id
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder={t("select_governorate")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {governorates?.data.map((gov) => (
                      <SelectItem key={gov.id} value={gov.id.toString()}>
                        {gov.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("location")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("location_placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description_ar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description_ar")}</FormLabel>
                <FormControl>
                  <Suspense
                    fallback={
                      <div className="h-40 w-full animate-pulse bg-gray-100 rounded-md" />
                    }
                  >
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder={t("desc_ar_placeholder")}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description_en")}</FormLabel>
                <FormControl>
                  <Suspense
                    fallback={
                      <div className="h-40 w-full animate-pulse bg-gray-100 rounded-md" />
                    }
                  >
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder={t("desc_en_placeholder")}
                    />
                  </Suspense>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {role !== "admin" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("capacity")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentOccupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("current_occupancy")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>{t("location_on_map")}</FormLabel>
                <LocationPickerMap
                  value={{
                    lat: form.watch("coordinates.lat") || 31.4,
                    lng: form.watch("coordinates.lng") || 34.4,
                  }}
                  onChange={(coords) => {
                    form.setValue("coordinates.lat", coords.lat);
                    form.setValue("coordinates.lng", coords.lng);
                  }}
                  height="250px"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("save")}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
