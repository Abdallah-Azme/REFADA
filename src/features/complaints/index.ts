// Components
export { default as ComplaintsPage } from "./components/complaints-page";
export { ComplaintTable } from "./components/complaint-table";
export { ComplaintViewDialog } from "./components/complaint-view-dialog";
export { createComplaintColumns } from "./components/complaint-columns";

// API
export { complaintApi } from "./api/complaint.api";

// Hooks
export {
  useComplaints,
  useComplaint,
  useCreateComplaint,
  useDeleteComplaint,
} from "./hooks/use-complaint";

// Types
export type { Complaint, ComplaintFormValues } from "./types/complaint.schema";
export { complaintSchema } from "./types/complaint.schema";
