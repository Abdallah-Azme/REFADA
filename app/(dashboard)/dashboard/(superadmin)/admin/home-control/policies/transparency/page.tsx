import PolicyPage from "@/features/home-control/components/policy-page";
import { getTranslations } from "next-intl/server";

export default async function TransparencyPage() {
  const t = await getTranslations("policies_page");
  return (
    <PolicyPage
      sectionIndex={0}
      pageTitle={t("page_title_transparency")}
      pageSubtitle={t("page_subtitle_transparency")}
    />
  );
}
