import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { testimonialApi } from "../api/testimonial.api";
import { TestimonialFormValues } from "../types/testimonial.schema";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: testimonialApi.getAll,
  });
}

export function useTestimonial(id: number) {
  return useQuery({
    queryKey: ["testimonial", id],
    queryFn: () => testimonialApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TestimonialFormValues) => testimonialApi.create(data),
    onSuccess: (response) => {
      toast.success(response.message || "تم إنشاء التزكية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء التزكية");
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TestimonialFormValues }) =>
      testimonialApi.update(id, data),
    onSuccess: (response) => {
      toast.success(response.message || "تم تحديث التزكية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث التزكية");
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => testimonialApi.delete(id),
    onSuccess: (response) => {
      toast.success(response.message || "تم حذف التزكية بنجاح");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء حذف التزكية");
    },
  });
}
