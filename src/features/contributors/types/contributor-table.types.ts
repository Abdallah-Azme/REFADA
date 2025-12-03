import { ColumnDef } from "@tanstack/react-table";
import { Contributor } from "./contributor.schema";

export interface ContributorTableColumn {
  onToggleStatus: (contributor: Contributor) => void;
  onEdit: (contributor: Contributor) => void;
  onDelete: (contributor: Contributor) => void;
  onView: (contributor: Contributor) => void;
}
