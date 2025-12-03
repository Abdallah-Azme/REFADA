import { ColumnDef } from "@tanstack/react-table";
import { ContactMessage } from "./message.schema";

export interface MessageTableColumn {
  onView: (message: ContactMessage) => void;
  onDelete: (id: string) => void;
}

export type MessageColumnDef = ColumnDef<ContactMessage>;
