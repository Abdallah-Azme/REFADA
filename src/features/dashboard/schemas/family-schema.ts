import z from "zod";

export const familySchema = z.object({
  firstName: z.string().min(1, "الرجاء إدخال اسم العائلة"),
  idNumber: z.string().min(1),
  dateOfBirth: z.string().min(1),
  phone: z.string().min(1),
  secondaryPhone: z.string().optional().or(z.literal("")),
  medicalCondition: z.string().min(1),
  status: z.string().min(1),
  childrenCount: z.string().min(1),

  familyMembers: z
    .array(
      z
        .object({
          name: z.string(),
          idNumber: z.string(),
          gender: z.string(),
          dateOfBirth: z.string(),
        })
        .partial()
    )
    .optional()
    .default([]),

  location: z.string().min(1),
  locationNumber: z.string().min(1),
  note: z.string().optional(),
});
