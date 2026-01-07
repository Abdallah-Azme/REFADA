"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Loader2, Plus, Tent } from "lucide-react";
import MainHeader from "@/shared/components/main-header";
import { Dialog } from "@/components/ui/dialog";

import {
  useCamps,
  useCreateCamp,
  useUpdateCamp,
  useDeleteCamp,
  useCampDetails,
} from "@/features/camps/hooks/use-camps";
import { CampFormDialog } from "@/features/camps/components/camp-form-dialog";
import { CampsTable } from "@/features/camps/components/camps-table";
import { CampDetailsDialog } from "@/features/camps/components/camp-details-dialog";
import { Camp, CampFormValues } from "@/features/camps/types/camp.schema";
import { DeleteConfirmDialog } from "@/features/marital-status/components/delete-confirm-dialog";
import { createAdminCampColumns } from "@/features/camps/components/camp-table-columns";

export default function AdminCampsPage() {
  const t = useTranslations("camps");
  const tCommon = useTranslations("common");

  // State
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);

  // Queries & Mutations
  const { data: campsData, isLoading: isLoadingCamps } = useCamps();
  const { data: campDetails, isLoading: isLoadingDetails } = useCampDetails(
    detailsId ? detailsId.toString() : null
  );
  const createMutation = useCreateCamp();
  const updateMutation = useUpdateCamp();
  const deleteMutation = useDeleteCamp();

  const handleSubmit = (data: CampFormValues) => {
    if (selectedCamp && selectedCamp.slug) {
      updateMutation.mutate(
        { slug: selectedCamp.slug, data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedCamp(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleEdit = (camp: Camp) => {
    setSelectedCamp(camp);
    setFormOpen(true);
  };

  const handleDelete = (camp: Camp) => {
    setDeleteId(camp.id);
  };

  const handleViewDetails = (camp: Camp) => {
    setDetailsId(camp.id);
    setDetailsOpen(true);
  };

  const handleToggleStatus = (camp: Camp) => {
    console.log("Toggle status", camp.slug);
  };

  const columns = createAdminCampColumns(
    {
      onEdit: handleEdit,
      onDelete: (slug: string) => {
        // Find camp by slug to get its id for deletion
        const camp = campsData?.data.find((c: Camp) => c.slug === slug);
        if (camp) setDeleteId(camp.id);
      },
      onToggleStatus: (slug: string) => {
        console.log("Toggle status", slug);
      },
      onView: handleViewDetails,
    },
    t
  );

  return (
    <div className="space-y-6">
      <MainHeader header={t("admin_title")} subheader={t("admin_subtitle")}>
        <Tent className="h-6 w-6 text-primary" />
      </MainHeader>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {t("camps_list")}
          </CardTitle>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("add_camp")}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingCamps ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <CampsTable data={campsData?.data || []} customColumns={columns} />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedCamp(null);
        }}
      >
        <CampFormDialog
          initialData={selectedCamp}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false);
            setSelectedCamp(null);
          }}
          role="admin"
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Dialog>

      <CampDetailsDialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) setDetailsId(null);
        }}
        camp={campDetails?.data}
        isLoading={isLoadingDetails}
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId.toString(), {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
        title={t("delete_title")}
        description={t("delete_desc")}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
