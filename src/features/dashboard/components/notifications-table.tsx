"use client";

import React, { useState } from "react";
import {
  useNotifications,
  BackendNotification,
  useMarkNotificationAsRead,
} from "@/features/dashboard/hooks/use-notifications";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import PaginationControls from "./pagination-controls";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Map notification type to icon and color
function getNotificationStyle(type: string) {
  if (type === "error" || type === "rejection") {
    return {
      icon: AlertCircle,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      badgeClass: "bg-red-100 text-red-700",
    };
  }
  if (type === "success" || type === "approval") {
    return {
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      badgeClass: "bg-green-100 text-green-700",
    };
  }
  return {
    icon: Info,
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    badgeClass: "bg-blue-100 text-blue-700",
  };
}

export default function NotificationsTable() {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const { data: notificationsData, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [selectedNotification, setSelectedNotification] =
    useState<BackendNotification | null>(null);

  const notifications = notificationsData?.data || [];

  // Filter notifications
  const filteredNotifications = React.useMemo(() => {
    let result = [...notifications];

    if (typeFilter !== "all") {
      result = result.filter((n) => n.type === typeFilter);
    }

    if (readFilter === "read") {
      result = result.filter((n) => n.isRead);
    } else if (readFilter === "unread") {
      result = result.filter((n) => !n.isRead);
    }

    return result;
  }, [notifications, typeFilter, readFilter]);

  const handleMarkAsRead = (id: number, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(id);
    }
  };

  const columns: ColumnDef<BackendNotification>[] = [
    {
      id: "status",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("status")}</span>
      ),
      cell: ({ row }) => {
        const isRead = row.original.isRead;
        return (
          <div className="flex justify-center min-w-[100px]">
            {isRead ? (
              <Badge className="bg-gray-100 text-gray-500">{t("read")}</Badge>
            ) : (
              <Badge className="bg-primary/10 text-primary">
                {t("unread")}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("type")}</span>
      ),
      cell: ({ row }) => {
        const style = getNotificationStyle(row.original.type);
        const Icon = style.icon;
        return (
          <div className="flex items-center gap-2 min-w-[140px]">
            <div className={`p-1.5 rounded-lg ${style.bgColor}`}>
              <Icon className={`w-4 h-4 ${style.textColor}`} />
            </div>
            <Badge className={style.badgeClass}>{row.original.type}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "notificationTitle",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("title")}</span>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-gray-800 block min-w-[150px]">
          {row.original.notificationTitle}
        </span>
      ),
    },
    {
      accessorKey: "message",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("message")}</span>
      ),
      cell: ({ row }) => (
        <div className="min-w-[300px] max-w-[400px]">
          <p className="text-gray-600 text-sm whitespace-normal">
            {row.original.message}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "timeAgo",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("time")}</span>
      ),
      cell: ({ row }) => (
        <span className="text-gray-500 text-sm whitespace-nowrap min-w-[120px] block">
          {row.original.timeAgo}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => (
        <span className="text-gray-600 font-semibold">{t("actions")}</span>
      ),
      cell: ({ row }) => {
        const isRead = row.original.isRead;
        return (
          <div className="flex items-center gap-2 justify-center min-w-[120px]">
            {/* View Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedNotification(row.original)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title={t("view_details")}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {/* Mark as Read Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkAsRead(row.original.id, isRead)}
              disabled={isRead || markAsRead.isPending}
              className={`${
                isRead ? "text-gray-400" : "text-primary hover:text-primary/80"
              }`}
            >
              {markAsRead.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 ml-1" />
                  {t("mark_read")}
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredNotifications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const unreadCount = notificationsData?.meta?.unread_count || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Bell className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t("page_title")}
            </h1>
            <p className="text-gray-500 text-sm">
              {t("total_notifications", { count: notifications.length })}
              {unreadCount > 0 && (
                <span className="text-primary font-semibold mr-2">
                  ({unreadCount} {t("unread")})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t("search")}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pr-12 h-11 border-2 border-gray-200 focus:border-primary rounded-xl"
          />
        </div>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] h-11 rounded-xl border-2 border-gray-200">
            <SelectValue placeholder={t("filter_type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="info">{t("type_info")}</SelectItem>
            <SelectItem value="success">{t("type_success")}</SelectItem>
            <SelectItem value="error">{t("type_error")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Read Status Filter */}
        <Select value={readFilter} onValueChange={setReadFilter}>
          <SelectTrigger className="w-[150px] h-11 rounded-xl border-2 border-gray-200">
            <SelectValue placeholder={t("filter_status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            <SelectItem value="read">{t("read")}</SelectItem>
            <SelectItem value="unread">{t("unread")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center py-4">
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-gray-500">{t("loading")}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isUnread = !row.original.isRead;
                return (
                  <TableRow
                    key={row.id}
                    className={`transition-colors ${
                      isUnread ? "bg-primary/5" : "hover:bg-gray-50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Bell className="w-12 h-12 opacity-50" />
                    <span>{t("no_notifications")}</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-center px-2 py-4 border-t">
          <PaginationControls table={table} />
        </div>
      </div>

      {/* Notification Detail Dialog */}
      <Dialog
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      >
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedNotification && (
                <>
                  <div
                    className={`p-2 rounded-lg ${
                      getNotificationStyle(selectedNotification.type).bgColor
                    }`}
                  >
                    {(() => {
                      const Icon = getNotificationStyle(
                        selectedNotification.type
                      ).icon;
                      return (
                        <Icon
                          className={`w-5 h-5 ${
                            getNotificationStyle(selectedNotification.type)
                              .textColor
                          }`}
                        />
                      );
                    })()}
                  </div>
                  <span>{selectedNotification.notificationTitle}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4 pt-4">
              {/* Type & Status */}
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    getNotificationStyle(selectedNotification.type).badgeClass
                  }
                >
                  {selectedNotification.type}
                </Badge>
                {selectedNotification.isRead ? (
                  <Badge className="bg-gray-100 text-gray-500">
                    {t("read")}
                  </Badge>
                ) : (
                  <Badge className="bg-primary/10 text-primary">
                    {t("unread")}
                  </Badge>
                )}
              </div>

              {/* Message */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <span>{t("time")}:</span>
                <span>{selectedNotification.timeAgo}</span>
              </div>

              {/* Mark as Read Button */}
              {!selectedNotification.isRead && (
                <Button
                  className="w-full"
                  onClick={() => {
                    handleMarkAsRead(selectedNotification.id, false);
                    setSelectedNotification(null);
                  }}
                >
                  <Check className="w-4 h-4 ml-2" />
                  {t("mark_read")}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
