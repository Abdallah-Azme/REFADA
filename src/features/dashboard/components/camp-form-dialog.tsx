"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const campSchema = z
  .object({
    name: z.string().min(1, "اسم الإيواء مطلوب"),
    location: z.string().min(1, "الموقع مطلوب"),
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    capacity: z.number().min(1, "السعة يجب أن تكون أكبر من 0"),
    currentOccupancy: z.number().min(0, "الإشغال يجب أن يكون 0 أو أكثر"),
    coordinates: z.object({
      lat: z.number().min(-90).max(90, "خط العرض يجب أن يكون بين -90 و 90"),
      lng: z.number().min(-180).max(180, "خط الطول يجب أن يكون بين -180 و 180"),
    }),
  })
  .refine((data) => data.currentOccupancy <= data.capacity, {
    message: "الإشغال الحالي لا يمكن أن يكون أكبر من السعة الكلية",
    path: ["currentOccupancy"],
  });

export type CampFormValues = z.infer<typeof campSchema>;

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
          {initialData ? "تعديل الإيواء" : "إضافة إيواء جديد"}
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
                <FormLabel>اسم الإيواء</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم الإيواء" {...field} />
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
                <FormLabel>الموقع</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل موقع الإيواء" {...field} />
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
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="أدخل وصف الإيواء"
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
                  <FormLabel>السعة الكلية</FormLabel>
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
                  <FormLabel>الإشغال الحالي</FormLabel>
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
                  <FormLabel>خط العرض (Latitude)</FormLabel>
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
                  <FormLabel>خط الطول (Longitude)</FormLabel>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
