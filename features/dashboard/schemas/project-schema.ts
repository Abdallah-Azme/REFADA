import z from "zod";

export const projectSchema = z.object({
  projectName: z.string().min(1, "الرجاء إدخال اسم المشروع"),

  type: z.string().min(1, "الرجاء اختيار النوع"),

  quantity: z.string().min(1, "الرجاء اختيار الكمية"),

  status: z.string().min(1, "الرجاء اختيار الحالة"),

  beneficiariesCount: z.string().min(1, "الرجاء إدخال عدد العائلات المستفيدة"),

  number: z.string().min(1, "الرجاء إدخال الرقم"),

  note: z.string().optional(),
});
