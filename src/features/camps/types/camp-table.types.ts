import { ColumnDef } from "@tanstack/react-table";
import { Camp } from "./camp.schema";

export interface CampTableColumn {
  onEdit: (camp: Camp) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export type CampColumnDef = ColumnDef<Camp>;
