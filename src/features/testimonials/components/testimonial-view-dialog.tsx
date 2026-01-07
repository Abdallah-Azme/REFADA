"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Testimonial } from "../types/testimonial.schema";
import { Badge } from "@/shared/ui/badge";
import { Calendar, MessageSquare, User, Quote } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface TestimonialViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: Testimonial | null;
}

export function TestimonialViewDialog({
  open,
  onOpenChange,
  testimonial,
}: TestimonialViewDialogProps) {
  const t = useTranslations("testimonials_page");

  if (!testimonial) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const opinionText =
    typeof testimonial.opinion === "object" && testimonial.opinion !== null
      ? (testimonial.opinion as any)["ar"] ||
        (testimonial.opinion as any)["en"] ||
        JSON.stringify(testimonial.opinion)
      : String(testimonial.opinion);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Quote className="h-6 w-6 text-primary" />
            {t("dialog_view.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info Card */}
          <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("dialog_view.info_title")}
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden shrink-0">
                  {testimonial.userImage ? (
                    <Image
                      src={testimonial.userImage}
                      alt={testimonial.userName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      {t("dialog_view.name")}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {testimonial.userName}
                    </p>
                  </div>
                  {testimonial.order && (
                    <div>
                      <Badge variant="outline">
                        {t("columns.rating")}: {testimonial.order}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opinion Card */}
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                <div className="h-1 w-8 bg-primary rounded-full"></div>
                {t("dialog_view.content")}
              </h3>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 relative">
                <Quote className="h-8 w-8 text-primary/10 absolute top-2 right-2 rotate-180" />
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap relative z-10 text-lg">
                  &quot;{opinionText}&quot;
                </p>
                <Quote className="h-8 w-8 text-primary/10 absolute bottom-2 left-2" />
              </div>
            </CardContent>
          </Card>

          {/* Date Footer */}
          {testimonial.createdAt && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {t("dialog_view.date_added")}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(testimonial.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
