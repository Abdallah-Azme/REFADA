"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
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
import PaginationControls from "./pagination-controls";
import { useRepresentativeCampFamilies } from "@/features/contributors/hooks/use-camp-families";
import { CampFamily } from "@/features/contributors/api/contributors.api";
import {
  Loader2,
  ArrowUpDown,
  Phone,
  MapPin,
  Users,
  Tent,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Column definitions for camp families
const createCampFamiliesColumns = (): ColumnDef<CampFamily>[] => [
  {
    accessorKey: "familyName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        اسم العائلة
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-semibold">{row.original.familyName}</div>
    ),
  },
  {
    accessorKey: "nationalId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        رقم الهوية
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-mono">{row.original.nationalId}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: () => (
      <div className="flex items-center justify-center gap-1">
        <Phone className="h-4 w-4" />
        رقم الهاتف
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center" dir="ltr">
        {row.original.phone}
      </div>
    ),
  },
  {
    accessorKey: "totalMembers",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Users className="h-4 w-4 ml-1" />
        عدد الأفراد
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.totalMembers}</div>
    ),
  },
  {
    accessorKey: "tentNumber",
    header: () => (
      <div className="flex items-center justify-center gap-1">
        <Tent className="h-4 w-4" />
        رقم الخيمة
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.tentNumber}</div>
    ),
  },
  {
    accessorKey: "maritalStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        الحالة الاجتماعية
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.maritalStatus}</div>
    ),
  },
  {
    accessorKey: "location",
    header: () => (
      <div className="flex items-center justify-center gap-1">
        <MapPin className="h-4 w-4" />
        الموقع
      </div>
    ),
    cell: ({ row }) => (
      <div
        className="text-center max-w-[150px] truncate"
        title={row.original.location}
      >
        {row.original.location}
      </div>
    ),
  },
  {
    id: "details",
    header: () => <div className="text-center font-semibold">التفاصيل</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-right">
                تفاصيل عائلة {row.original.familyName}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">اسم العائلة</span>
                <p className="font-semibold">{row.original.familyName}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">رقم الهوية</span>
                <p className="font-semibold font-mono">
                  {row.original.nationalId}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">تاريخ الميلاد</span>
                <p className="font-semibold">{row.original.dob}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">رقم الهاتف</span>
                <p className="font-semibold" dir="ltr">
                  {row.original.phone}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">
                  رقم الهاتف الاحتياطي
                </span>
                <p className="font-semibold" dir="ltr">
                  {row.original.backupPhone || "-"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">عدد الأفراد</span>
                <p className="font-semibold">{row.original.totalMembers}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">الحالة الاجتماعية</span>
                <p className="font-semibold">{row.original.maritalStatus}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 text-sm">رقم الخيمة</span>
                <p className="font-semibold">{row.original.tentNumber}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                <span className="text-gray-500 text-sm">الموقع</span>
                <p className="font-semibold">{row.original.location}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                <span className="text-gray-500 text-sm">المخيم</span>
                <p className="font-semibold">{row.original.camp}</p>
              </div>
              {row.original.notes && (
                <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                  <span className="text-gray-500 text-sm">ملاحظات</span>
                  <p className="font-semibold">{row.original.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

export default function CampFamiliesTable() {
  const {
    data: familiesData,
    isLoading,
    error,
  } = useRepresentativeCampFamilies();

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

  const families = familiesData?.data || [];
  const columns = createCampFamiliesColumns();

  const table = useReactTable<CampFamily>({
    data: families,
    columns,
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
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">جاري تحميل العائلات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[200px]">
        <span className="text-red-500">حدث خطأ في تحميل العائلات</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          قائمة العائلات في المخيم
        </h2>
        <span className="text-sm text-gray-500">
          إجمالي العائلات: {families.length}
        </span>
      </div>

      {/* Table */}
      <div className="w-full overflow-auto">
        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 bg-white">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
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
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      لا توجد عائلات مسجلة.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-center px-2">
            <PaginationControls table={table} />
          </div>
        </div>
      </div>
    </div>
  );
}
