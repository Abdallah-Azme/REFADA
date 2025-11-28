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
import { Plus, Trash2, GripVertical, Upload } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

const testimonialSchema = z.object({
  name: z.string().min(1, "اسم المستفيد مطلوب"),
  text: z.string().min(10, "نص الرأي يجب أن يكون 10 أحرف على الأقل"),
  image: z.string().optional(),
});

const testimonialsSchema = z.object({
  testimonials: z
    .array(testimonialSchema)
    .min(1, "يجب أن يكون هناك رأي واحد على الأقل"),
});

type TestimonialsFormValues = z.infer<typeof testimonialsSchema>;

export default function TestimonialsControlPage() {
  const form = useForm<TestimonialsFormValues>({
    resolver: zodResolver(testimonialsSchema),
    defaultValues: {
      testimonials: [
        { name: "محمد أحمد", text: "خدمة ممتازة...", image: "" },
        { name: "سارة علي", text: "شكراً لكم...", image: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testimonials",
  });

  const handleAddTestimonial = () => {
    append({
      name: "",
      text: "",
      image: "",
    });
  };

  const handleDeleteTestimonial = (index: number) => {
    if (fields.length <= 1) {
      alert("يجب أن يكون هناك رأي واحد على الأقل");
      return;
    }
    remove(index);
  };

  const onSubmit = (data: TestimonialsFormValues) => {
    console.log("Saving testimonials:", data);
    // Here you would typically save to your backend
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">تحكم في قسم آراء المستفيدين</h1>
        <Button type="button" onClick={handleAddTestimonial}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة رأي جديد
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="relative group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <CardTitle className="text-sm font-medium">
                      رأي {index + 1}
                    </CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteTestimonial(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="w-24 h-24 bg-gray-100 rounded-md flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 hover:border-primary/50 transition-colors cursor-pointer shrink-0">
                              <Upload className="h-6 w-6 mb-1" />
                              <span className="text-[10px]">صورة</span>
                              <Input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file.name);
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>اسم المستفيد</FormLabel>
                          <FormControl>
                            <Input placeholder="اسم المستفيد" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`testimonials.${index}.text`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نص الرأي</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="نص الرأي"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" size="lg">
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
