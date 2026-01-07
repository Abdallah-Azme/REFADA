import PolicyPage from "@/features/home-control/components/policy-page";
import { getTranslations } from "next-intl/server";

export default async function IntellectualPropertyPage() {
  const t = await getTranslations("policies_page");
  return (
    <PolicyPage
      sectionIndex={3}
      pageTitle={t("page_title_intellectual_property")}
      pageSubtitle={t("page_subtitle_intellectual_property")}
    />
  );
}
