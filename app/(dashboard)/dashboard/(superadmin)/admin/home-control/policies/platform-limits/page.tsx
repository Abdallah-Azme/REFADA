import PolicyPage from "@/features/home-control/components/policy-page";
import { getTranslations } from "next-intl/server";

export default async function PlatformLimitsPage() {
  const t = await getTranslations("policies_page");
  return (
    <PolicyPage
      sectionIndex={4}
      pageTitle={t("page_title_platform_limits")}
      pageSubtitle={t("page_subtitle_platform_limits")}
    />
  );
}
