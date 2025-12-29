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
import React from "react";
import { createPendingDelegatesColumns } from "../table-cols/admin-representatives-cols";
import PaginationControls from "./pagination-controls";
import {
  usePendingUsers,
  useApproveUser,
  useRejectUser,
} from "@/features/representatives/hooks/use-pending-users";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";
import { Loader2 } from "lucide-react";
import { useCamps } from "@/features/camps/hooks/use-camps";
import { useAdminPositions } from "@/features/admin-position";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AdminPendingUsersTable() {
  const t = useTranslations();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Fetch all pending users (delegates and contributors)
  const { data: response, isLoading, error } = usePendingUsers();
  const { mutate: approveUser } = useApproveUser();
  const { mutate: rejectUser } = useRejectUser();

  const data = React.useMemo(() => {
    return response?.data || [];
  }, [response]);

  // Camp Assignment Logic
  const { data: campsResponse } = useCamps();
  const camps = campsResponse?.data || [];

  // Admin Positions Logic
  const { data: adminPositionsData } = useAdminPositions();
  const adminPositions = adminPositionsData?.data || [];

  const [isCampDialogOpen, setIsCampDialogOpen] = React.useState(false);
  const [pendingUserToApprove, setPendingUserToApprove] =
    React.useState<PendingUser | null>(null);
  const [selectedCampId, setSelectedCampId] = React.useState<string>("");
  const [selectedAdminPositionId, setSelectedAdminPositionId] =
    React.useState<string>("");

  const handleApprove = (user: PendingUser): void => {
    // Contributors don't need camp assignment
    if (user.role === "contributor") {
      approveUser({ userId: user.id });
      return;
    }

    // Delegates need camp and admin position assignment - open selection dialog
    setPendingUserToApprove(user);
    setSelectedCampId("");
    setSelectedAdminPositionId("");
    setIsCampDialogOpen(true);
  };

  const handleConfirmApproval = () => {
    if (pendingUserToApprove && selectedCampId && selectedAdminPositionId) {
      approveUser({
        userId: pendingUserToApprove.id,
        data: {
          camp_id: parseInt(selectedCampId),
          admin_position_id: parseInt(selectedAdminPositionId),
        },
      });
      setIsCampDialogOpen(false);
      setPendingUserToApprove(null);
      setSelectedCampId("");
      setSelectedAdminPositionId("");
    }
  };

  const handleReject = (user: PendingUser): void => {
    rejectUser(user.id);
  };

  const table = useReactTable<PendingUser>({
    data,
    columns: createPendingDelegatesColumns(
      {
        onApprove: handleApprove,
        onReject: handleReject,
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
        <span className="mr-2">جاري تحميل طلبات المناديب...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-red-600">
        حدث خطأ أثناء تحميل الطلبات
      </div>
    );
  }

  return (
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
                        onApprove: handleApprove,
                        onReject: handleReject,
                      },
                      t
                    ).length
                  }
                  className="h-24 text-center"
                >
                  لا توجد طلبات انتظار حالياً.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center px-2 py-4">
        <PaginationControls table={table} />
      </div>

      {/* Camp and Admin Position Assignment Dialog for Delegates */}
      <Dialog open={isCampDialogOpen} onOpenChange={setIsCampDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              تعيين المخيم والصفة الإدارية للمندوب
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              اختر المخيم والصفة الإدارية التي سيتم تعيين{" "}
              <strong>{pendingUserToApprove?.name}</strong> إليها
            </p>

            {/* Camp Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">المخيم</label>
              <Select value={selectedCampId} onValueChange={setSelectedCampId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المخيم" />
                </SelectTrigger>
                <SelectContent>
                  {camps.map((camp: any) => {
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

            {/* Admin Position Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الصفة الإدارية</label>
              <Select
                value={selectedAdminPositionId}
                onValueChange={setSelectedAdminPositionId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر الصفة الإدارية" />
                </SelectTrigger>
                <SelectContent>
                  {adminPositions.map((position) => (
                    <SelectItem
                      key={position.id}
                      value={position.id.toString()}
                    >
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCampDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmApproval}
              disabled={!selectedCampId || !selectedAdminPositionId}
              className="bg-green-600 hover:bg-green-700"
            >
              تأكيد وموافقة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
