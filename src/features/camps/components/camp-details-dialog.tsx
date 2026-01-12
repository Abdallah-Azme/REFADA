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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("campDetails");

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-3 text-gray-600">{t("loading")}</span>
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
          <DialogTitle className="text-2xl">{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Camp Image */}
          {camp.campImg && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={camp.campImg}
                alt={camp?.name || "Camp Image"}
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
                <h4 className="font-semibold text-gray-700 mb-2">
                  {t("description")}
                </h4>
                <div
                  className="text-gray-600 leading-relaxed [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5"
                  dangerouslySetInnerHTML={{ __html: camp.description }}
                />
              </div>
            )}

            {/* Location */}
            {camp.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-700">
                    {t("location")}
                  </h4>
                  <p className="text-gray-600">{camp.location}</p>
                  {camp.governorate && (
                    <p className="text-sm text-gray-500 mt-1">
                      {t("governorate")}:{" "}
                      {typeof camp.governorate === "string"
                        ? camp.governorate
                        : camp.governorate.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("familyCount")}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {camp.statistics?.familyCount || camp.familyCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("memberCount")}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {camp.statistics?.memberCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">{t("projectCount")}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {camp.statistics?.projectCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Account */}
            {camp.bankAccount && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-1">
                  {t("bankAccount")}
                </h4>
                <p className="text-gray-900 font-mono">{camp.bankAccount}</p>
              </div>
            )}

            {/* Coordinates */}
            {(camp.latitude || camp.longitude) && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">
                  {t("coordinates")}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t("latitude")}: </span>
                    <span className="font-mono">{camp.latitude || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("longitude")}: </span>
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
                  {t("createdAt")}:{" "}
                  {camp.createdAt
                    ? new Date(camp.createdAt).toLocaleDateString("ar-EG")
                    : "N/A"}
                </span>
              </div>
              {camp.updatedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {t("updatedAt")}:{" "}
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
