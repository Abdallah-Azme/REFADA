// Components
export { default as RelationshipPage } from "./components/relationship-page";
export { RelationshipTable } from "./components/relationship-table";
export { RelationshipFormDialog } from "./components/relationship-form-dialog";
export { createRelationshipColumns } from "./components/relationship-columns";

// API
export { relationshipApi } from "./api/relationship.api";

// Hooks
export {
  useRelationships,
  useRelationship,
  useCreateRelationship,
  useUpdateRelationship,
  useDeleteRelationship,
} from "./hooks/use-relationship";

// Types
export type {
  Relationship,
  RelationshipFormValues,
} from "./types/relationship.schema";
export { relationshipSchema } from "./types/relationship.schema";
