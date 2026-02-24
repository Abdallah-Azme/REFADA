import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";
import { flexRender, Table as ReactTableType } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { createPendingDelegatesColumns } from "../table-cols/admin-representatives-cols";
import PaginationControls from "./pagination-controls";

interface AdminRepresentativesDataTableProps {
  table: ReactTableType<PendingUser>;
}

export function AdminRepresentativesDataTable({
  table,
}: AdminRepresentativesDataTableProps) {
  const t = useTranslations();

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
                    createPendingDelegatesColumns(
                      {
                        onApprove: () => {},
                        onReject: () => {},
                        onDelete: () => {},
                      },
                      t,
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
  );
}
