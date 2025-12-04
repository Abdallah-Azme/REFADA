import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, MapPin } from "lucide-react";

export interface Camp {
  id: string;
  name: string;
  location: string;
  description: string;
  capacity: number;
  currentOccupancy: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: "active" | "inactive";
}

export const dummyCamps: Camp[] = [
  {
    id: "1",
    name: "إيواء أصداء",
    location: "غزة - الشمال",
    description: "إيواء رئيسي يوفر المأوى والخدمات الأساسية",
    capacity: 500,
    currentOccupancy: 350,
    coordinates: { lat: 31.5, lng: 34.45 },
    status: "active",
  },
  {
    id: "2",
    name: "إيواء النور",
    location: "غزة - الجنوب",
    description: "إيواء طوارئ للعائلات النازحة",
    capacity: 300,
    currentOccupancy: 280,
    coordinates: { lat: 31.3, lng: 34.3 },
    status: "active",
  },
];

interface AdminCampColumnsProps {
  onEdit: (camp: Camp) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const createAdminCampColumns = ({
  onEdit,
  onDelete,
  onToggleStatus,
}: AdminCampColumnsProps): ColumnDef<Camp>[] => [
  {
    accessorKey: "name",
    header: "اسم الإيواء",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "location",
    header: "الموقع",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-gray-500" />
        {row.getValue("location")}
      </div>
    ),
  },
  {
    accessorKey: "capacity",
    header: "السعة",
  },
  {
    accessorKey: "currentOccupancy",
    header: "الإشغال",
    cell: ({ row }) => {
      const occupancy = row.getValue("currentOccupancy") as number;
      const capacity = row.original.capacity;
      const percentage = Math.round((occupancy / capacity) * 100);
      return (
        <div>
          {occupancy}{" "}
          <span className="text-xs text-gray-500">({percentage}%)</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="cursor-pointer hover:opacity-80"
          onClick={() => onToggleStatus(row.original.id)}
        >
          {status === "active" ? "نشط" : "غير نشط"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const camp = row.original;
      return (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(camp)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(camp.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
