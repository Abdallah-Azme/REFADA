"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Camp } from "@/features/dashboard/table-cols/admin-camps-cols";

// Create schema function to use translations
const createCampSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(1, t("validation.name_required")),
      location: z.string().min(1, t("validation.location_required")),
      description: z.string().min(10, t("validation.description_min")),
      capacity: z.number().min(0, t("validation.capacity_min")),
      currentOccupancy: z.number().min(0, t("validation.occupancy_min")),
      coordinates: z.object({
        lat: z.number().min(-90).max(90, t("validation.lat_range")),
        lng: z.number().min(-180).max(180, t("validation.lng_range")),
      }),
    })
    .refine((data) => data.currentOccupancy <= data.capacity, {
      message: t("validation.occupancy_error"),
      path: ["currentOccupancy"],
    });

export type CampFormValues = z.infer<ReturnType<typeof createCampSchema>>;

interface CampFormDialogProps {
  initialData: Camp | null;
  onSubmit: (data: CampFormValues) => void;
  onCancel: () => void;
}

export default function CampFormDialog({
  initialData,
  onSubmit,
  onCancel,
}: CampFormDialogProps) {
  const t = useTranslations("camps");
  const campSchema = createCampSchema(t);

  const form = useForm<CampFormValues>({
    resolver: zodResolver(campSchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      capacity: 0,
      currentOccupancy: 0,
      coordinates: { lat: 0, lng: 0 },
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        location: initialData.location,
        description: initialData.description,
        capacity: initialData.capacity,
        currentOccupancy: initialData.currentOccupancy,
        coordinates: initialData.coordinates,
      });
    } else {
      form.reset({
        name: "",
        location: "",
        description: "",
        capacity: 0,
        currentOccupancy: 0,
        coordinates: { lat: 0, lng: 0 },
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: CampFormValues) => {
    onSubmit(data);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {initialData ? t("edit_title") : t("add_title")}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 py-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("columns.name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("columns.location")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("columns.location")} {...field} />
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
                <FormLabel>{t("desc_ar")}</FormLabel>
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="coordinates.lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("latitude")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="31.5"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coordinates.lng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("longitude")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.000001"
                      placeholder="34.45"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 pt-4">
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
