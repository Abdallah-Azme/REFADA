"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  Users,
  CheckCircle2,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FamilyMember } from "@/features/contributors/api/contributors.api";

interface Family {
  id: number;
  familyName: string;
  totalMembers: number;
  nationalId: string;
  addedByContributor?: boolean;
  hasBenefit?: boolean;
  members?: FamilyMember[];
}

interface FamilySelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    selectedFamilies: Map<number, string>,
    selectedMembers: Map<number, string>,
  ) => void;
  families: Family[];
  isLoading: boolean;
  initialSelection?: Map<number, string>;
  initialMemberSelection?: Map<number, string>;
}

export default function FamilySelectionDialog({
  isOpen,
  onClose,
  onConfirm,
  families,
  isLoading,
  initialSelection = new Map(),
  initialMemberSelection = new Map(),
}: FamilySelectionDialogProps & {
  initialMemberSelection?: Map<number, string>;
  onConfirm: (
    selectedFamilies: Map<number, string>,
    selectedMembers: Map<number, string>,
  ) => void;
}) {
  const t = useTranslations("contributions");
  const tCommon = useTranslations("common");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedFamilies, setSelectedFamilies] =
    useState<Map<number, string>>(initialSelection);
  const [selectedMembers, setSelectedMembers] = useState<Map<number, string>>(
    initialMemberSelection,
  );
  const [expandedFamilies, setExpandedFamilies] = useState<number[]>([]);

  const [chosenFilter, setChosenFilter] = useState<string>("all");
  const [benefitFilter, setBenefitFilter] = useState<string>("all");

  // Filter families based on selected filters
  const filteredFamilies = useMemo(() => {
    let result = [...families];

    // Filter by chosen (addedByContributor)
    if (chosenFilter === "yes") {
      result = result.filter((f) => f.addedByContributor === true);
    } else if (chosenFilter === "no") {
      result = result.filter((f) => !f.addedByContributor);
    }

    // Filter by benefit status
    if (benefitFilter === "yes") {
      result = result.filter((f) => f.hasBenefit === true);
    } else if (benefitFilter === "no") {
      result = result.filter((f) => !f.hasBenefit);
    }

    return result;
  }, [families, chosenFilter, benefitFilter]);

  // Auto-select all filtered families when a filter is applied
  useEffect(() => {
    const hasActiveFilter =
      chosenFilter !== "all" ||
      benefitFilter !== "all" ||
      globalFilter.trim() !== "";

    if (hasActiveFilter && filteredFamilies.length > 0) {
      const newSelection = new Map(selectedFamilies);
      filteredFamilies.forEach((family) => {
        if (!newSelection.has(family.id)) {
          // Check disabled state? Usually bulk select ignores disabled
          const isDisabled = family.hasBenefit || family.addedByContributor;
          if (!isDisabled) {
            newSelection.set(family.id, "1");
          }
        }
      });
      setSelectedFamilies(newSelection);
    }
  }, [chosenFilter, benefitFilter, globalFilter, filteredFamilies]);

  // Export to Excel function - only exports selected (checked) families
  const handleExportExcel = () => {
    // Get only selected families
    const selectedFamilyIds = Array.from(selectedFamilies.keys());
    const familiesToExport = families.filter((f) =>
      selectedFamilyIds.includes(f.id),
    );

    if (familiesToExport.length === 0) {
      return; // Nothing to export
    }

    // Create CSV content
    const headers = [
      t("family_name"),
      t("national_id"),
      t("members"),
      t("quantity"),
    ];
    const rows = familiesToExport.map((f) => [
      f.familyName,
      f.nationalId,
      f.totalMembers.toString(),
      selectedFamilies.get(f.id) || "1",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Add BOM for Arabic support
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `families_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auto-select suggested families and benefited families when dialog opens
  useEffect(() => {
    if (isOpen && families.length > 0) {
      console.log(
        "Auto-selecting families/members. Total families:",
        families.length,
      );
      const newSelection = new Map(initialSelection);
      const newMemberSelection = new Map(initialMemberSelection);
      const newExpandedFamilies = new Set<number>(expandedFamilies);

      families.forEach((family) => {
        // Auto-select families that are addedByContributor or have already benefited
        if (
          (family.addedByContributor || family.hasBenefit) &&
          !newSelection.has(family.id)
        ) {
          console.log(
            `Auto-selecting family ${family.id} (${family.familyName})`,
          );
          newSelection.set(family.id, "1");
        }

        // Check members
        if (family.members && family.members.length > 0) {
          let hasSelectedMember = false;
          family.members.forEach((member) => {
            // Check strictly for true
            if (
              member.addedByContributor === true ||
              member.hasBenefit === true
            ) {
              if (!newMemberSelection.has(member.id)) {
                console.log(
                  `Auto-selecting member ${member.id} (${member.name}) in family ${family.id}`,
                );
                newMemberSelection.set(member.id, "1");
                hasSelectedMember = true;
              }
            }
          });

          if (hasSelectedMember) {
            newExpandedFamilies.add(family.id);
          }
        }
      });
      setSelectedFamilies(newSelection);
      setSelectedMembers(newMemberSelection);
      setExpandedFamilies(Array.from(newExpandedFamilies));
    }
  }, [isOpen, families, initialSelection, initialMemberSelection]);

  const handleToggleFamily = (familyId: number) => {
    // Find the family to check if it's disabled
    const family = families.find((f) => f.id === familyId);
    if (family?.hasBenefit || family?.addedByContributor) {
      return; // Don't allow toggling if already benefited or chosen by contributor
    }

    const newMap = new Map(selectedFamilies);
    if (newMap.has(familyId)) {
      newMap.delete(familyId);
    } else {
      newMap.set(familyId, "1");
      // Deselect members if family is selected? Or keep them?
      // Usually if family is selected, members don't need to be selected individually unless we want double counting (which is bad)
      // For now, let's keep them independent or clear members if family is selected
    }
    setSelectedFamilies(newMap);
  };

  const handleToggleMember = (memberId: number) => {
    const newMap = new Map(selectedMembers);
    if (newMap.has(memberId)) {
      newMap.delete(memberId);
    } else {
      newMap.set(memberId, "1");
    }
    setSelectedMembers(newMap);
  };

  const handleQuantityChange = (familyId: number, value: string) => {
    const newMap = new Map(selectedFamilies);
    if (newMap.has(familyId)) {
      newMap.set(familyId, value);
      setSelectedFamilies(newMap);
    }
  };

  const toggleExpandFamily = (familyId: number) => {
    console.log("toggleExpandFamily clicked for familyId:", familyId);
    setExpandedFamilies((prev) =>
      prev.includes(familyId)
        ? prev.filter((id) => id !== familyId)
        : [...prev, familyId],
    );
  };

  const columns: ColumnDef<Family>[] = [
    {
      id: "select",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("select_row")}</span>
      ),
      cell: ({ row }) => {
        const isSelected = selectedFamilies.has(row.original.id);
        const isDisabled =
          row.original.hasBenefit === true ||
          row.original.addedByContributor === true;

        return (
          <div className="flex justify-center w-[50px]">
            <Checkbox
              checked={isSelected}
              disabled={isDisabled}
              onCheckedChange={() =>
                !isDisabled && handleToggleFamily(row.original.id)
              }
              className={`h-5 w-5 rounded-md border-2 transition-all ${
                isDisabled
                  ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                  : isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:border-primary/50"
              }`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "familyName",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("family_name")}</span>
      ),
      cell: ({ row }) => {
        const isChosen = row.original.addedByContributor;
        const hasBenefited = row.original.hasBenefit;
        const family = row.original;
        const isExpanded = expandedFamilies.includes(family.id);

        return (
          <div className="flex items-center gap-2">
            {family.members && family.members.length > 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandFamily(family.id);
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-6" /> // Spacer
            )}

            <span
              className={`font-medium ${
                hasBenefited ? "text-gray-400" : "text-gray-800"
              }`}
            >
              {row.original.familyName}
            </span>
            {isChosen && (
              <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-0.5 shadow-sm">
                <CheckCircle2 className="w-3 h-3 ml-1" />
                {t("chosen_by_contributor")}
              </Badge>
            )}
            {hasBenefited && (
              <Badge className="bg-gray-400 text-white text-xs px-2 py-0.5">
                {t("already_benefited")}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "nationalId",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("national_id")}</span>
      ),
      cell: ({ row }) => (
        <span className="text-gray-600 font-mono text-sm whitespace-nowrap">
          {row.original.nationalId}
        </span>
      ),
    },
    {
      accessorKey: "totalMembers",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("members")}</span>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700">
            {row.original.totalMembers}
          </span>
        </div>
      ),
    },
    {
      id: "quantity",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("quantity")}</span>
      ),
      cell: ({ row }) => {
        const isSelected = selectedFamilies.has(row.original.id);
        const isAlreadyBenefited = row.original.hasBenefit === true;
        const isChosenByContributor = row.original.addedByContributor === true;
        const isDisabled = isAlreadyBenefited || isChosenByContributor;

        if (!isSelected) {
          return (
            <div className="flex justify-center">
              <span className="text-gray-300">-</span>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <Input
              type="number"
              min="1"
              disabled={isDisabled}
              className={`w-20 h-9 text-center font-semibold border-2 border-primary/30 focus:border-primary rounded-lg shadow-sm ${
                isDisabled ? "bg-gray-100 cursor-not-allowed opacity-50" : ""
              }`}
              value={selectedFamilies.get(row.original.id) || ""}
              onChange={(e) =>
                handleQuantityChange(row.original.id, e.target.value)
              }
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredFamilies,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleConfirm = () => {
    onConfirm(selectedFamilies, selectedMembers);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] sm:w-full max-w-4xl max-h-[90vh] bg-linear-to-br from-white to-gray-50 border-0 shadow-2xl overflow-hidden flex flex-col"
        dir="rtl"
      >
        <DialogHeader className="pb-4 border-b border-gray-100 shrink-0">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-xl">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <span className="truncate">{t("select_beneficiaries_title")}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-2 text-sm sm:text-base">
            {t("select_beneficiaries_desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pt-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center px-1">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1 sm:min-w-[200px]">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t("search_family")}
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pr-12 h-11 border-2 border-gray-200 focus:border-primary rounded-xl bg-white shadow-sm placeholder:text-gray-400 w-full"
              />
            </div>

            {/* Filters Container */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Chosen Filter */}
              <Select value={chosenFilter} onValueChange={setChosenFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-11 rounded-xl border-2 border-gray-200 bg-white">
                  <Filter className="w-4 h-4 ml-2 text-gray-500" />
                  <SelectValue placeholder={t("filter_chosen")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filter_all")}</SelectItem>
                  <SelectItem value="yes">{t("filter_chosen")}</SelectItem>
                  <SelectItem value="no">غير مختار</SelectItem>
                </SelectContent>
              </Select>

              {/* Benefit Filter */}
              <Select value={benefitFilter} onValueChange={setBenefitFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-11 rounded-xl border-2 border-gray-200 bg-white">
                  <Filter className="w-4 h-4 ml-2 text-gray-500" />
                  <SelectValue placeholder={t("filter_benefited")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filter_all")}</SelectItem>
                  <SelectItem value="yes">{t("filter_benefited")}</SelectItem>
                  <SelectItem value="no">لم يستفد</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button
                variant="outline"
                onClick={handleExportExcel}
                className="h-11 px-4 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 w-full sm:w-auto"
              >
                <Download className="w-4 h-4 ml-2" />
                {t("export_excel")}
              </Button>
            </div>
          </div>

          {/* Selected Count Badge - Only count NEW families (not already benefited) */}
          {(() => {
            const newFamiliesCount = Array.from(selectedFamilies.keys()).filter(
              (id) => {
                const family = families.find((f) => f.id === id);
                return (
                  family && !family.hasBenefit && !family.addedByContributor
                );
              },
            ).length;

            const newMembersCount = Array.from(selectedMembers.keys()).filter(
              (id) => {
                // Determine if member is valid to count (not added by contributor)
                // This might require scanning all families to find the member
                return true;
              },
            ).length;

            return newFamiliesCount > 0 || newMembersCount > 0 ? (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20 mx-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">
                  {newFamiliesCount} {t("families_benefited")}
                  {newMembersCount > 0 &&
                    `، ${newMembersCount} ${t("individuals")}`}
                </span>
              </div>
            ) : null;
          })()}

          {/* Table */}
          <div className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden mx-1">
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader className="bg-gray-50/80 sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-gray-200"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-center py-4 px-4"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="text-gray-500">جاري التحميل...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row, index) => {
                      const isSelected = selectedFamilies.has(row.original.id);
                      const isChosen = row.original.addedByContributor;
                      const hasBenefited = row.original.hasBenefit;
                      const isDisabled = hasBenefited || isChosen;
                      const isExpanded = expandedFamilies.includes(
                        row.original.id,
                      );
                      const family = row.original;

                      return (
                        <>
                          <TableRow
                            key={row.id}
                            className={`
                            transition-all duration-200
                            ${
                              isDisabled
                                ? "cursor-not-allowed opacity-60"
                                : "cursor-pointer"
                            }
                            ${
                              isSelected
                                ? "bg-primary/5 hover:bg-primary/10"
                                : isDisabled
                                  ? "bg-gray-50"
                                  : "hover:bg-gray-50"
                            }
                            ${
                              isChosen && !isSelected && !hasBenefited
                                ? "bg-green-50/50"
                                : ""
                            }
                            ${
                              index !== table.getRowModel().rows.length - 1
                                ? "border-b border-gray-100"
                                : ""
                            }
                          `}
                            onClick={() =>
                              !isDisabled && handleToggleFamily(row.original.id)
                            }
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                className="text-center py-4 px-4"
                                onClick={(e) => {
                                  // Prevent row click for quantity input
                                  if (cell.column.id === "quantity") {
                                    e.stopPropagation();
                                  }
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                          {/* Expanded Members Row */}
                          {isExpanded &&
                            family.members &&
                            family.members.length > 0 && (
                              <TableRow className="bg-gray-50/50">
                                <TableCell
                                  colSpan={columns.length}
                                  className="p-0"
                                >
                                  <div className="p-4 pr-12 space-y-2 border-t border-gray-100">
                                    <div className="text-sm font-semibold text-gray-500 mb-2">
                                      أفراد العائلة:
                                    </div>
                                    {family.members.map((member) => {
                                      const isMemberSelected =
                                        selectedMembers.has(member.id);
                                      const isMemberDisabled =
                                        member.hasBenefit ||
                                        member.addedByContributor;

                                      return (
                                        <div
                                          key={member.id}
                                          className={`flex items-center justify-between p-3 rounded-lg border ${
                                            isMemberDisabled
                                              ? "bg-gray-100 border-gray-200 opacity-70"
                                              : isMemberSelected
                                                ? "bg-white border-primary shadow-sm"
                                                : "bg-white border-gray-200 hover:border-blue-200"
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <Checkbox
                                              checked={isMemberSelected}
                                              disabled={isMemberDisabled}
                                              onCheckedChange={() =>
                                                handleToggleMember(member.id)
                                              }
                                              className={
                                                isMemberSelected
                                                  ? "bg-primary border-primary text-white"
                                                  : ""
                                              }
                                            />
                                            <div className="flex flex-col text-right">
                                              <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800">
                                                  {member.name}
                                                </span>
                                                {member.addedByContributor && (
                                                  <Badge
                                                    variant="secondary"
                                                    className="text-[10px] bg-green-100 text-green-700 h-5"
                                                  >
                                                    {t("chosen_by_contributor")}
                                                  </Badge>
                                                )}
                                              </div>
                                              <div className="flex gap-3 text-xs text-gray-500">
                                                <span>
                                                  {new Date(
                                                    member.dob,
                                                  ).toLocaleDateString("ar-EG")}
                                                </span>
                                                <span>•</span>
                                                <span>{member.ageGroup}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                        </>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <Users className="w-12 h-12 opacity-50" />
                          <span>{t("no_results")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">
              {t("prev")} {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount() || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 rounded-lg"
              >
                {t("prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 rounded-lg"
              >
                {t("next")}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 h-11 rounded-xl border-2 hover:bg-gray-100"
            >
              {t("cancel")}
            </Button>
            {(() => {
              // Count only NEW families (not already benefited or added by contributor)
              const newFamiliesCount = Array.from(
                selectedFamilies.keys(),
              ).filter((id) => {
                const family = families.find((f) => f.id === id);
                return (
                  family && !family.hasBenefit && !family.addedByContributor
                );
              }).length;

              const newMembersCount = selectedMembers.size; // Simplify for now

              return (
                <Button
                  onClick={handleConfirm}
                  disabled={newFamiliesCount === 0 && newMembersCount === 0}
                  className="px-8 h-11 rounded-xl bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
                >
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                  {t("add_families")} ({newFamiliesCount + newMembersCount})
                </Button>
              );
            })()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
