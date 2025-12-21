"use client";

import { PageSection } from "@/components/shared/page-section";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CampDetailsSectionProps {
  description?: string | null;
}

export default function campDetailsSection({
  description,
}: CampDetailsSectionProps = {}) {
  const t = useTranslations();

  const fullText =
    description ||
    `
يُعتبر إيواء جباليا أكبر إيواء للاجئين الفلسطينيين في فلسطين، حيث يعيش فيه 119,000 فلسطيني يتوزعون على مساحة لا تتجاوز 1.4 كيلومتر مربع، مما يجعله واحدًا من أكثر الأماكن اكتظاظاً بالسكان في العالم. ينحدر لاجئو جباليا من أحفاد 38,000 فلسطيني تم تطهيرهم عرقيًا من أسدود ويافا والرملة واللد وبئر السبع خلال نكبة عام 1948.
يُعتبر إيواء جباليا أكبر إيواء للاجئين الفلسطينيين في فلسطين، حيث يعيش فيه 119,000 فلسطيني يتوزعون على مساحة لا تتجاوز 1.4 كيلومتر مربع، مما يجعله واحدًا من أكثر الأماكن اكتظاظاً بالسكان في العالم.
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="flex-1 h-full"
    >
      <PageSection
        className="h-full min-h-[300px]"
        description={
          <>
            {/* Clamped Text */}
            <div
              className="leading-10 line-clamp-6 text-gray-700 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5"
              dangerouslySetInnerHTML={{ __html: fullText }}
            />

            {/* Show More Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-3 text-sm font-medium">
                  عرض المزيد
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-right">
                    {t("transparencyTitle") || "تفاصيل المخيم"}
                  </DialogTitle>
                </DialogHeader>

                <div
                  className="text-right leading-8 text-gray-700 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5"
                  dangerouslySetInnerHTML={{ __html: fullText }}
                />
              </DialogContent>
            </Dialog>
          </>
        }
      />
    </motion.div>
  );
}
