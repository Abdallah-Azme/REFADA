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
import { useCamps, useCreateCamp } from "@/features/camps/hooks/use-camps";
import { CampFormDialog } from "@/features/camps/components/camp-form-dialog";
import { Dialog } from "@/components/ui/dialog";

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

  // Camp Management Logic
  const { data: campsResponse } = useCamps();
  const createCampMutation = useCreateCamp();
  const [isCampDialogOpen, setIsCampDialogOpen] = React.useState(false);
  const [pendingUserToApprove, setPendingUserToApprove] =
    React.useState<PendingUser | null>(null);
  const [initialCampData, setInitialCampData] = React.useState<any>(null);

  const handleApprove = (user: PendingUser): void => {
    // Contributors don't need camp assignment
    if (user.role === "contributor") {
      approveUser({ userId: user.id });
      return;
    }

    const campName = user.campName;

    // If no camp name, approve without ID (handle potential backend error or assume valid)
    if (!campName) {
      approveUser({ userId: user.id });
      return;
    }

    // Check if camp exists
    const existingCamp = campsResponse?.data?.find(
      (c: any) => c.name === campName
    );

    if (existingCamp) {
      // Camp exists, approve with ID
      approveUser({
        userId: user.id,
        data: { camp_id: existingCamp.id },
      });
    } else {
      // Camp does not exist, open creation dialog
      setPendingUserToApprove(user);

      // Pre-fill only the name
      setInitialCampData({
        name: campName,
      });

      setIsCampDialogOpen(true);
    }
  };

  const handleCampSubmit = (data: any) => {
    createCampMutation.mutate(data, {
      onSuccess: (res: any) => {
        if (pendingUserToApprove) {
          // The new camp ID comes from the response
          const newCampId = res.data.id;
          approveUser({
            userId: pendingUserToApprove.id,
            data: { camp_id: newCampId },
          });
        }
        setIsCampDialogOpen(false);
        setPendingUserToApprove(null);
      },
    });
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

      {/* Camp Creation Dialog */}
      <Dialog open={isCampDialogOpen} onOpenChange={setIsCampDialogOpen}>
        <CampFormDialog
          initialData={initialCampData}
          onSubmit={handleCampSubmit}
          onCancel={() => setIsCampDialogOpen(false)}
          role="admin"
        />
      </Dialog>
    </div>
  );
}
