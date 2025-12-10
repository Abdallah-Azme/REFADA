"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camp } from "../types/camp.schema";
import { Loader2, MapPin, Calendar, Users, Baby, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { campService } from "../services/camp.service";
import Image from "next/image";

interface CampDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  camp: Camp | null;
  isLoading?: boolean;
}

export function CampDetailsDialog({
  open,
  onOpenChange,
  camp,
  isLoading,
}: CampDetailsDialogProps) {
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">جاري تحميل التفاصيل...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!camp) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">تفاصيل الإيواء</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Camp Image */}
          {camp.campImg && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={camp.campImg}
                alt={camp.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{camp.name}</h3>
              {camp.slug && (
                <p className="text-sm text-gray-500 mt-1">#{camp.slug}</p>
              )}
            </div>

            {/* Status Badge */}
            {camp.status && (
              <Badge
                variant={camp.status === "active" ? "default" : "secondary"}
              >
                {campService.getStatusLabel(camp.status)}
              </Badge>
            )}

            {/* Description */}
            {camp.description && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">الوصف</h4>
                <p className="text-gray-600">{camp.description}</p>
              </div>
            )}

            {/* Location */}
            {camp.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-700">الموقع</h4>
                  <p className="text-gray-600">{camp.location}</p>
                  {camp.governorate && (
                    <p className="text-sm text-gray-500 mt-1">
                      المحافظة:{" "}
                      {typeof camp.governorate === "string"
                        ? camp.governorate
                        : camp.governorate.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">عدد العائلات</p>
                  <p className="text-lg font-bold text-gray-900">
                    {camp.familyCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Baby className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">عدد الأطفال</p>
                  <p className="text-lg font-bold text-gray-900">
                    {camp.childrenCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">عدد المسنين</p>
                  <p className="text-lg font-bold text-gray-900">
                    {camp.elderlyCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Account */}
            {camp.bankAccount && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">
                  رقم الحساب البنكي
                </h4>
                <p className="text-gray-900 font-mono">{camp.bankAccount}</p>
              </div>
            )}

            {/* Coordinates */}
            {(camp.latitude || camp.longitude) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">الإحداثيات</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">خط العرض: </span>
                    <span className="font-mono">{camp.latitude || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">خط الطول: </span>
                    <span className="font-mono">{camp.longitude || "N/A"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  تم الإنشاء:{" "}
                  {camp.createdAt
                    ? new Date(camp.createdAt).toLocaleDateString("ar-EG")
                    : "N/A"}
                </span>
              </div>
              {camp.updatedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    آخر تحديث:{" "}
                    {new Date(camp.updatedAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
