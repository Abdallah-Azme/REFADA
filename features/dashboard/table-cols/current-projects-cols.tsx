import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Pencil, Trash2 } from "lucide-react";

// ============================================================================
// DUMMY DATA
// In production, this would come from an API call
// Simulating server data for demonstration purposes

import { Project } from "../components/current-project-table-contribution";
import { Progress } from "@/components/ui/progress";
import { Eye, Heart } from "lucide-react";

export const dummyData: Project[] = [
  {
    id: 1,
    projectName: "مشروع 1200 علبة لبن",
    camp: "أصداء",
    indicator: 60,
    total: 500,
    received: 200,
    remaining: 200,
    beneficiaryFamilies: 33,
    requests: "عدد 3 عائلات",
  },
  {
    id: 2,
    projectName: "مشروع 50 خيمة",
    camp: "جباليا",
    indicator: 40,
    total: 30,
    received: 33,
    remaining: 33,
    beneficiaryFamilies: 10,
    requests: "عدد 3 عائلات",
  },
  {
    id: 3,
    projectName: "مشروع 130 علبة لبن",
    camp: "أصداء",
    indicator: 80,
    total: 30,
    received: 10,
    remaining: 10,
    beneficiaryFamilies: 2,
    requests: "عدد 3 عائلات",
  },
  {
    id: 4,
    projectName: "مشروع 30 عبوة دقيق",
    camp: "المحمدي",
    indicator: 45,
    total: 20,
    received: 2,
    remaining: 2,
    beneficiaryFamilies: 2,
    requests: "عدد 3 عائلات",
  },
  {
    id: 5,
    projectName: "مشروع 20 علبة لبن",
    camp: "مصعب",
    indicator: 70,
    total: 10,
    received: 2,
    remaining: 2,
    beneficiaryFamilies: 1200,
    requests: "عدد 3 عائلات",
  },
  {
    id: 6,
    projectName: "مشروع 20 علبة لبن",
    camp: "ابو سالم",
    indicator: 20,
    total: 1200,
    received: 1200,
    remaining: 1200,
    beneficiaryFamilies: 1200,
    requests: "عدد 3 عائلات",
  },
  {
    id: 7,
    projectName: "مشروع 20 علبة لبن",
    camp: "العين",
    indicator: 30,
    total: 10,
    received: 1200,
    remaining: 1200,
    beneficiaryFamilies: 1200,
    requests: "عدد 3 عائلات",
  },
];

type ActionHandlers = {
  onView: (project: Project) => void;
  onContribute: (project: Project) => void;
};

export const createColumns = (
  handlers: ActionHandlers
): ColumnDef<Project>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-start mx-4">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="تحديد الكل"
        />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="تحديد الصف"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "projectName",
    header: "المشروع",
    cell: ({ row }) => (
      <div className="text-right">
        <div className="font-bold text-gray-900">
          {row.original.projectName}
        </div>
        <div className="text-xs text-gray-500">{row.original.requests}</div>
      </div>
    ),
  },
  {
    accessorKey: "camp",
    header: "المخيم",
    cell: ({ row }) => (
      <div className="text-center text-gray-600">{row.original.camp}</div>
    ),
  },
  {
    accessorKey: "indicator",
    header: "المؤشر",
    cell: ({ row }) => {
      const value = row.original.indicator;
      let colorClass = "bg-primary";
      if (value < 30) colorClass = "bg-orange-500";
      else if (value < 60) colorClass = "bg-yellow-500";
      else if (value < 80) colorClass = "bg-green-500";
      else colorClass = "bg-red-500";

      return (
        <div className="w-24 mx-auto">
          <Progress value={value} className="h-2" indicatorColor={colorClass} />
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "الاجمالي",
    cell: ({ row }) => (
      <div className="text-center text-gray-600">{row.original.total}</div>
    ),
  },
  {
    accessorKey: "received",
    header: "تم تسليم",
    cell: ({ row }) => (
      <div className="text-center text-gray-600">{row.original.received}</div>
    ),
  },
  {
    accessorKey: "remaining",
    header: "المتبقي",
    cell: ({ row }) => (
      <div className="text-center text-gray-600">{row.original.remaining}</div>
    ),
  },
  {
    accessorKey: "beneficiaryFamilies",
    header: "العائلات المستفيدة",
    cell: ({ row }) => (
      <div className="text-center text-gray-600">
        {row.original.beneficiaryFamilies}
      </div>
    ),
  },
  {
    id: "view",
    header: "عرض",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => handlers.onView(row.original)}
        >
          <Eye className="w-5 h-5" />
        </Button>
      </div>
    ),
  },
  {
    id: "contribute",
    header: "مساهمة",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          className="bg-[#1B2540] hover:bg-[#2c3b60] text-white rounded-full px-4 py-1 h-8 text-xs flex items-center gap-2"
          onClick={() => handlers.onContribute(row.original)}
        >
          <Heart className="w-3 h-3" />
          ساهم الان
        </Button>
      </div>
    ),
  },
];
