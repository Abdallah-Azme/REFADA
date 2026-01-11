import CampsDetails from "@/features/dashboard/components/camps-details";
import ContributionTable from "@/features/dashboard/components/contribution-table";
import ContributorForm from "@/features/dashboard/components/contributor-form";
import EditCampFormData from "@/features/dashboard/components/edit-camp-form-data";
import LatestActivities from "@/features/dashboard/components/latest-activities";
import CampFamilyStats from "@/features/dashboard/components/camp-family-stats";
import { Tangent, Tent, User } from "lucide-react";
import MainHeader from "@/features/dashboard/components/main-header";

import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("contributors");
  return (
    <main className="w-full flex flex-col  gap-6 p-8 bg-gray-50  ">
      <div className="flex items-center justify-between mb-5">
        <MainHeader header={t("contributor_data")}>
          <User />
        </MainHeader>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 items-start bg-white rounded-xl p-4">
        {/* Right Section - Camp Stats */}
        <ContributorForm />

        {/* Left Section - Representative Info */}
        <LatestActivities className="w-full flex-1  " />
      </div>
      <CampFamilyStats />
      <ContributionTable />
    </main>
  );
}
