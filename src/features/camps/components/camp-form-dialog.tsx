"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
}

export function CampFormDialog({
  initialData,
  onSubmit,
  onCancel,
  role = "representative",
}: CampFormDialogProps) {
  const t = useTranslations("camps");
  const { form } = useCampForm(initialData);
  const { data: governorates } = useGovernorates();

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
          onSubmit={form.handleSubmit(handleSubmit)}
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="description_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description_ar")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("desc_ar_placeholder")}
                      className="min-h-[100px]"
                      {...field}
                    />
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
                    <Textarea
                      placeholder={t("desc_en_placeholder")}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("save")}</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
