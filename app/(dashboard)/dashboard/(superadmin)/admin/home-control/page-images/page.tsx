"use client";

import {
  useHero,
  useUpdatePageImages,
} from "@/features/home-control/hooks/use-hero";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ImageIcon, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PageImagesPage() {
  const { data: heroData, isLoading } = useHero();
  const updateMutation = useUpdatePageImages();

  const [complaintImageFile, setComplaintImageFile] = useState<File | null>(
    null
  );
  const [contactImageFile, setContactImageFile] = useState<File | null>(null);
  const [complaintPreview, setComplaintPreview] = useState<string | null>(null);
  const [contactPreview, setContactPreview] = useState<string | null>(null);

  const currentComplaintImage = heroData?.data?.complaintImage;
  const currentContactImage = heroData?.data?.contactImage;

  const handleComplaintImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setComplaintImageFile(file);
      setComplaintPreview(URL.createObjectURL(file));
    }
  };

  const handleContactImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContactImageFile(file);
      setContactPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!complaintImageFile && !contactImageFile) return;

    updateMutation.mutate(
      {
        complaintImage: complaintImageFile || undefined,
        contactImage: contactImageFile || undefined,
      },
      {
        onSuccess: () => {
          setComplaintImageFile(null);
          setContactImageFile(null);
          setComplaintPreview(null);
          setContactPreview(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">صور الصفحات</h1>
          <p className="text-muted-foreground">
            إدارة صور صفحة الشكاوى/الاقتراحات وصفحة تواصل معنا
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={
            updateMutation.isPending ||
            (!complaintImageFile && !contactImageFile)
          }
          className="gap-2"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          حفظ التغييرات
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Complaint/Suggestions Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              صورة صفحة الشكاوى والاقتراحات
            </CardTitle>
            <CardDescription>
              الصورة التي تظهر في صفحة الشكاوى والاقتراحات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Image Preview */}
            <div className="relative h-48 w-full rounded-lg border bg-muted overflow-hidden">
              {complaintPreview || currentComplaintImage ? (
                <Image
                  src={complaintPreview || currentComplaintImage || ""}
                  alt="صورة صفحة الشكاوى"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Upload Input */}
            <div className="space-y-2">
              <Label htmlFor="complaint-image">تغيير الصورة</Label>
              <Input
                id="complaint-image"
                type="file"
                accept="image/*"
                onChange={handleComplaintImageChange}
                className="cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Us Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              صورة صفحة تواصل معنا
            </CardTitle>
            <CardDescription>
              الصورة التي تظهر في صفحة تواصل معنا
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Image Preview */}
            <div className="relative h-48 w-full rounded-lg border bg-muted overflow-hidden">
              {contactPreview || currentContactImage ? (
                <Image
                  src={contactPreview || currentContactImage || ""}
                  alt="صورة صفحة تواصل معنا"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Upload Input */}
            <div className="space-y-2">
              <Label htmlFor="contact-image">تغيير الصورة</Label>
              <Input
                id="contact-image"
                type="file"
                accept="image/*"
                onChange={handleContactImageChange}
                className="cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
