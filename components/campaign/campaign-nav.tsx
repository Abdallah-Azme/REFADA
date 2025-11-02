import { ChevronDown, Globe, Search } from "lucide-react"

export default function CampaignNav() {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
            <span>←</span>
            دخول
          </button>
          <div className="flex items-center gap-2 text-gray-600">
            <Globe size={18} />
            <span>EN</span>
            <ChevronDown size={16} />
          </div>
          <button className="text-gray-600 hover:text-gray-900">
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center gap-8 text-gray-700 font-medium">
          <a href="#" className="hover:text-blue-500 transition-colors">
            اتصل بنا
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            من نحن
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            البوادرات
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            الشركاء والمشاريع
          </a>
          <a href="#" className="text-blue-500 border-b-2 border-blue-500 pb-1">
            الإحصائيات
          </a>
          <a href="#" className="hover:text-blue-500 transition-colors">
            الرئيسية
          </a>
        </div>
      </div>
    </nav>
  )
}
