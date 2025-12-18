"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import {
  useHero,
  useUpdateAboutSection,
} from "@/features/home-control/hooks/use-hero";
import { useEffect } from "react";
import { Loader2, Save, FileText } from "lucide-react";
import MainHeader from "@/shared/components/main-header";

const aboutSectionSchema = z.object({
  title_ar: z.string().min(1, "العنوان بالعربية مطلوب"),
  title_en: z.string().min(1, "العنوان بالإنجليزية مطلوب"),
  description_ar: z.string().min(1, "الوصف بالعربية مطلوب"),
  description_en: z.string().min(1, "الوصف بالإنجليزية مطلوب"),
});

type AboutSectionFormValues = z.infer<typeof aboutSectionSchema>;

export default function AboutSectionPage() {
  const { data: heroData, isLoading, error } = useHero();
  const updateMutation = useUpdateAboutSection();

  const form = useForm<AboutSectionFormValues>({
    resolver: zodResolver(aboutSectionSchema),
    defaultValues: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (heroData?.data) {
      form.reset({
        title_ar: heroData.data.title?.ar || "",
        title_en: heroData.data.title?.en || "",
        description_ar: heroData.data.description?.ar || "",
        description_en: heroData.data.description?.en || "",
      });
    }
  }, [heroData, form]);

  const onSubmit = (values: AboutSectionFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3 text-gray-600">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-red-600 mb-2">حدث خطأ أثناء تحميل البيانات</p>
          <p className="text-sm text-gray-500">
            {(error as any)?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50/50 min-h-screen">
      <MainHeader
        header="إعدادات قسم من نحن"
        subheader="تعديل العنوان والوصف المعروض في الصفحة الرئيسية"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={updateMutation.isPending}
              className="min-w-[150px]"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>

          {/* Content Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                قسم من نحن - الصفحة الرئيسية
              </CardTitle>
              <CardDescription>
                هذا القسم يظهر في الصفحة الرئيسية تحت البانر الرئيسي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Arabic Fields */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2 text-right">
                    العربية
                  </h3>
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-50/50"
                            placeholder="مثال: من نحن"
                            dir="rtl"
                          />
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
                        <FormLabel>الوصف</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[150px] bg-gray-50/50 resize-none"
                            placeholder="أدخل الوصف بالعربية..."
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* English Fields */}
                <div className="space-y-4">
                  <h3
                    className="font-semibold text-gray-900 border-b pb-2 text-left"
                    dir="ltr"
                  >
                    English
                  </h3>
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full block" dir="ltr">
                          Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-50/50"
                            placeholder="Example: About Us"
                            dir="ltr"
                          />
                        </FormControl>
                        <FormMessage className="text-left" dir="ltr" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full block" dir="ltr">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[150px] bg-gray-50/50 resize-none"
                            placeholder="Enter description in English..."
                            dir="ltr"
                          />
                        </FormControl>
                        <FormMessage className="text-left" dir="ltr" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
