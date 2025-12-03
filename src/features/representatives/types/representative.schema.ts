import { z } from "zod";

export const representativeSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  region: z.string().min(1, "المنطقة مطلوبة"),
  assignedCamps: z.number().min(0),
});

export type RepresentativeFormValues = z.infer<typeof representativeSchema>;

export interface Representative extends RepresentativeFormValues {
  id: number;
  status: "active" | "inactive";
}

export enum RepresentativeStatus {
  Active = "active",
  Inactive = "inactive",
}
