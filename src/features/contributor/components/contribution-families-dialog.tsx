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
} from "@/components/ui/table";
import { ContributorFamily } from "@/features/contributor/api/contributor-history.api";
import { useTranslations } from "next-intl";

interface ContributionFamiliesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  families: ContributorFamily[];
  projectName?: string;
}

export default function ContributionFamiliesDialog({
  isOpen,
  onClose,
  families,
  projectName,
}: ContributionFamiliesDialogProps) {
  const t = useTranslations();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("contributor_history_title")}
            {projectName && ` - ${projectName}`}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {families.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">
                      {t("contributor_history_family_name")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("contributor_history_national_id")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("contributor_history_phone")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("contributor_history_total_members")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("contributor_history_camp")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("contributor_history_location")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {families.map((family) => (
                    <TableRow key={family.id}>
                      <TableCell className="font-medium text-right">
                        {family.familyName}
                      </TableCell>
                      <TableCell className="text-right">
                        {family.nationalId}
                      </TableCell>
                      <TableCell className="text-right">
                        {family.phone}
                      </TableCell>
                      <TableCell className="text-right">
                        {family.totalMembers}
                      </TableCell>
                      <TableCell className="text-right">
                        {family.camp}
                      </TableCell>
                      <TableCell className="text-right">
                        {family.location && family.location !== "undefined"
                          ? family.location
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t("contributor_history_no_families_found")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
