import { z } from "zod";

export const relationshipSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
});

export type RelationshipFormValues = z.infer<typeof relationshipSchema>;

export interface Relationship {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
