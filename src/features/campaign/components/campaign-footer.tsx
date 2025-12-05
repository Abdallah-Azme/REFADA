import {
  Mail,
  Phone,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

export default function CampaignFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-20" dir="rtl">
      <div className="  mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">الرئيسية</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  تسجيل الدخول
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  أهم الإنجازات
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">من نحن</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  نبذة
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  المشاريع والمبادرات
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">المشاريع</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  المحتويات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  المساهمات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  المساهمات
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">الشركاء والمشاريع</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  الشركاء
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  المشاريع
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26H22L17.82 12.88L20.91 19.12L12 14.5L3.09 19.12L6.18 12.88L2 8.26H8.91L12 2Z" />
              </svg>
              <span className="font-bold">هضنا غرب</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Facebook size={20} />
              </a>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+972-22-333-4444</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@hemtna.com</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>جميع الحقوق محفوظة لمحفوظة لهضنا غرب.....2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
