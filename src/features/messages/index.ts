// Components
export { createAdminMessageColumns } from "./components/message-table-columns";
export { default as AdminMessagesTable } from "./components/admin-messages-table";

// Hooks
export {
  useContactMessages,
  useCreateContactMessage,
} from "./hooks/use-contact-messages";

// API
export { contactMessagesApi } from "./api/contact-message.api";

// Types
export type {
  ContactMessage,
  ContactMessageFormValues,
  CreateContactMessageDto,
} from "./types/message.schema";
export { MessageStatus, contactMessageSchema } from "./types/message.schema";
export type { MessageTableColumn } from "./types/message-table.types";

// Data
export { mockMessages } from "./data/mock-messages";

// Services
export { messageService } from "./services/message.service";
