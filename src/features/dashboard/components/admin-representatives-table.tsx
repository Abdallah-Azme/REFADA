"use client";

import { useCampNames } from "@/features/camps/hooks/use-camps";
import { campsApi } from "@/features/camps/api/camp.api";
import { useQuery } from "@tanstack/react-query";
import { DeleteConfirmDialog } from "@/features/marital-status";
import {
  useApproveRepresentative,
  useChangeRepresentativePassword,
  useRejectRepresentative,
} from "@/features/representatives/hooks/use-approve-reject";
import { useDeleteRepresentative } from "@/features/representatives/hooks/use-delete-representative";
import { useRepresentatives } from "@/features/representatives/hooks/use-representatives";
import { PendingUser } from "@/features/representatives/types/pending-users.schema";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useAdminRepresentativesTable } from "../hooks/use-admin-representatives-table";
import { AdminRepresentativesDataTable } from "./admin-representatives-data-table";
import { ApproveRepresentativeDialog } from "./approve-representative-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { RepresentativesFilter } from "./representatives-filter";

export default function AdminRepresentativesTable() {
  const t = useTranslations();

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<PendingUser | null>(null);

  // Approve state
  const [approveOpen, setApproveOpen] = useState(false);
  const [approvingUser, setApprovingUser] = useState<PendingUser | null>(null);
  const [selectedCampId, setSelectedCampId] = useState<string>("");

  // Reject state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectingUser, setRejectingUser] = useState<PendingUser | null>(null);

  // Change Password state
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState<PendingUser | null>(null);

  const [serverCampFilter, setServerCampFilter] = useState("all");

  // Fetch all delegates without server camp_name filter since API ignores it
  const {
    data: response,
    isLoading: isUsersLoading,
    error,
  } = useRepresentatives({
    role: "delegate",
  });

  // Fetch specific camp delegates array directly from the Camps API using exact specified string logic if active
  const { data: filterCampRes, isLoading: isCampLoading } = useQuery({
    queryKey: ["campDelegateFilter", serverCampFilter],
    queryFn: () => campsApi.getPaginated(1, 10, serverCampFilter),
    enabled: serverCampFilter !== "all" && !!serverCampFilter,
  });

  // Extract the raw string delegate names
  const validDelegateNames =
    serverCampFilter !== "all"
      ? filterCampRes?.data?.[0]?.delegates || []
      : null;

  const deleteMutation = useDeleteRepresentative();
  const approveMutation = useApproveRepresentative();
  const rejectMutation = useRejectRepresentative();
  const changePasswordMutation = useChangeRepresentativePassword();

  // Fetch camps for selection
  const { data: campsData } = useCampNames();
  const camps = campsData?.data || [];

  // Use all data from the response (already filtered by role=delegate in the API)
  const data = React.useMemo(() => {
    return response?.data || [];
  }, [response]);

  const handleDelete = (user: PendingUser) => {
    setDeletingUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteMutation.mutate(deletingUser.id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setDeletingUser(null);
        },
      });
    }
  };

  const handleApprove = (user: PendingUser) => {
    setApprovingUser(user);
    // Find matching camp ID from campName
    if (user.campName) {
      const matchingCamp = camps.find((camp) => {
        const campName =
          typeof camp.name === "string"
            ? camp.name
            : camp.name?.ar || camp.name?.en || "";
        return campName === user.campName;
      });
      setSelectedCampId(matchingCamp ? matchingCamp.id.toString() : "");
    } else {
      setSelectedCampId("");
    }
    setApproveOpen(true);
  };

  const handleConfirmApprove = () => {
    if (approvingUser && selectedCampId) {
      approveMutation.mutate(
        { userId: approvingUser.id, campId: parseInt(selectedCampId) },
        {
          onSuccess: () => {
            setApproveOpen(false);
            setApprovingUser(null);
            setSelectedCampId("");
          },
        },
      );
    }
  };

  const handleReject = (user: PendingUser) => {
    setRejectingUser(user);
    setRejectOpen(true);
  };

  const handleConfirmReject = () => {
    if (rejectingUser) {
      rejectMutation.mutate(rejectingUser.id, {
        onSuccess: () => {
          setRejectOpen(false);
          setRejectingUser(null);
        },
      });
    }
  };

  const handleChangePassword = (user: PendingUser) => {
    setPasswordUser(user);
    setPasswordOpen(true);
  };

  const handleConfirmChangePassword = (
    password: string,
    passwordConfirmation: string,
  ) => {
    if (passwordUser) {
      changePasswordMutation.mutate(
        {
          userId: passwordUser.id,
          password,
          passwordConfirmation,
        },
        {
          onSuccess: () => {
            setPasswordOpen(false);
            setPasswordUser(null);
          },
        },
      );
    }
  };

  const isLoading = isUsersLoading || isCampLoading;

  const {
    table,
    globalFilter,
    setGlobalFilter,
    statusFilter,
    setStatusFilter,
    campFilter,
    setCampFilter,
  } = useAdminRepresentativesTable({
    campFilter: serverCampFilter,
    setCampFilter: setServerCampFilter,
    validDelegateNames: validDelegateNames as string[] | null,
    data,
    onApprove: handleApprove,
    onReject: handleReject,
    onDelete: handleDelete,
    onChangePassword: handleChangePassword,
    t,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">{t("representatives.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-red-600">
        {t("representatives.error_loading")}
      </div>
    );
  }

  return (
    <>
      <RepresentativesFilter
        searchValue={globalFilter}
        setSearchValue={setGlobalFilter}
        statusValue={statusFilter}
        setStatusValue={setStatusFilter}
        campValue={campFilter}
        setCampValue={setCampFilter}
        camps={camps}
      />

      <AdminRepresentativesDataTable table={table} />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title={t("representatives.delete_title")}
        description={t("representatives.delete_description", {
          name: deletingUser?.name || "",
        })}
        isPending={deleteMutation.isPending}
      />

      {/* Approve Dialog with Camp Selection */}
      <ApproveRepresentativeDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        user={approvingUser}
        selectedCampId={selectedCampId}
        onCampChange={setSelectedCampId}
        camps={camps}
        onConfirm={handleConfirmApprove}
        isPending={approveMutation.isPending}
      />

      {/* Reject Confirmation Dialog */}
      <DeleteConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleConfirmReject}
        title={t("representatives.reject_title")}
        description={t("representatives.reject_description", {
          name: rejectingUser?.name || "",
        })}
        isPending={rejectMutation.isPending}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        user={passwordUser}
        onConfirm={handleConfirmChangePassword}
        isPending={changePasswordMutation.isPending}
      />
    </>
  );
}
