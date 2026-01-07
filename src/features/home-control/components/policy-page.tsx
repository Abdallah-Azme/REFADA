"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import {
  useHero,
  useUpdateSection,
  useCreateSection,
} from "@/features/home-control/hooks/use-hero";
import { useEffect, lazy, Suspense, useMemo } from "react";
import { Loader2, Save, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

const RichTextEditor = lazy(() => import("@/components/rich-text-editor"));
import MainHeader from "@/shared/components/main-header";
import { ImageUpload } from "@/components/ui/image-upload";

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
  const t = useTranslations("policies_page");
  const tCommon = useTranslations("common");
  const { data: heroData, isLoading, error } = useHero();
  const updateMutation = useUpdateSection();
  const createMutation = useCreateSection();

  const policySchema = useMemo(
    () =>
      z.object({
        title_ar: z.string().min(1, t("validation.title_ar_required")),
        title_en: z.string().min(1, t("validation.title_en_required")),
        description_ar: z.string().min(1, t("validation.content_ar_required")),
        description_en: z.string().min(1, t("validation.content_en_required")),
        image: z.any().optional(),
      }),
    [t]
  );

  type PolicyFormValues = z.infer<typeof policySchema>;

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
        <span className="mr-3 text-gray-600">{tCommon("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <p className="text-red-600 mb-2">{tCommon("error_loading")}</p>
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
                  {t("actions.saving")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  {sectionExists
                    ? t("actions.save_changes")
                    : t("actions.create_section")}
                </>
              )}
            </Button>
          </div>

          {/* Image Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{t("form.image_label")}</CardTitle>
              <CardDescription>{t("form.image_optional")}</CardDescription>
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {pageTitle}
                </CardTitle>
                <CardDescription>{pageSubtitle}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ar" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="ar">
                    {tCommon("languages.ar")}
                  </TabsTrigger>
                  <TabsTrigger value="en">
                    {tCommon("languages.en")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ar" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.title_ar")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-50/50"
                            placeholder={t("form.title_ar")}
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
                        <FormLabel>{t("form.content_ar")}</FormLabel>
                        <FormControl>
                          <Suspense
                            fallback={
                              <div className="h-40 w-full animate-pulse bg-gray-100 rounded-md" />
                            }
                          >
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder={t("form.content_ar")}
                            />
                          </Suspense>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="en" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left w-full block" dir="ltr">
                          {t("form.title_en")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-50/50"
                            placeholder={t("form.title_en")}
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
                          {t("form.content_en")}
                        </FormLabel>
                        <FormControl>
                          <Suspense
                            fallback={
                              <div className="h-40 w-full animate-pulse bg-gray-100 rounded-md" />
                            }
                          >
                            <RichTextEditor
                              content={field.value}
                              onChange={field.onChange}
                              placeholder={t("form.content_en")}
                            />
                          </Suspense>
                        </FormControl>
                        <FormMessage className="text-left" dir="ltr" />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
