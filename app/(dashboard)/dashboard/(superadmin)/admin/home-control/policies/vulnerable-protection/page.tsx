import PolicyPage from "@/features/home-control/components/policy-page";
import { getTranslations } from "next-intl/server";

export default async function VulnerableProtectionPage() {
  const t = await getTranslations("policies_page");
  return (
    <PolicyPage
      sectionIndex={5}
      pageTitle={t("page_title_vulnerable_protection")}
      pageSubtitle={t("page_subtitle_vulnerable_protection")}
    />
  );
}
