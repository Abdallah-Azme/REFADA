"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Testimonial } from "../types/testimonial.schema";
import { Button } from "@/shared/ui/button";
import { Eye, Trash2, Edit } from "lucide-react";
import Image from "next/image";

export const createTestimonialColumns = (
  onView: (testimonial: Testimonial) => void,
  onEdit: (testimonial: Testimonial) => void,
  onDelete: (id: number) => void
): ColumnDef<Testimonial>[] => [
  {
    accessorKey: "id",
    header: "الرقم",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "user_image",
    header: "الصورة",
    cell: ({ row }) => {
      const image = row.getValue("user_image") as string;
      return (
        <div className="h-10 w-10 relative overflow-hidden rounded-full border">
          {image ? (
            <Image
              src={image}
              alt="User"
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback logic could be handled here or by a wrapper component
                (e.target as HTMLImageElement).src =
                  "https://ui-avatars.com/api/?name=User";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">
              No
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "user_name",
    header: "الاسم",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("user_name")}</div>
    ),
  },
  {
    accessorKey: "opinion",
    header: "الرأي",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("opinion")}>
        {row.getValue("opinion")}
      </div>
    ),
  },
  {
    accessorKey: "order", // Assuming order is returned
    header: "الترتيب",
    cell: ({ row }) => <div>{row.getValue("order")}</div>,
  },
  {
    id: "actions",
    header: "الإجراءات",
    cell: ({ row }) => {
      const testimonial = row.original;

      return (
        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(testimonial)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(testimonial)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(testimonial.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
