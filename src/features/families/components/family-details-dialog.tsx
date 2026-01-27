"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog"; // Assuming shared UI path
import { Family } from "../types/family.schema";
import { useFamily } from "../hooks/use-families";
import { useFamilyStatistics } from "../hooks/use-families";
import {
  Loader2,
  Users,
  MapPin,
  Phone,
  Tent,
  CreditCard,
  User,
  Calendar,
} from "lucide-react";
import { Badge } from "@/src/shared/ui/badge";
import { useTranslations } from "next-intl";

interface FamilyDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  family: Family | null;
}

export default function FamilyDetailsDialog({
  isOpen,
  onClose,
  family: initialFamily,
}: FamilyDetailsDialogProps) {
  const t = useTranslations("families");

  // Fetch full details if we have an ID
  const { data: response, isLoading } = useFamily(initialFamily?.id || null);
  const family = response?.data || initialFamily;

  // Fetch statistics for male/female counts
  const { data: statisticsResponse, isLoading: isLoadingStats } =
    useFamilyStatistics(initialFamily?.id || null);
  const statistics = statisticsResponse?.data;

  if (!family) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <span>{family.familyName}</span>
              <Badge variant="outline">{family.maritalStatus || ""}</Badge>
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoading && !response ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {/* Basic Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <Users className="h-6 w-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-500">
                  {t("members_count_label")}
                </span>
                <span className="text-xl font-bold text-blue-700">
                  {statistics?.totalMembers ?? family.totalMembers}
                </span>
                {isLoadingStats ? (
                  <div className="text-xs text-gray-400 mt-1">
                    <Loader2 className="h-3 w-3 animate-spin inline" />
                  </div>
                ) : statistics ? (
                  <div className="text-xs text-gray-400 mt-1 flex gap-2">
                    <span>
                      {t("male")}: {statistics.malesCount}
                    </span>
                    <span>
                      {t("female")}: {statistics.femalesCount}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <Tent className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm text-gray-500">
                  {t("residence_location")}
                </span>
                <span className="font-bold text-green-700">
                  {family.camp || ""}
                </span>
                <span className="text-xs text-green-600">
                  {t("tent")}:{" "}
                  {family.tentNumber && family.tentNumber !== "undefined"
                    ? family.tentNumber
                    : "-"}
                </span>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                <CreditCard className="h-6 w-6 text-purple-600 mb-2" />
                <span className="text-sm text-gray-500">
                  {t("national_id_label")}
                </span>
                <span className="font-bold text-purple-700">
                  {family.nationalId || ""}
                </span>
              </div>
            </div>

            {/* Detailed Info Grid */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {t("contact_info")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {t("phone_number")}
                  </span>
                  <span className="text-sm font-medium" dir="ltr">
                    {family.phone || ""}
                  </span>
                </div>
                {family.backupPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {t("backup_phone_label")}
                    </span>
                    <span className="text-sm font-medium" dir="ltr">
                      {family.backupPhone}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{t("address")}</span>
                  <span className="text-sm font-medium">
                    {family.location && family.location !== "undefined"
                      ? family.location
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{t("dob")}</span>
                  <span className="text-sm font-medium">
                    {family.dob || ""}
                  </span>
                </div>
              </div>
            </div>

            {family.notes && (
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  {t("notes_title")}
                </h3>
                <p className="text-sm text-yellow-700">{family.notes}</p>
              </div>
            )}

            {family.fileUrl && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("attachments_title")}
                </h3>
                <img
                  src={family.fileUrl}
                  alt={t("family_document_alt")}
                  className="w-full max-h-60 object-contain rounded-lg border bg-gray-100"
                />
              </div>
            )}

            {/* Family Members Section */}
            {family.members && family.members.length > 0 && (
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {t("family_members") || "أفراد العائلة"} (
                    {family.members.length})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          {t("full_name")}
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          {t("national_id_label")}
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          {t("gender")}
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          {t("dob_label")}
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          {t("relationship") || "صلة القرابة"}
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                          {t("medical_condition")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {family.members.map((member, index) => (
                        <tr
                          key={member.id || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  member.gender === "male"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-pink-100 text-pink-600"
                                }`}
                              >
                                <User className="h-4 w-4" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {member.name || ""}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-start">
                            {member.nationalId || ""}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={
                                member.gender === "male"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-pink-50 text-pink-700 border-pink-200"
                              }
                            >
                              {member.gender === "male"
                                ? t("male")
                                : t("female")}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {member.dob || ""}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {member.relationship || "-"}
                          </td>
                          <td className="px-4 py-3">
                            {member.medicalConditions &&
                            member.medicalConditions.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {member.medicalConditions.map(
                                  (condition, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="bg-orange-50 text-orange-700 border-orange-200"
                                    >
                                      {condition}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            ) : member.medicalCondition ? (
                              <Badge
                                variant="secondary"
                                className="bg-orange-50 text-orange-700 border-orange-200"
                              >
                                {member.medicalCondition}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
