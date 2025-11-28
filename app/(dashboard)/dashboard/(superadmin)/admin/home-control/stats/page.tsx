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

const statSchema = z.object({
  label: z.string().min(1, "عنوان الإحصائية مطلوب"),
  value: z.string().min(1, "قيمة الإحصائية مطلوبة"),
});

const statsSchema = z.object({
  stats: z.array(statSchema).min(1, "يجب أن يكون هناك إحصائية واحدة على الأقل"),
});

type StatsFormValues = z.infer<typeof statsSchema>;

export default function StatsControlPage() {
  const form = useForm<StatsFormValues>({
    resolver: zodResolver(statsSchema),
    defaultValues: {
      stats: [
        { label: "عدد المستفيدين", value: "1000+" },
        { label: "عدد المشاريع", value: "50+" },
        { label: "عدد المتطوعين", value: "200+" },
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
      alert("يجب أن يكون هناك إحصائية واحدة على الأقل");
      return;
    }
    remove(index);
  };

  const onSubmit = (data: StatsFormValues) => {
    console.log("Saving stats:", data);
    // Here you would typically save to your backend
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تحكم في قسم الإحصائيات</h1>
        <Button type="button" onClick={handleAddStat}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة إحصائية
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تعديل الإحصائيات</CardTitle>
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
                      <h3 className="font-semibold">إحصائية {index + 1}</h3>
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
                          <FormLabel>عنوان الإحصائية</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: عدد المستفيدين"
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
                          <FormLabel>قيمة الإحصائية</FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: 1000+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <Button type="submit">حفظ التغييرات</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
