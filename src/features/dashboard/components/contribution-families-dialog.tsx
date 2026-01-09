"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/shared/ui/table";
import { ContributorFamily } from "../types/history.types";
import { useTranslations } from "next-intl";

interface ContributionFamiliesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  families: ContributorFamily[];
}

export function ContributionFamiliesDialog({
  open,
  onOpenChange,
  families,
}: ContributionFamiliesDialogProps) {
  const t = useTranslations("contributor_history");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">{t("family_name")}</TableHead>
                <TableHead className="text-right">{t("national_id")}</TableHead>
                <TableHead className="text-right">{t("phone")}</TableHead>
                <TableHead className="text-right">
                  {t("total_members")}
                </TableHead>
                <TableHead className="text-right">{t("camp")}</TableHead>
                <TableHead className="text-right">{t("location")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {families.length > 0 ? (
                families.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell>{family.familyName}</TableCell>
                    <TableCell>{family.nationalId}</TableCell>
                    <TableCell className="ltr:text-left">
                      {family.phone}
                    </TableCell>
                    <TableCell>{family.totalMembers}</TableCell>
                    <TableCell>{family.camp}</TableCell>
                    <TableCell>
                      {family.location !== "undefined" ? family.location : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("no_families_found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
