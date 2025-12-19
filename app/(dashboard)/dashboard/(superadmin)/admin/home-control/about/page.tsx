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
import { usePages, useUpdatePage } from "@/features/pages/hooks/use-pages";
import { PageEditFormDialog } from "@/features/pages/components/page-edit-form-dialog";
import {
  PageUpdateFormValues,
  PageData,
} from "@/features/pages/types/page.schema";
import { useEffect, useState } from "react";
import { ShieldCheck, Eye, Target, Edit, Loader2 } from "lucide-react";

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
  secondImage: z.string().optional(),
  secondImageFile: z.any().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

// Section card configuration
const SECTION_CONFIG = {
  mission: {
    title: "رسالتنا",
    icon: ShieldCheck,
  },
  vision: {
    title: "رؤيتنا",
    icon: Eye,
  },
  goals: {
    title: "أهدافنا",
    icon: Target,
  },
};

export default function AboutControlPage() {
  const { data: aboutData, isLoading: aboutLoading } = useAboutUs();
  const { mutate: updateAbout, isPending } = useUpdateAboutUs();
  const { data: pagesData, isLoading: pagesLoading } = usePages();
  const updatePageMutation = useUpdatePage();

  const [activeTab, setActiveTab] = useState("ar");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      image: "",
      secondImage: "",
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
        image: aboutData.data.image || "",
        secondImage: aboutData.data.second_image || "",
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

    if (data.secondImageFile) {
      formData.append("second_image", data.secondImageFile);
    }

    updateAbout(formData);
  };

  // Get mission, vision, goals from pages data
  const pages = pagesData?.data || [];
  const missionPage = pages.find((p) => p.pageType === "mission");
  const visionPage = pages.find((p) => p.pageType === "vision");
  const goalsPage = pages.find((p) => p.pageType === "goals");

  const handleEditSection = (page: PageData | undefined) => {
    if (page) {
      setEditingPage(page);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateSection = (values: PageUpdateFormValues) => {
    if (editingPage) {
      updatePageMutation.mutate(
        { pageType: editingPage.pageType, data: values },
        {
          onSuccess: () => {
            setEditDialogOpen(false);
            setEditingPage(null);
          },
        }
      );
    }
  };

  if (aboutLoading || pagesLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3">جاري التحميل...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">تحكم في قسم من نحن (About)</h1>

      {/* About Us Section */}
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

                <div className="pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="secondImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الصورة الثانية الحالية</FormLabel>
                        {field.value && (
                          <div className="mb-4">
                            <img
                              src={field.value}
                              alt="Current Second"
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
                                form.setValue("secondImageFile", file);
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

      {/* Mission, Vision, Goals Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">
          أقسام الرسالة والرؤية والأهداف
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Mission Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {SECTION_CONFIG.mission.title}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection(missionPage)}
                  disabled={!missionPage}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: missionPage?.description || "لا يوجد محتوى",
                }}
              />
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {SECTION_CONFIG.vision.title}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection(visionPage)}
                  disabled={!visionPage}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: visionPage?.description || "لا يوجد محتوى",
                }}
              />
            </CardContent>
          </Card>

          {/* Goals Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {SECTION_CONFIG.goals.title}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditSection(goalsPage)}
                  disabled={!goalsPage}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: goalsPage?.description || "لا يوجد محتوى",
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog for Mission/Vision/Goals */}
      {editingPage && (
        <PageEditFormDialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setEditingPage(null);
          }}
          pageData={editingPage}
          onSubmit={handleUpdateSection}
          isPending={updatePageMutation.isPending}
        />
      )}
    </div>
  );
}
