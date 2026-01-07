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
  useUpdateAboutUsSection,
} from "@/features/pages/hooks/use-about-us";
import { PageEditFormDialog } from "@/features/pages/components/page-edit-form-dialog";
import {
  PageUpdateFormValues,
  PageData,
} from "@/features/pages/types/page.schema";
import { useEffect, useState, useMemo } from "react";
import { ShieldCheck, Eye, Target, Edit, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutControlPage() {
  const t = useTranslations("about_control");
  const { data: aboutData, isLoading: aboutLoading } = useAboutUs();
  const updateSectionMutation = useUpdateAboutUsSection();
  const { mutate: updateAbout, isPending } = useUpdateAboutUs();

  const [activeTab, setActiveTab] = useState("ar");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<PageData | null>(null);

  // Schema creation inside component to access translations
  const aboutSchema = useMemo(
    () =>
      z.object({
        title: z.object({
          ar: z.string().min(1, t("validation.title_ar_required")),
          en: z.string().min(1, t("validation.title_en_required")),
        }),
        description: z.object({
          ar: z.string().min(10, t("validation.desc_ar_min")),
          en: z.string().min(10, t("validation.desc_en_min")),
        }),
        image: z.string().optional(),
        imageFile: z.any().optional(),
        secondImage: z.string().optional(),
        secondImageFile: z.any().optional(),
      }),
    [t]
  );

  type AboutFormValues = z.infer<typeof aboutSchema>;

  // Section card configuration with translations
  const sectionConfig = useMemo(
    () => ({
      mission: {
        title: t("sections.mission"),
        icon: ShieldCheck,
      },
      vision: {
        title: t("sections.vision"),
        icon: Eye,
      },
      goals: {
        title: t("sections.goals"),
        icon: Target,
      },
    }),
    [t]
  );

  // Get all page items from the array response
  const pageItems = aboutData?.data || [];

  // Find specific page items (cast to PageData for type compatibility)
  const aboutUsPage = pageItems.find((p) => p.pageType === "about_us");
  const missionPage = pageItems.find((p) => p.pageType === "mission") as
    | PageData
    | undefined;
  const visionPage = pageItems.find((p) => p.pageType === "vision") as
    | PageData
    | undefined;
  const goalsPage = pageItems.find((p) => p.pageType === "goals") as
    | PageData
    | undefined;

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
    if (aboutUsPage) {
      form.reset({
        title: {
          ar: aboutUsPage.title?.ar || "",
          en: aboutUsPage.title?.en || "",
        },
        description: {
          ar: aboutUsPage.description?.ar || "",
          en: aboutUsPage.description?.en || "",
        },
        image: aboutUsPage.image || "",
        secondImage: aboutUsPage.second_image || "",
      });
    }
  }, [aboutUsPage, form]);

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

  const handleEditSection = (page: PageData | undefined) => {
    if (page) {
      setEditingPage(page);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateSection = (values: PageUpdateFormValues) => {
    if (editingPage) {
      updateSectionMutation.mutate(
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

  if (aboutLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{t("page_title")}</h1>

      {/* About Us Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="ar">{t("tabs.ar")}</TabsTrigger>
          <TabsTrigger value="en">{t("tabs.en")}</TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t("sections.edit_content")}</CardTitle>
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
                        <FormLabel>{t("form.title_ar_label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.title_ar_placeholder")}
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
                        <FormLabel>{t("form.description_ar_label")}</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder={t("form.description_ar_placeholder")}
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
                        <FormLabel>{t("form.title_en_label")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.title_en_placeholder")}
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
                        <FormLabel>{t("form.description_en_label")}</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder={t("form.description_en_placeholder")}
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
                        <FormLabel>{t("form.current_image")}</FormLabel>
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
                        <FormLabel>{t("form.current_second_image")}</FormLabel>
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
                  {isPending ? t("actions.saving") : t("actions.save_changes")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Tabs>

      {/* Mission, Vision, Goals Sections */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b pb-2">
          {t("sections.title_sections")}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Mission Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    {sectionConfig.mission.title}
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
                  __html:
                    typeof missionPage?.description === "object"
                      ? missionPage?.description?.ar || t("sections.no_content")
                      : missionPage?.description || t("sections.no_content"),
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
                    {sectionConfig.vision.title}
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
                  __html:
                    typeof visionPage?.description === "object"
                      ? visionPage?.description?.ar || t("sections.no_content")
                      : visionPage?.description || t("sections.no_content"),
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
                    {sectionConfig.goals.title}
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
                  __html:
                    typeof goalsPage?.description === "object"
                      ? goalsPage?.description?.ar || t("sections.no_content")
                      : goalsPage?.description || t("sections.no_content"),
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
          isPending={updateSectionMutation.isPending}
        />
      )}
    </div>
  );
}
