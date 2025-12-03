import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/src/shared/ui/button";
import { Badge } from "@/src/shared/ui/badge";
import { Eye, Trash2, Clock, CheckCircle } from "lucide-react";
import { ContactMessage } from "../types/message.schema";
import { messageService } from "../services/message.service";
import { MessageTableColumn } from "../types/message-table.types";

export const createAdminMessageColumns = ({
  onView,
  onDelete,
}: MessageTableColumn): ColumnDef<ContactMessage>[] => [
  {
    accessorKey: "name",
    header: "الاسم",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "subject",
    header: "الموضوع",
  },
  {
    accessorKey: "createdAt",
    header: "التاريخ",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <div className="text-sm text-gray-500">
          {messageService.formatDate(date)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as "new" | "read" | "replied";
      const variant = messageService.getStatusVariant(status);
      const colorClass = messageService.getStatusColor(status);
      const label = messageService.getStatusLabel(status);

      const Icon =
        status === "new" ? Clock : status === "read" ? Eye : CheckCircle;

      return (
        <Badge variant={variant} className={colorClass}>
          <Icon className="h-3 w-3 mr-1" />
          {label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(message)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(message.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
