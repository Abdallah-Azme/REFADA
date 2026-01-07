import { DynamicPageComponent } from "@/features/pages";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params,
}: {
  params: Promise<{ pageType: string }>;
}) {
  const { pageType } = await params;
  const t = await getTranslations("dynamic_pages.titles");

  // Map pageType to partial key if it exists, otherwise fallback or handle nicely
  // Using 'as any' to avoid rigid key typing issues if pageType is dynamic string
  const title = t.has(pageType as any) ? t(pageType as any) : t("default");

  return <DynamicPageComponent pageType={pageType} title={title} />;
}
