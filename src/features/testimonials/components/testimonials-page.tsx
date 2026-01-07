"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Loader2, Plus, Quote } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import { Button } from "@/shared/ui/button";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  useTestimonial,
} from "../hooks/use-testimonials";
import {
  Testimonial,
  TestimonialFormValues,
} from "../types/testimonial.schema";
import { TestimonialTable } from "./testimonial-table";
import { createTestimonialColumns } from "./testimonial-columns";
import { TestimonialViewDialog } from "./testimonial-view-dialog";
import { TestimonialFormDialog } from "./testimonial-form-dialog";
import { DeleteConfirmDialog } from "@/features/marital-status";
import { useTranslations } from "next-intl";

export default function TestimonialsPage() {
  const t = useTranslations("testimonials_page");
  const tCommon = useTranslations("common");
  const { data, isLoading, error } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingTestimonial, setViewingTestimonial] =
    useState<Testimonial | null>(null);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch single testimonial for editing
  // We only enable this query when editingId is set
  const { data: editingData, isLoading: isLoadingDetails } = useTestimonial(
    editingId as number
  );

  const testimonials = data?.data || [];

  const handleView = (testimonial: Testimonial) => {
    setViewingTestimonial(testimonial);
    setViewDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setDeletingId(null);
        },
      });
    }
  };

  const handleSubmitForm = (values: TestimonialFormValues) => {
    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: values },
        {
          onSuccess: () => {
            setFormDialogOpen(false);
            setEditingId(null);
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setFormDialogOpen(false);
        },
      });
    }
  };

  // When form dialog closes, reset editing state
  const handleFormDialogChange = (open: boolean) => {
    setFormDialogOpen(open);
    if (!open) {
      setEditingId(null);
    }
  };

  const columns = createTestimonialColumns(
    handleView,
    handleEdit,
    handleDelete,
    t
  );

  return (
    <div className="w-full gap-6 p-8 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <MainHeader header={t("page_title")}>
          <Quote className="text-primary" />
        </MainHeader>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          {t("add_testimonial")}
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>{t("list_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-3 text-gray-600">{tCommon("loading")}</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">{tCommon("error_loading")}</p>
            </div>
          ) : (
            <TestimonialTable columns={columns} data={testimonials} />
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <TestimonialViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        testimonial={viewingTestimonial}
      />

      {/* Form Dialog (Create/Edit) */}
      <TestimonialFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormDialogChange}
        onSubmit={handleSubmitForm}
        initialData={editingId ? editingData?.data : undefined}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={t("delete_dialog.title")}
        description={t("delete_dialog.description")}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
