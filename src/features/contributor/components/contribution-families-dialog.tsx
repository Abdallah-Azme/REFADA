"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContributorFamily,
  ContributorMember,
} from "@/features/contributor/api/contributor-history.api";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

interface ContributionFamiliesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  families: ContributorFamily[];
  members?: ContributorMember[];
  projectName?: string;
}

export default function ContributionFamiliesDialog({
  isOpen,
  onClose,
  families,
  members = [],
  projectName,
}: ContributionFamiliesDialogProps) {
  const t = useTranslations("contributor_history");
  const [activeTab, setActiveTab] = React.useState<string>("families");

  // Reset tab to families when dialog opens or members change
  React.useEffect(() => {
    if (isOpen) {
      if (families.length > 0) {
        setActiveTab("families");
      } else if (members && members.length > 0) {
        setActiveTab("members");
      }
    }
  }, [isOpen, families.length, members?.length]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">{t("title")}</span>
            {projectName && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600 font-medium">{projectName}</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {t("page_subtitle") || "عرض تفاصيل الأفراد والعائلات المستفيدة"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/50 p-1">
              <TabsTrigger
                value="families"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-2.5"
              >
                {t("families")}
                <span className="ms-2 px-1.5 py-0.5 rounded-full bg-gray-200 text-xs text-gray-600">
                  {families.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-2.5"
              >
                {t("members")}
                <span className="ms-2 px-1.5 py-0.5 rounded-full bg-gray-200 text-xs text-gray-600">
                  {members.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto custom-scrollbar border rounded-lg">
              <TabsContent value="families" className="m-0 h-full">
                {families.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("family_name")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("national_id")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("phone")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("total_members")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("camp")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("location")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {families.map((family, index) => (
                        <TableRow
                          key={`${family.id}-${index}`}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="font-bold text-right text-primary">
                            {family.familyName}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {family.nationalId}
                          </TableCell>
                          <TableCell className="text-right">
                            {family.phone}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                              {family.totalMembers}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {family.camp}
                          </TableCell>
                          <TableCell className="text-right text-gray-500">
                            {family.location && family.location !== "undefined"
                              ? family.location
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <span>{t("no_families_found")}</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="members" className="m-0 h-full">
                {members.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("member_name")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("national_id")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("gender")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("age")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("medical_conditions")}
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-700">
                          {t("relationship")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member, index) => (
                        <TableRow
                          key={`${member.id}-${index}`}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell className="font-bold text-right text-primary">
                            {member.name}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {member.nationalId}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                member.gender === "male"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-pink-50 text-pink-600"
                              }`}
                            >
                              {member.gender === "male"
                                ? "ذكر"
                                : member.gender === "female"
                                  ? "أنثى"
                                  : member.gender}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {member.dob
                              ? new Date().getFullYear() -
                                new Date(member.dob).getFullYear()
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {member.medicalConditions &&
                            member.medicalConditions.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-end">
                                {member.medicalConditions.map(
                                  (condition: string, i: number) => (
                                    <span
                                      key={i}
                                      className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 text-[10px] font-medium border border-red-100"
                                    >
                                      {condition}
                                    </span>
                                  ),
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                              {member.relationship}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <span>{t("no_members_found")}</span>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
