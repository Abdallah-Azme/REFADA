"use client";

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
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { createApprovedContributorsColumns } from "../table-cols/admin-contributors-cols";
import PaginationControls from "./pagination-controls";
import { useContributors } from "@/features/contributors/hooks/use-contributors";
import { useDeleteContributor } from "@/features/contributors/hooks/use-delete-contributor";
import { useChangeRepresentativePassword } from "@/features/representatives/hooks/use-approve-reject";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { DeleteConfirmDialog } from "@/features/marital-status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet } from "lucide-react";
import {
  exportToExcel,
  formatContributorsForExport,
} from "@/src/lib/export-utils";
import { toast } from "sonner";

export default function AdminContributorsTable() {
  const t = useTranslations();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<PendingUser | null>(null);

  // Change Password state
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState<PendingUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch contributors
  const { data: response, isLoading, error } = useContributors();

  const deleteMutation = useDeleteContributor();
  const changePasswordMutation = useChangeRepresentativePassword();

  // Show all contributors (approved and rejected - but not pending, handled in pending-users page)
  const data = React.useMemo(() => {
    return response?.data?.filter((user) => user.status !== "pending") || [];
  }, [response]);

  const handleDelete = (user: PendingUser) => {
    setDeletingUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteMutation.mutate(deletingUser.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeletingUser(null);
        },
      });
    }
  };

  const handleChangePassword = (user: PendingUser) => {
    setPasswordUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordOpen(true);
  };

  const handleConfirmChangePassword = () => {
    if (passwordUser && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return;
      }
      changePasswordMutation.mutate(
        {
          userId: passwordUser.id,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        },
        {
          onSuccess: () => {
            setPasswordOpen(false);
            setPasswordUser(null);
            setNewPassword("");
            setConfirmPassword("");
          },
        },
      );
    }
  };

  const table = useReactTable<PendingUser>({
    data,
    columns: createApprovedContributorsColumns(
      {
        onDelete: handleDelete,
        onChangePassword: handleChangePassword,
      },
      t,
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    // @ts-ignore
    autoResetRowSelection: false,
    getRowId: (row) => row.id.toString(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
    },
  });

  // Persistent selection map logic
  const [selectedContributorsMap, setSelectedContributorsMap] = React.useState<
    Record<string, PendingUser>
  >({});

  React.useEffect(() => {
    const newMap = { ...selectedContributorsMap };
    let hasChanges = false;

    // Remove unselected
    Object.keys(newMap).forEach((id) => {
      // @ts-ignore
      if (!rowSelection[id]) {
        delete newMap[id];
        hasChanges = true;
      }
    });

    // Add selected from current page
    data.forEach((user) => {
      const id = user.id.toString();
      // @ts-ignore
      if (rowSelection[id] && !newMap[id]) {
        newMap[id] = user;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setSelectedContributorsMap(newMap);
    }
  }, [rowSelection, data, selectedContributorsMap]);

  const selectedContributors = React.useMemo(
    () => Object.values(selectedContributorsMap),
    [selectedContributorsMap],
  );

  // Export to Excel handler
  const handleExportExcel = () => {
    try {
      const dataToExport =
        selectedContributors.length > 0 ? selectedContributors : data;
      const formattedData = formatContributorsForExport(dataToExport);
      const filename =
        selectedContributors.length > 0
          ? `contributors_selected_${selectedContributors.length}_${new Date().toISOString().split("T")[0]}`
          : `contributors_all_${new Date().toISOString().split("T")[0]}`;

      exportToExcel(formattedData, filename, "Contributors");
      toast.success(
        t("contributors.export_success") || "تم تصدير البيانات بنجاح",
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(t("common.error_occurred") || "حدث خطأ");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">{t("contributors.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-red-600">
        {t("contributors.error_loading")}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg bg-white">
        {/* Export Buttons */}
        <div className="flex items-center justify-end p-4 border-b gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={handleExportExcel}
            className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {selectedContributors.length > 0
              ? `${t("contributors.export_selected") || "تصدير المحدد"} (${selectedContributors.length})`
              : t("contributors.export_all") || "تصدير الكل"}
          </Button>
        </div>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[960px]">
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                      createApprovedContributorsColumns(
                        { onDelete: () => {}, onChangePassword: () => {} },
                        t,
                      ).length
                    }
                    className="h-24 text-center"
                  >
                    {t("contributors.no_contributors")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-center px-2 py-4">
          <PaginationControls table={table} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title={t("contributors.delete_title")}
        description={t("contributors.delete_description", {
          name: deletingUser?.name || "",
        })}
        isPending={deleteMutation.isPending}
      />

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("contributors.change_password_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              {t("contributors.change_password_description", {
                name: passwordUser?.name || "",
              })}
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("contributors.new_password")}
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("contributors.new_password_placeholder")}
                  className="pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("contributors.confirm_new_password")}
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("contributors.confirm_password_placeholder")}
                  className="pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <p className="text-sm text-red-500">
                  {t("contributors.passwords_not_match")}
                </p>
              )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPasswordOpen(false)}
              disabled={changePasswordMutation.isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleConfirmChangePassword}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                changePasswordMutation.isPending
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  {t("common.loading")}
                </>
              ) : (
                t("contributors.save_password")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
