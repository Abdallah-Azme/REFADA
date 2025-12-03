import { Phone, Instagram, Twitter, Linkedin, Facebook } from "lucide-react"

export default function CampaignHeader() {
  return (
    <header className="bg-gray-900 text-white py-4 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
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

        <div className="flex items-center gap-2">
          <Phone size={18} />
          <span className="text-sm">+972-22-333-4444</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26H22L17.82 12.88L20.91 19.12L12 14.5L3.09 19.12L6.18 12.88L2 8.26H8.91L12 2Z" />
          </svg>
          <span className="font-bold">هضنا غرب</span>
        </div>
      </div>
    </header>
  )
}
