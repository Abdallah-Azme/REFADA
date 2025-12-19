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
  useUpdateSection,
  useCreateSection,
} from "@/features/home-control/hooks/use-hero";
import { useEffect } from "react";
import { Loader2, Save, FileText } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import { ImageUpload } from "@/components/ui/image-upload";

const policySchema = z.object({
  title_ar: z.string().min(1, "العنوان بالعربية مطلوب"),
  title_en: z.string().min(1, "العنوان بالإنجليزية مطلوب"),
  description_ar: z.string().min(1, "المحتوى بالعربية مطلوب"),
  description_en: z.string().min(1, "المحتوى بالإنجليزية مطلوب"),
  image: z.any().optional(),
});

type PolicyFormValues = z.infer<typeof policySchema>;

interface PolicyPageProps {
  sectionIndex: number;
  pageTitle: string;
  pageSubtitle: string;
}

export default function PolicyPage({
  sectionIndex,
  pageTitle,
  pageSubtitle,
}: PolicyPageProps) {
  const { data: heroData, isLoading, error } = useHero();
  const updateMutation = useUpdateSection();
  const createMutation = useCreateSection();

  // Check if the section exists in the database
  const sectionExists = heroData?.data?.sections?.[sectionIndex]?.id;

  const form = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      image: undefined,
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (heroData?.data?.sections && heroData.data.sections[sectionIndex]) {
      const section = heroData.data.sections[sectionIndex];
      form.reset({
        title_ar: section.title?.ar || "",
        title_en: section.title?.en || "",
        description_ar: section.description?.ar || "",
        description_en: section.description?.en || "",
        image: section.image || undefined,
      });
    }
  }, [heroData, sectionIndex, form]);

  const onSubmit = (values: PolicyFormValues) => {
    if (sectionExists) {
      // Update existing section
      const allSections = heroData?.data?.sections || [];
      updateMutation.mutate({
        sectionIndex,
        allSections: allSections.map((s) => ({
          id: s.id,
          title: s.title || { ar: "", en: "" },
          description: s.description || { ar: "", en: "" },
          image: s.image,
        })),
        title_ar: values.title_ar,
        title_en: values.title_en,
        description_ar: values.description_ar,
        description_en: values.description_en,
        image: values.image instanceof File ? values.image : undefined,
      });
    } else {
      // Create new section
      createMutation.mutate({
        title_ar: values.title_ar,
        title_en: values.title_en,
        description_ar: values.description_ar,
        description_en: values.description_en,
        image: values.image instanceof File ? values.image : undefined,
      });
    }
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

  const isPending = updateMutation.isPending || createMutation.isPending;

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50/50 min-h-screen">
      <MainHeader header={pageTitle} subheader={pageSubtitle} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="min-w-[150px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  {sectionExists ? "حفظ التغييرات" : "إنشاء القسم"}
                </>
              )}
            </Button>
          </div>

          {/* Image Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>صورة القسم</CardTitle>
              <CardDescription>صورة مصاحبة للقسم (اختياري)</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={updateMutation.isPending}
                        imageClassName="w-full h-auto aspect-video object-cover"
                        className="w-full max-w-[300px]"
                        placeholder="رفع صورة"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Content Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {pageTitle}
              </CardTitle>
              <CardDescription>تعديل عنوان ومحتوى الصفحة</CardDescription>
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
                            placeholder="أدخل العنوان بالعربية"
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
                        <FormLabel>المحتوى</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[200px] bg-gray-50/50 resize-none"
                            placeholder="أدخل المحتوى بالعربية..."
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
                            placeholder="Enter title in English"
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
                          Content
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[200px] bg-gray-50/50 resize-none"
                            placeholder="Enter content in English..."
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
