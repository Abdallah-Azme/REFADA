"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Separator } from "@/shared/ui/separator";
import { useHero, useUpdateHero } from "../hooks/use-hero";
import { heroSchema, HeroFormValues } from "../types/hero.schema";
import { useEffect } from "react";
import { Loader2, Save, FileText, ImageIcon } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export default function HeroSettingsPage() {
  const { data: heroData, isLoading, error } = useHero();
  const updateMutation = useUpdateHero();

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      hero_title_ar: "",
      hero_title_en: "",
      hero_description_ar: "",
      hero_description_en: "",
      hero_subtitle_ar: "",
      hero_subtitle_en: "",
      hero_image: undefined,
      small_hero_image: undefined,
    },
  });

  useEffect(() => {
    if (heroData?.data) {
      let data: any = heroData.data;

      // Handle array response (if API returns collection)
      if (Array.isArray(data)) {
        data = data.length > 0 ? data[0] : null;
      }

      if (!data) return;

      // Helper to safely get localized value whether it's flat or nested
      const getLocalized = (val: any, lang: "ar" | "en") => {
        if (!val) return "";
        if (typeof val === "string") return val;
        if (typeof val === "object" && val[lang]) return val[lang];
        return "";
      };

      // API returns camelCase keys: heroTitle, heroDescription, heroSubtitle, heroImage, smallHeroImage
      const formValues = {
        hero_title_ar: getLocalized(data.heroTitle, "ar") || "",
        hero_title_en: getLocalized(data.heroTitle, "en") || "",
        hero_description_ar: getLocalized(data.heroDescription, "ar") || "",
        hero_description_en: getLocalized(data.heroDescription, "en") || "",
        hero_subtitle_ar: getLocalized(data.heroSubtitle, "ar") || "",
        hero_subtitle_en: getLocalized(data.heroSubtitle, "en") || "",
        hero_image: data.heroImage,
        small_hero_image: data.smallHeroImage,
      };

      form.reset(formValues);
    }
  }, [heroData, form]);

  const onSubmit = (values: HeroFormValues) => {
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
      <MainHeader header="إعدادات الواجهة الرئيسية" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="content" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="bg-white border">
                <TabsTrigger
                  value="content"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <FileText className="w-4 h-4 ml-2" />
                  المحتوى النصي
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <ImageIcon className="w-4 h-4 ml-2" />
                  الوسائط (الصور)
                </TabsTrigger>
              </TabsList>

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
                    حفظ التعديلات
                  </>
                )}
              </Button>
            </div>

            <TabsContent value="content" className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    النصوص الرئيسية
                  </CardTitle>
                  <CardDescription>
                    تخصيص العناوين والوصف للواجهة الرئيسية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Global Styles for inputs */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">
                        العربية
                      </h3>
                      <FormField
                        control={form.control}
                        name="hero_title_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>العنوان الرئيسي</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-gray-50/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hero_subtitle_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>العنوان الفرعي</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-gray-50/50" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hero_description_ar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الوصف</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="min-h-[120px] bg-gray-50/50 resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2">
                        English
                      </h3>
                      <FormField
                        control={form.control}
                        name="hero_title_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Main Title</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="direction-ltr bg-gray-50/50"
                                placeholder="English Title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hero_subtitle_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="direction-ltr bg-gray-50/50"
                                placeholder="English Subtitle"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hero_description_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="direction-ltr min-h-[120px] bg-gray-50/50 resize-none"
                                placeholder="English Description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      الصورة الرئيسية (Banner)
                    </CardTitle>
                    <CardDescription>
                      الصورة الكبيرة في الخلفية. يفضل مقاس عرضي (16:9).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="hero_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              disabled={updateMutation.isPending}
                              imageClassName="w-full h-auto aspect-video object-cover"
                              className="w-full"
                              placeholder="رفع صورة البانر"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">الصورة المصغرة</CardTitle>
                    <CardDescription>
                      الصورة الجانبية أو المتراكبة. يفضل مقاس مربع (1:1).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="small_hero_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              disabled={updateMutation.isPending}
                              imageClassName="w-full h-auto aspect-square object-cover max-w-[300px] mx-auto"
                              className="w-full justify-center"
                              placeholder="رفع صورة مصغرة"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
