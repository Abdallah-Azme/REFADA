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
import { createPendingDelegatesColumns } from "../table-cols/admin-representatives-cols";
import PaginationControls from "./pagination-controls";
import { useRepresentatives } from "@/features/representatives/hooks/use-representatives";
import { useDeleteRepresentative } from "@/features/representatives/hooks/use-delete-representative";
import {
  useApproveRepresentative,
  useRejectRepresentative,
  useChangeRepresentativePassword,
} from "@/features/representatives/hooks/use-approve-reject";
import { useCamps } from "@/features/camps";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminRepresentativesTable() {
  const t = useTranslations();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
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

  // Approve state
  const [approveOpen, setApproveOpen] = useState(false);
  const [approvingUser, setApprovingUser] = useState<PendingUser | null>(null);
  const [selectedCampId, setSelectedCampId] = useState<string>("");

  // Reject state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectingUser, setRejectingUser] = useState<PendingUser | null>(null);

  // Change Password state
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState<PendingUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch all delegates - API already filters by role=delegate
  const { data: response, isLoading, error } = useRepresentatives();
  const deleteMutation = useDeleteRepresentative();
  const approveMutation = useApproveRepresentative();
  const rejectMutation = useRejectRepresentative();
  const changePasswordMutation = useChangeRepresentativePassword();

  // Fetch camps for selection
  const { data: campsData } = useCamps();
  const camps = campsData?.data || [];

  // Use all data from the response (already filtered by role=delegate in the API)
  const data = React.useMemo(() => {
    return response?.data || [];
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

  const handleApprove = (user: PendingUser) => {
    setApprovingUser(user);
    // Find matching camp ID from campName
    if (user.campName) {
      const matchingCamp = camps.find((camp) => {
        const campName =
          typeof camp.name === "string"
            ? camp.name
            : camp.name?.ar || camp.name?.en || "";
        return campName === user.campName;
      });
      setSelectedCampId(matchingCamp ? matchingCamp.id.toString() : "");
    } else {
      setSelectedCampId("");
    }
    setApproveOpen(true);
  };

  const handleConfirmApprove = () => {
    if (approvingUser && selectedCampId) {
      approveMutation.mutate(
        { userId: approvingUser.id, campId: parseInt(selectedCampId) },
        {
          onSuccess: () => {
            setApproveOpen(false);
            setApprovingUser(null);
            setSelectedCampId("");
          },
        }
      );
    }
  };

  const handleReject = (user: PendingUser) => {
    setRejectingUser(user);
    setRejectOpen(true);
  };

  const handleConfirmReject = () => {
    if (rejectingUser) {
      rejectMutation.mutate(rejectingUser.id, {
        onSuccess: () => {
          setRejectOpen(false);
          setRejectingUser(null);
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
        }
      );
    }
  };

  const table = useReactTable<PendingUser>({
    data,
    columns: createPendingDelegatesColumns(
      {
        onApprove: handleApprove,
        onReject: handleReject,
        onDelete: handleDelete,
        onChangePassword: handleChangePassword,
      },
      t
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">{t("representatives.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-red-600">
        {t("representatives.error_loading")}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg bg-white">
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
                              header.getContext()
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
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      createPendingDelegatesColumns(
                        {
                          onApprove: () => {},
                          onReject: () => {},
                          onDelete: () => {},
                        },
                        t
                      ).length
                    }
                    className="h-24 text-center"
                  >
                    {t("representatives.no_representatives")}
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
        title={t("representatives.delete_title")}
        description={t("representatives.delete_description", {
          name: deletingUser?.name || "",
        })}
        isPending={deleteMutation.isPending}
      />

      {/* Approve Dialog with Camp Selection */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("representatives.approve_title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              {t("representatives.approve_description", {
                name: approvingUser?.name || "",
              })}
            </p>

            {/* User Data Preview */}
            <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-xs text-gray-500">
                  {t("representatives.name")}
                </label>
                <p className="text-sm font-medium">
                  {approvingUser?.name || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  {t("representatives.email")}
                </label>
                <p className="text-sm font-medium">
                  {approvingUser?.email || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  {t("representatives.phone")}
                </label>
                <p className="text-sm font-medium">
                  {approvingUser?.phone || "-"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  {t("representatives.national_id")}
                </label>
                <p className="text-sm font-medium">
                  {approvingUser?.idNumber || "-"}
                </p>
              </div>
              {approvingUser?.adminPositionName && (
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">
                    {t("representatives.admin_position")}
                  </label>
                  <p className="text-sm font-medium">
                    {approvingUser.adminPositionName}
                  </p>
                </div>
              )}
              {approvingUser?.licenseNumber && (
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">
                    {t("representatives.license_number")}
                  </label>
                  <p className="text-sm font-medium">
                    {approvingUser.licenseNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Camp Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("representatives.select_camp")}
              </label>
              <Select value={selectedCampId} onValueChange={setSelectedCampId}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("representatives.select_camp_placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {camps.map((camp) => {
                    const campName =
                      typeof camp.name === "string"
                        ? camp.name
                        : camp.name?.ar || camp.name?.en || "";
                    return (
                      <SelectItem key={camp.id} value={camp.id.toString()}>
                        {campName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setApproveOpen(false)}
              disabled={approveMutation.isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleConfirmApprove}
              disabled={!selectedCampId || approveMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  {t("common.loading")}
                </>
              ) : (
                t("representatives.approve")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <DeleteConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleConfirmReject}
        title={t("representatives.reject_title")}
        description={t("representatives.reject_description", {
          name: rejectingUser?.name || "",
        })}
        isPending={rejectMutation.isPending}
      />

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("representatives.change_password_title")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              {t("representatives.change_password_description", {
                name: passwordUser?.name || "",
              })}
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("representatives.new_password")}
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("representatives.new_password_placeholder")}
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
                {t("representatives.confirm_new_password")}
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t(
                    "representatives.confirm_password_placeholder"
                  )}
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
                  {t("representatives.passwords_not_match")}
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
                t("representatives.save_password")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
