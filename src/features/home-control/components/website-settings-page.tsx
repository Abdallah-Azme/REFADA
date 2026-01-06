"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Loader2, Settings, Upload } from "lucide-react";
import {
  useWebsiteSettings,
  useUpdateWebsiteSettings,
  websiteSettingsSchema,
  WebsiteSettingsFormValues,
} from "@/features/home-control";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function WebsiteSettingsPage() {
  const { data, isLoading } = useWebsiteSettings();
  const { mutate: updateSettings, isPending } = useUpdateWebsiteSettings();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const settings = data?.data;

  const form = useForm<WebsiteSettingsFormValues>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: {
      siteName: {
        en: "",
        ar: "",
      },
      phone: "",
      email: "",
      whatsapp: "",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName,
        phone: settings.phone,
        email: settings.email,
        whatsapp: settings.whatsapp,
        facebook: settings.facebook || "",
        twitter: settings.twitter || "",
        instagram: settings.instagram || "",
        linkedin: settings.linkedin || "",
        youtube: settings.youtube || "",
      });
      setLogoPreview(settings.siteLogo);
      setFaviconPreview(settings.favicon);
    }
  }, [settings, form]);

  const onSubmit = (values: WebsiteSettingsFormValues) => {
    updateSettings(values);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("siteLogo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("favicon", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full gap-6 p-8 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mr-3 text-gray-600">جاري تحميل الإعدادات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full gap-6 p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg flex gap-1 font-semibold text-gray-900">
          <Settings />
          إعدادات الموقع
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Site Information */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>معلومات الموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siteName.ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الموقع (عربي)</FormLabel>
                      <FormControl>
                        <Input placeholder="رفد" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="siteName.en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الموقع (إنجليزي)</FormLabel>
                      <FormControl>
                        <Input placeholder="Refad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Logo Upload */}
                <FormField
                  control={form.control}
                  name="siteLogo"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>شعار الموقع</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            {...field}
                          />
                          {logoPreview && (
                            <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                              <Image
                                src={logoPreview}
                                alt="Logo preview"
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Favicon Upload */}
                <FormField
                  control={form.control}
                  name="favicon"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>أيقونة الموقع (Favicon)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/x-icon,image/png"
                            onChange={handleFaviconChange}
                            {...field}
                          />
                          {faviconPreview && (
                            <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                              <Image
                                src={faviconPreview}
                                alt="Favicon preview"
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="+970 59 999 9999"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="info@refad.org"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الواتساب</FormLabel>
                      <FormControl>
                        <Input placeholder="+970599999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>روابط التواصل الاجتماعي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>فيسبوك</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/refadorg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تويتر</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/refadorg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>انستغرام</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/refadorg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>لينكد إن</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/company/refad"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>يوتيوب</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/refadorg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="min-w-32">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
