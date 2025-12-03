import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2, RotateCcw } from "lucide-react";

export type Family = {
  id: number;
  name: string;
  members: number;
  females: number;
  males: number;
  diseaseCases: number;
  hasDisease: string;
  elders: string;
};

type ActionHandlers = {
  onEdit: (family: Family) => void;
  onDelete: (family: Family) => void;
  onUpdate: (family: Family) => void;
};

export const dummyData: Family[] = [
  {
    id: 1,
    name: "عائلة سالم أحمد محمد",
    members: 5,
    females: 2,
    males: 3,
    diseaseCases: 3,
    hasDisease: "لا يوجد",
    elders: "1",
  },
  {
    id: 2,
    name: "عائلة الصمدي أمين",
    members: 10,
    females: 2,
    males: 8,
    diseaseCases: 30,
    hasDisease: "لا يوجد",
    elders: "لا يوجد",
  },
  {
    id: 3,
    name: "عائلة سالم أحمد محمد",
    members: 10,
    females: 3,
    males: 3,
    diseaseCases: 3,
    hasDisease: "30",
    elders: "2",
  },
  {
    id: 4,
    name: "عائلة الصمدي أمين",
    members: 10,
    females: 5,
    males: 5,
    diseaseCases: 20,
    hasDisease: "2",
    elders: "4",
  },
  {
    id: 5,
    name: "عائلة سالم أحمد محمد",
    members: 10,
    females: 3,
    males: 7,
    diseaseCases: 3,
    hasDisease: "لا يوجد",
    elders: "لا يوجد",
  },
  {
    id: 6,
    name: "عائلة الصمدي أمين",
    members: 10,
    females: 6,
    males: 4,
    diseaseCases: 1200,
    hasDisease: "6",
    elders: "1",
  },
  {
    id: 7,
    name: "عائلة أحمد عاطف السيد",
    members: 10,
    females: 2,
    males: 8,
    diseaseCases: 1200,
    hasDisease: "لا يوجد",
    elders: "1",
  },
  {
    id: 8,
    name: "عائلة الصمدي أمين",
    members: 10,
    females: 2,
    males: 8,
    diseaseCases: 10,
    hasDisease: "5",
    elders: "1",
  },
];

export const createFamilyColumns = (
  handlers: ActionHandlers
): ColumnDef<Family>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center mx-6">
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
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="تحديد الصف"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ========================================
  // 1 — اسم العائلة
  // ========================================
  {
    accessorKey: "name",
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
      <div className="text-right font-semibold">{row.original.name}</div>
    ),
  },

  // ========================================
  // 2 — عدد الأفراد
  // ========================================
  {
    accessorKey: "members",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        عدد الأفراد
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.members}</div>
    ),
  },

  // ========================================
  // 3 — الإناث
  // ========================================
  {
    accessorKey: "females",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        الإناث
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.females}</div>
    ),
  },

  // ========================================
  // 4 — الذكور
  // ========================================
  {
    accessorKey: "males",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        الذكور
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.original.males}</div>,
  },

  // ========================================
  // 5 — الحالات المرضية (رقم)
  // ========================================
  {
    accessorKey: "diseaseCases",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        الحالات المرضية
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.diseaseCases}</div>
    ),
  },

  // ========================================
  // 6 — حالة مرضية (يوجد/لا يوجد)
  // ========================================
  {
    accessorKey: "hasDisease",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        حالة مرضية
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.hasDisease}</div>
    ),
  },

  // ========================================
  // 7 — سن كبار
  // ========================================
  {
    accessorKey: "elders",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        سن كبار
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.original.elders}</div>,
  },

  // ========================================
  // UPDATE
  // ========================================
  {
    id: "update",
    header: () => <div className="text-center font-semibold">تحديث</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="h-8 w-8 p-2 text-green-600 hover:bg-green-100 hover:text-green-700"
          onClick={() => handlers.onUpdate(row.original)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ========================================
  // EDIT
  // ========================================
  {
    id: "edit",
    header: () => <div className="text-center font-semibold">تعديل</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="h-8 w-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          onClick={() => handlers.onEdit(row.original)}
        >
          <Pencil className="h-4 w-4 min-w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ========================================
  // DELETE
  // ========================================
  {
    id: "delete",
    header: () => <div className="text-center font-semibold">حذف</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 min-w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="text-center p-8 max-w-[500px]!">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-2">
              حذف {row.original.name}
            </h2>

            <p className="text-gray-600 mb-6">
              هل أنت متأكد من رغبتك في حذف هذا المشروع من السجل؟
            </p>

            <div className="flex justify-center gap-4">
              <Button
                variant="destructive"
                className="px-6"
                onClick={() => handlers.onDelete(row.original)}
              >
                تأكيد ✓
              </Button>

              <DialogClose asChild>
                <Button variant="default" className="px-6 ">
                  إلغاء ✗
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
