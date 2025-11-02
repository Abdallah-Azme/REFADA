import CampaignHeader from "@/components/campaign/campaign-header";
import CampaignNav from "@/components/campaign/campaign-nav";
import CampaignCards from "@/components/campaign/campaign-cards";
import CampaignFooter from "@/components/campaign/campaign-footer";

export default function CampaignPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <CampaignHeader />
      <CampaignNav />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">الإحصائيات</h1>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">الإحصائيات</span>
          </div>
        </div>

        <CampaignCards />

        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 border-2 border-blue-500 text-blue-500 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <span>✨</span>
            المزيد
          </button>
        </div>
      </main>

      <CampaignFooter />
    </div>
  );
}
