"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

import { Loader2, RotateCcw, SearchCheck, Trash2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PaginationControls from "./pagination-controls";
import { createAdminContributionColumns } from "../table-cols/admin-contribution-cols";
import {
  getAdminContributionsApi,
  AdminContribution,
  deleteFamilyFromContributionApi,
  ContributorFamily,
  deleteContributionApi,
} from "@/features/contributors/api/contributors.api";
import { listProjectsApi, Project } from "@/features/projects/api/projects.api";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

const formSchema = z.object({
  project: z.string().optional(),
  status: z.string().optional(),
});

// ========================================
// ADMIN CONTRIBUTION DETAILS DIALOG
// ========================================
function AdminContributionDetailsDialog({
  isOpen,
  onClose,
  contribution,
  onFamilyDeleted,
}: {
  isOpen: boolean;
  onClose: () => void;
  contribution: AdminContribution | null;
  onFamilyDeleted: () => void;
}) {
  const [deletingFamily, setDeletingFamily] =
    useState<ContributorFamily | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("contributions");
  const tCommon = useTranslations("common");

  if (!contribution) return null;

  const handleDeleteFamily = async () => {
    if (!deletingFamily || !contribution) return;

    setIsDeleting(true);
    try {
      const response = await deleteFamilyFromContributionApi(
        contribution.id,
        deletingFamily.id,
      );
      if (response.success) {
        toast.success(t("delete_family_success"));
        onFamilyDeleted();
        setDeletingFamily(null);
      } else {
        toast.error(response.message || t("delete_family_success"));
      }
    } catch (error: any) {
      console.error("Failed to delete family:", error);
      toast.error(error?.message || t("delete_family_success"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-right">
              {t("details_title")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-right">
            {/* Project Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("project")}
              </h4>
              {contribution.project ? (
                <>
                  <p className="text-gray-600">{contribution.project.name}</p>
                  <p className="text-sm text-gray-500">
                    {t("project_type")}: {contribution.project.type}
                  </p>
                </>
              ) : (
                <p className="text-gray-400">{t("no_project")}</p>
              )}
            </div>

            {/* Contribution Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {t("quantity")}
                </h4>
                <p className="text-2xl font-bold text-primary">
                  {contribution.totalQuantity}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {t("status")}
                </h4>
                <p
                  className={`font-medium ${
                    contribution.status === "pending"
                      ? "text-yellow-600"
                      : contribution.status === "approved"
                        ? "text-green-600"
                        : contribution.status === "rejected"
                          ? "text-red-600"
                          : "text-blue-600"
                  }`}
                >
                  {contribution.status === "pending"
                    ? t("status_pending")
                    : contribution.status === "approved"
                      ? t("status_approved")
                      : contribution.status === "rejected"
                        ? t("status_rejected")
                        : contribution.status === "completed"
                          ? t("status_completed")
                          : contribution.status}
                </p>
              </div>
            </div>

            {/* Families */}
            {contribution.contributorFamilies.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {t("families_benefited")} (
                  {contribution.contributorFamilies.length})
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {contribution.contributorFamilies.map((family) => (
                    <div
                      key={family.id}
                      className="flex justify-between items-center bg-white p-2 rounded border"
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <span className="font-medium">
                            {family.familyName}
                          </span>
                          <span className="text-gray-400 text-xs mr-2">
                            ({family.totalMembers} {t("members")})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {family.camp}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeletingFamily(family)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {contribution.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-1">
                  {t("notes")}
                </h4>
                <p className="text-gray-600">{contribution.notes}</p>
              </div>
            )}

            {/* Date */}
            <div className="text-sm text-gray-500 text-center">
              {t("contribution_date")}:{" "}
              {new Date(contribution.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingFamily}
        onOpenChange={() => setDeletingFamily(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">
              {t("delete_family_title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              {t("delete_family_desc", {
                name: deletingFamily?.familyName ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 sm:gap-3">
            <AlertDialogCancel disabled={isDeleting}>
              {tCommon("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFamily}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  {t("deleting")}
                </>
              ) : (
                t("confirm_delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ========================================
// MAIN TABLE COMPONENT
// ========================================
export default function AdminContributionsTable() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project: "",
      status: "",
    },
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const [data, setData] = useState<AdminContribution[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [pageCount, setPageCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] =
    useState<AdminContribution | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Delete Contribution State
  const [deletingContribution, setDeletingContribution] =
    useState<AdminContribution | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingContribution, setIsDeletingContribution] = useState(false);

  const t = useTranslations("contributions");
  const tCommon = useTranslations("common");

  // Fetch contributions
  useEffect(() => {
    fetchContributions();
  }, [pagination.pageIndex, pagination.pageSize]);

  // Fetch projects list for filter
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await listProjectsApi();
        if (response.success) {
          setProjectsList(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects list:", error);
      }
    };
    fetchProjects();
  }, []);

  const fetchContributions = async () => {
    setIsLoading(true);
    try {
      const { project, status } = form.getValues();
      const response = await getAdminContributionsApi({
        page: pagination.pageIndex + 1,
        project_id: project && project !== "all" ? project : undefined,
        status: status && status !== "all" ? status : undefined,
      });

      if (response.success) {
        setData(response.data);
        if (response.meta) {
          setPageCount(response.meta.last_page);
        }
      }
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
      toast.error(t("fetch_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (item: AdminContribution): void => {
    setSelectedContribution(item);
    setIsDialogOpen(true);
  };

  const handleFamilyDeleted = () => {
    // Refresh the data after a family is deleted
    fetchContributions();
    // Close the dialog
    setIsDialogOpen(false);
    setSelectedContribution(null);
  };

  const handleDeleteClick = (item: AdminContribution) => {
    setDeletingContribution(item);
    setDeleteConfirmation("");
  };

  const handleDeleteConfirm = async () => {
    if (!deletingContribution) return;
    if (deleteConfirmation.toLowerCase() !== "delete") {
      toast.error(
        t("delete_confirmation_error") || "Please type delete to confirm",
      );
      return;
    }

    setIsDeletingContribution(true);
    try {
      const response = await deleteContributionApi(deletingContribution.id);
      if (response.success) {
        toast.success(
          t("delete_success") || "Contribution deleted successfully",
        );
        setDeletingContribution(null);
        fetchContributions();
      } else {
        toast.error(response.message || t("delete_error"));
      }
    } catch (error: any) {
      console.error("Failed to delete contribution:", error);
      toast.error(error?.message || t("delete_error"));
    } finally {
      setIsDeletingContribution(false);
    }
  };

  // Get projects for filter dropdown
  const uniqueProjects = React.useMemo(() => {
    return projectsList.map((project) => ({
      id: project.id.toString(),
      name: project.name,
    }));
  }, [projectsList]);

  const table = useReactTable<AdminContribution>({
    data: data,
    columns: createAdminContributionColumns(
      {
        onView: handleView,
        onDelete: handleDeleteClick,
      },
      t,
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageCount,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {}

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-3 text-gray-600">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg min-h-screen bg" dir="rtl">
      <div className="space-y-4">
        {/* Header with Title and Search */}
        <div className=" mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("all_contributions")}
          </h2>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              {/* FORM */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
                >
                  {/* المشروع */}
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-auto">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                              <SelectValue placeholder={t("filter_project")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                {t("filter_all")}
                              </SelectItem>
                              {uniqueProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* الحالة */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-auto">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-md bg-white border border-gray-300 text-sm text-gray-700">
                              <SelectValue placeholder={t("filter_status")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                {t("filter_all")}
                              </SelectItem>
                              <SelectItem value="pending">
                                {t("status_pending")}
                              </SelectItem>
                              <SelectItem value="approved">
                                {t("status_approved")}
                              </SelectItem>
                              <SelectItem value="rejected">
                                {t("status_rejected")}
                              </SelectItem>
                              <SelectItem value="completed">
                                {t("status_completed")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  className="bg-primary text-white px-4 sm:px-6 flex-1 sm:flex-none py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                  size="lg"
                  onClick={() => {
                    if (pagination.pageIndex === 0) {
                      fetchContributions();
                    } else {
                      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }
                  }}
                >
                  <SearchCheck className="w-4 h-4" />
                  {t("update")}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-4 sm:px-6 flex-1 sm:flex-none py-2 rounded-xl"
                  onClick={() => {
                    form.reset({
                      project: "",
                      status: "",
                      // Or 'all' if that is the default logic, but defaults were empty strings
                    });
                    // Explicitly reset to empty strings if form.reset() without args reverts to defaultValues
                    if (pagination.pageIndex === 0) {
                      fetchContributions();
                    } else {
                      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    }
                  }}
                >
                  <RotateCcw className="w-4 h-4 text-primary" />
                  {t("reset")}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className=" bg-white ">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-center">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      createAdminContributionColumns(
                        {
                          onView: handleView,
                        },
                        t,
                      ).length
                    }
                    className="h-24 text-center"
                  >
                    {t("no_results")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center">
          <PaginationControls table={table} />
        </div>

        {/* Details Dialog */}
        <AdminContributionDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          contribution={selectedContribution}
          onFamilyDeleted={handleFamilyDeleted}
        />

        {/* Delete Contribution Dialog */}
        <AlertDialog
          open={!!deletingContribution}
          onOpenChange={(open) => {
            if (!open) setDeletingContribution(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("delete_contribution_title") || "Delete Contribution"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("delete_contribution_desc") ||
                  "This action cannot be undone. Please type 'delete' to confirm."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="delete"
                className="w-full"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingContribution}>
                {tCommon("cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteConfirm();
                }}
                disabled={
                  isDeletingContribution ||
                  deleteConfirmation.toLowerCase() !== "delete"
                }
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeletingContribution ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {t("deleting")}
                  </>
                ) : (
                  t("confirm_delete")
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
