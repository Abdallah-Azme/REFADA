import { ColumnDef } from "@tanstack/react-table";
import { Camp } from "./camp.schema";

export interface CampTableColumn {
  onEdit: (camp: Camp) => void;
  onDelete: (slug: string) => void;
  onToggleStatus: (slug: string) => void;
  onView: (camp: Camp) => void;
}

export type CampColumnDef = ColumnDef<Camp>;
