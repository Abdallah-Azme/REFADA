// Components
export { default as MaritalStatusPage } from "./components/marital-status-page";
export { MaritalStatusTable } from "./components/marital-status-table";
export { MaritalStatusFormDialog } from "./components/marital-status-form-dialog";
export { createMaritalStatusColumns } from "./components/marital-status-columns";
export { DeleteConfirmDialog } from "./components/delete-confirm-dialog";

// API
export { maritalStatusApi } from "./api/marital-status.api";

// Hooks
export {
  useMaritalStatuses,
  useMaritalStatus,
  useCreateMaritalStatus,
  useUpdateMaritalStatus,
  useDeleteMaritalStatus,
} from "./hooks/use-marital-status";

// Types
export type {
  MaritalStatus,
  MaritalStatusFormValues,
} from "./types/marital-status.schema";
export { maritalStatusSchema } from "./types/marital-status.schema";
