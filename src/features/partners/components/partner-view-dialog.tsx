"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Partner } from "../types/partner.schema";
import { Badge } from "@/shared/ui/badge";
import { Calendar, Building2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PartnerViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
}

export function PartnerViewDialog({
  open,
  onOpenChange,
  partner,
}: PartnerViewDialogProps) {
  const t = useTranslations("partners_page");

  if (!partner) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("dialog_view.date_unavailable");
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            {t("dialog_view.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Partner Info Card */}
          <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t("dialog_view.info_title")}
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative h-40 w-60 rounded-lg border-2 border-white shadow-md bg-white overflow-hidden shrink-0 flex items-center justify-center p-2">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 space-y-4 text-center md:text-right">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {t("dialog_view.name")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {partner.name}
                    </p>
                  </div>
                  {partner.order && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {t("dialog_view.order")}
                      </p>
                      <Badge variant="outline" className="text-lg px-4 py-1">
                        {partner.order}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Footer */}
          {partner.created_at && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {t("dialog_view.date_added")}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(partner.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
