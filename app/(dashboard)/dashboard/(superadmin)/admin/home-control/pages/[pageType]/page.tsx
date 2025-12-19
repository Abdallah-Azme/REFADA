import { DynamicPageComponent } from "@/features/pages";

// Map titles for known page types to display in header before data loads
const PAGE_TITLES: Record<string, string> = {
  terms: "شروط الاستخدام",
  privacy: "سياسة الخصوصية",
  transparency: "الشفافية",
  mission: "رسالتنا",
  vision: "رؤيتنا",
  goals: "أهدافنا",
};

export default async function Page({
  params,
}: {
  params: Promise<{ pageType: string }>;
}) {
  const { pageType } = await params;
  const title = PAGE_TITLES[pageType] || "تفاصيل الصفحة";
  return <DynamicPageComponent pageType={pageType} title={title} />;
}
