"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "@/components/rich-text-editor";
import {
  useAboutUs,
  useUpdateAboutUs,
} from "@/features/pages/hooks/use-about-us";
import { useEffect, useState } from "react";

const aboutSchema = z.object({
  title: z.object({
    ar: z.string().min(1, "العنوان بالعربية مطلوب"),
    en: z.string().min(1, "Title in English is required"),
  }),
  description: z.object({
    ar: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    en: z.string().min(10, "Description must be at least 10 characters"),
  }),
  image: z.string().optional(),
  imageFile: z.any().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

export default function AboutControlPage() {
  const { data: aboutData, isLoading } = useAboutUs();
  const { mutate: updateAbout, isPending } = useUpdateAboutUs();
  const [activeTab, setActiveTab] = useState("ar");

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      image: "",
    },
  });

  useEffect(() => {
    if (aboutData?.data) {
      form.reset({
        title: {
          ar: aboutData.data.title.ar,
          en: aboutData.data.title.en,
        },
        description: {
          ar: aboutData.data.description.ar,
          en: aboutData.data.description.en,
        },
        image: aboutData.data.image,
      });
    }
  }, [aboutData, form]);

  const onSubmit = (data: AboutFormValues) => {
    const formData = new FormData();
    formData.append("title[ar]", data.title.ar);
    formData.append("title[en]", data.title.en);
    formData.append("description[ar]", data.description.ar);
    formData.append("description[en]", data.description.en);

    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    updateAbout(formData);
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم من نحن (About)</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>تعديل محتوى من نحن</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <TabsContent value="ar" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title.ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان (بالعربية)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل العنوان بالعربية"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description.ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الوصف (بالعربية)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="أدخل الوصف بالعربية"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter title in English"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description.en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Enter description in English"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <div className="pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الصورة الحالية</FormLabel>
                        {field.value && (
                          <div className="mb-4">
                            <img
                              src={field.value}
                              alt="Current"
                              className="max-w-[200px] rounded-md border"
                            />
                          </div>
                        )}
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                form.setValue("imageFile", file);
                                // Optional: Update preview immediately
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  field.onChange(
                                    event.target?.result as string
                                  );
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isPending}>
                  {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
