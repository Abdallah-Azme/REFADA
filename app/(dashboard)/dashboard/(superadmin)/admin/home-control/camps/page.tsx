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

const campsSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
});

type CampsFormValues = z.infer<typeof campsSchema>;

export default function CampsControlPage() {
  const form = useForm<CampsFormValues>({
    resolver: zodResolver(campsSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (data: CampsFormValues) => {
    console.log("Saving camps section:", data);
    // Here you would typically save to your backend
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم المخيمات</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل محتوى قسم المخيمات</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل العنوان" {...field} />
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
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="أدخل الوصف"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>إدارة المخيمات المعروضة</FormLabel>
                <p className="text-sm text-muted-foreground">
                  يتم عرض المخيمات تلقائياً من قاعدة البيانات. يمكنك هنا تخصيص
                  العنوان والوصف العام للقسم.
                </p>
              </div>

              <Button type="submit">حفظ التغييرات</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
