import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campSchema, Camp, CampFormValues } from "../types/camp.schema";
import { campService } from "../services/camp.service";

export function useCampForm(initialData?: Camp | null) {
  const form = useForm<CampFormValues>({
    resolver: zodResolver(campSchema),
    defaultValues: campService.createDefaultValues(),
  });

  useEffect(() => {
    form.reset(campService.createDefaultValues(initialData ?? undefined));
  }, [initialData, form]);

  return { form };
}
