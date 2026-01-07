import PolicyPage from "@/features/home-control/components/policy-page";
import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
  const t = await getTranslations("policies_page");
  return (
    <PolicyPage
      sectionIndex={1}
      pageTitle={t("page_title_terms")}
      pageSubtitle={t("page_subtitle_terms")}
    />
  );
}
