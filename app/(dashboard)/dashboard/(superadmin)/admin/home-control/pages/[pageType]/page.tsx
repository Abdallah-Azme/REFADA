import { DynamicPageComponent } from "@/features/pages";

// Map titles for known page types to display in header before data loads
// NOTE: Backend uses mission/vision/goals but these actually represent:
// - mission → حقوق الملكية (Intellectual Property)
// - vision → حدود دور المنصة (Platform Limits)
// - goals → حماية الفئات الهشة (Vulnerable Protection)
const PAGE_TITLES: Record<string, string> = {
  terms: "شروط الاستخدام",
  privacy: "سياسة الخصوصية",
  transparency: "الشفافية",
  mission: "حقوق الملكية",
  vision: "حدود دور المنصة",
  goals: "حماية الفئات الهشة",
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
