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
import RichTextEditor from "@/components/rich-text-editor";
import { Plus, Trash2 } from "lucide-react";

const socialLinkSchema = z.object({
  platform: z.string().min(1, "اسم المنصة مطلوب"),
  url: z.string().url("الرابط غير صحيح"),
});

const footerSchema = z.object({
  about: z.string().min(10, "النبذة يجب أن تكون 10 أحرف على الأقل"),
  copyright: z.string().min(1, "حقوق النشر مطلوبة"),
  socialLinks: z.array(socialLinkSchema),
});

type FooterFormValues = z.infer<typeof footerSchema>;

export default function FooterControlPage() {
  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      about: "",
      copyright: "",
      socialLinks: [
        { platform: "Facebook", url: "" },
        { platform: "Twitter", url: "" },
        { platform: "Instagram", url: "" },
        { platform: "LinkedIn", url: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const handleAddSocialLink = () => {
    append({ platform: "", url: "" });
  };

  const handleDeleteSocialLink = (index: number) => {
    remove(index);
  };

  const onSubmit = (data: FooterFormValues) => {
    console.log("Saving footer:", data);
    // Here you would typically save to your backend
    alert("تم حفظ التغييرات بنجاح!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في تذييل الصفحة (Footer)</h1>

      <Card>
        <CardHeader>
          <CardTitle>تعديل محتوى التذييل</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نبذة مختصرة</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="نبذة مختصرة عن الجمعية"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="copyright"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حقوق النشر</FormLabel>
                    <FormControl>
                      <Input placeholder="جميع الحقوق محفوظة..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>روابط التواصل الاجتماعي</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSocialLink}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة رابط
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-lg space-y-3 relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">
                          رابط {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteSocialLink(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.platform`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المنصة</FormLabel>
                            <FormControl>
                              <Input placeholder="Facebook" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرابط</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://facebook.com/..."
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
              </div>

              <Button type="submit">حفظ التغييرات</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
