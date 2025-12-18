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
import { useHero, useUpdateHero, useDeleteSlide } from "../hooks/use-hero";
import { heroSchema, HeroFormValues, HeroSlide } from "../types/hero.schema";
import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  FileText,
  ImageIcon,
  Edit,
  ArrowLeft,
  ArrowRight,
  Trash2,
} from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export default function HeroSettingsPage() {
  const { data: heroData, isLoading, error } = useHero();
  const updateMutation = useUpdateHero();
  const deleteMutation = useDeleteSlide();
  const [selectedSlide, setSelectedSlide] = useState<HeroSlide | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);

  const handleDeleteSlide = (slideId: number) => {
    deleteMutation.mutate(slideId, {
      onSuccess: () => {
        setSlideToDelete(null);
      },
    });
  };

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

  // Populate form when a slide is selected
  useEffect(() => {
    if (selectedSlide) {
      form.reset({
        id: selectedSlide.id,
        hero_title_ar: selectedSlide.heroTitle?.ar || "",
        hero_title_en: selectedSlide.heroTitle?.en || "",
        hero_description_ar: selectedSlide.heroDescription?.ar || "",
        hero_description_en: selectedSlide.heroDescription?.en || "",
        hero_subtitle_ar: selectedSlide.heroSubtitle?.ar || "",
        hero_subtitle_en: selectedSlide.heroSubtitle?.en || "",
        hero_image: selectedSlide.heroImage || undefined,
        small_hero_image: selectedSlide.smallHeroImage || undefined,
      });
    }
  }, [selectedSlide, form]);

  const onSubmit = (values: HeroFormValues) => {
    updateMutation.mutate(
      {
        formValues: values,
        allSlides: slides,
        isNew: selectedSlide?.id === 0,
      },
      {
        onSuccess: () => {
          setSelectedSlide(null);
        },
      }
    );
  };

  const handleAddSlide = () => {
    // Create a temporary object for the new slide state
    // We cast to any or partial because it won't have an ID yet
    setSelectedSlide({ id: 0 } as HeroSlide);
    // Reset form to default values explicitly
    form.reset({
      hero_title_ar: "",
      hero_title_en: "",
      hero_description_ar: "",
      hero_description_en: "",
      hero_subtitle_ar: "",
      hero_subtitle_en: "",
      hero_image: undefined,
      small_hero_image: undefined,
    });
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

  const slides = heroData?.data?.slides || [];

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50/50 min-h-screen">
      <MainHeader
        header="إعدادات الواجهة الرئيسية"
        subheader={
          selectedSlide
            ? selectedSlide.id === 0
              ? "إضافة شريحة جديدة"
              : "تعديل الشريحة"
            : "قائمة الشرائح المعروضة"
        }
      />

      {/* List View */}
      {!selectedSlide && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <Card
              key={slide.id || index}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                {slide.heroImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={slide.heroImage}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">
                  #{index + 1}
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4
                    className="font-semibold line-clamp-1 text-right"
                    dir="rtl"
                  >
                    {slide.heroTitle?.ar || "بدون عنوان"}
                  </h4>
                  <p
                    className="text-sm text-gray-500 line-clamp-2 mt-1 text-right"
                    dir="rtl"
                  >
                    {slide.heroDescription?.ar || "بدون وصف"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedSlide(slide)}
                    className="flex-1"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    تعديل
                  </Button>
                  <AlertDialog
                    open={slideToDelete?.id === slide.id}
                    onOpenChange={(open) => !open && setSlideToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setSlideToDelete(slide)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription>
                          هل أنت متأكد من حذف هذه الشريحة؟ لا يمكن التراجع عن
                          هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            slide.id && handleDeleteSlide(slide.id)
                          }
                          className="bg-red-500 hover:bg-red-600"
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? "جاري الحذف..." : "حذف"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add New Slide Button Block */}
          <Card
            className="flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors group"
            onClick={handleAddSlide}
          >
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4">
              <div className="text-gray-400 group-hover:text-primary transition-colors text-4xl font-light">
                +
              </div>
            </div>
            <h3 className="font-semibold text-gray-600 group-hover:text-primary">
              إضافة شريحة جديدة
            </h3>
          </Card>

          {slides.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              لا توجد شرائح مضاف لعرضها.
            </div>
          )}
        </div>
      )}

      {/* Edit View */}
      {selectedSlide && (
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedSlide(null)}
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  العودة للقائمة
                </Button>

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
                      {selectedSlide.id === 0
                        ? "إنشاء الشريحة"
                        : "حفظ التعديلات"}
                    </>
                  )}
                </Button>
              </div>

              {/* Media Section */}
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
                              className="w-full max-w-[250px]"
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
                              imageClassName="w-full h-auto aspect-square object-cover"
                              className="w-full max-w-[150px] justify-center"
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

              {/* Content Section */}
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    النصوص الرئيسية{" "}
                    {selectedSlide.id !== 0 &&
                      `- شريحة #${
                        slides.findIndex((s) => s.id === selectedSlide.id) + 1
                      }`}
                  </CardTitle>
                  <CardDescription>
                    تخصيص العناوين والوصف لهذه الشريحة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 border-b pb-2 text-right">
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
                      <h3
                        className="font-semibold text-gray-900 border-b pb-2 text-left"
                        dir="ltr"
                      >
                        English
                      </h3>
                      <FormField
                        control={form.control}
                        name="hero_title_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className="text-left w-full block"
                              dir="ltr"
                            >
                              Main Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="direction-ltr bg-gray-50/50"
                                placeholder="English Title"
                                dir="ltr"
                              />
                            </FormControl>
                            <FormMessage className="text-left" dir="ltr" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hero_subtitle_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className="text-left w-full block"
                              dir="ltr"
                            >
                              Subtitle
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="direction-ltr bg-gray-50/50"
                                placeholder="English Subtitle"
                                dir="ltr"
                              />
                            </FormControl>
                            <FormMessage className="text-left" dir="ltr" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hero_description_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className="text-left w-full block"
                              dir="ltr"
                            >
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="direction-ltr min-h-[120px] bg-gray-50/50 resize-none"
                                placeholder="English Description"
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
      )}
    </div>
  );
}
