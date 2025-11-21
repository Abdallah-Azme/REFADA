import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

// ========================================
// TYPE DEFINITIONS
// ========================================
export type Contribution = {
  id: number;
  contributorName: string;
  category: string;
  subcategory: string;
  result: string;
  date: string;
  amount: number;
};

type ActionHandlers = {
  onEdit: (contribution: Contribution) => void;
  onDelete: (contribution: Contribution) => void;
};

// ========================================
// DUMMY DATA
// ========================================
export const dummyData: Contribution[] = [
  {
    id: 1,
    contributorName: "عائلة بن 1000 بابا فين",
    category: "المتحدثين",
    subcategory: "فيه الفايدة",
    result: "تم التسليم",
    date: "27/10/2025",
    amount: 1000,
  },
  {
    id: 2,
    contributorName: "عشرة 125 عائلة 60 حرجة عائلة 1 مع",
    category: "يدالنا",
    subcategory: "فيه الفايدة",
    result: "تم التسليم",
    date: "27/10/2025",
    amount: 70,
  },
  {
    id: 3,
    contributorName: "10 مع",
    category: "أعضاء",
    subcategory: "100 على عائلة 10 عشرق",
    result: "تم التسليم",
    date: "27/10/2025",
    amount: 110,
  },
  {
    id: 4,
    contributorName: "عائلة الصمدي أمين",
    category: "المتحدثين",
    subcategory: "فيه الفايدة",
    result: "تم التسليم",
    date: "28/10/2025",
    amount: 500,
  },
  {
    id: 5,
    contributorName: "عائلة سالم أحمد محمد",
    category: "يدالنا",
    subcategory: "أعضاء",
    result: "تم التسليم",
    date: "29/10/2025",
    amount: 250,
  },
  {
    id: 6,
    contributorName: "عائلة محمود عبد الرحمن",
    category: "المتحدثين",
    subcategory: "فيه الفايدة",
    result: "تم التسليم",
    date: "30/10/2025",
    amount: 800,
  },
  {
    id: 7,
    contributorName: "عائلة أحمد عاطف السيد",
    category: "أعضاء",
    subcategory: "100 على عائلة 10 عشرق",
    result: "تم التسليم",
    date: "01/11/2025",
    amount: 1200,
  },
  {
    id: 8,
    contributorName: "عائلة خالد محمد علي",
    category: "يدالنا",
    subcategory: "فيه الفايدة",
    result: "تم التسليم",
    date: "02/11/2025",
    amount: 450,
  },
  {
    id: 9,
    contributorName: "عائلة حسن إبراهيم",
    category: "المتحدثين",
    subcategory: "أعضاء",
    result: "تم التسليم",
    date: "03/11/2025",
    amount: 650,
  },
  {
    id: 10,
    contributorName: "عائلة عمر فاروق",
    category: "أعضاء",
    subcategory: "فيه الفايدة",
    result: "تم التسليم",
    date: "04/11/2025",
    amount: 920,
  },
  {
    id: 11,
    contributorName: "عائلة يوسف حسين",
    category: "يدالنا",
    subcategory: "100 على عائلة 10 عشرق",
    result: "تم التسليم",
    date: "05/11/2025",
    amount: 350,
  },
  {
    id: 12,
    contributorName: "عائلة طارق السعيد",
    category: "المتحدثين",
    subcategory: "فيه الفايدة",
    result: "تم التسليم",
    date: "06/11/2025",
    amount: 1500,
  },
];

// ========================================
// COLUMN DEFINITIONS
// ========================================
export const createColumns = (
  handlers: ActionHandlers
): ColumnDef<Contribution>[] => [
  // SELECT COLUMN
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center mx-6 ">
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
      <div className="flex justify-center mx-6">
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

  // CONTRIBUTOR NAME
  {
    accessorKey: "contributorName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full"
      >
        المساهمة
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right px-2 font-medium">
        {row.original.contributorName}
      </div>
    ),
  },

  // CATEGORY
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        المشروع
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.category}</div>
    ),
  },

  // SUBCATEGORY
  {
    accessorKey: "subcategory",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        المخيم
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.subcategory}</div>
    ),
  },

  // RESULT (Status Badge)
  {
    accessorKey: "result",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        الحالة
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          {row.original.result}
        </span>
      </div>
    ),
  },

  // DATE
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        التاريخ
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.original.date}</div>,
  },

  // AMOUNT
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        المبلغ
        <ArrowUpDown className="mr-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold">{row.original.amount}</div>
    ),
  },

  // EDIT
  {
    id: "edit",
    header: () => <div className="text-center font-semibold">تعديل</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          onClick={() => handlers.onEdit(row.original)}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // DELETE
  {
    id: "delete",
    header: () => <div className="text-center font-semibold">حذف</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="text-center p-8 max-w-[500px]">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-2">
              حذف {row.original.contributorName}
            </h2>

            <p className="text-gray-600 mb-6">
              هل أنت متأكد من رغبتك في حذف هذه المساهمة من السجل؟
            </p>

            <div className="flex justify-center gap-4">
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  className="px-6"
                  onClick={() => handlers.onDelete(row.original)}
                >
                  تأكيد ✓
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button variant={"link"}>إلغاء ✗</Button>
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
