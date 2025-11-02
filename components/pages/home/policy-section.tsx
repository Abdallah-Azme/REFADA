"use client";
import { motion } from "framer-motion";
import { Shield, FileText, Lock } from "lucide-react";

const cards = [
  {
    icon: <Lock className="w-10 h-10 text-[#C2B693]" />,
    title: "الخصوصية",
    desc: "نحافظ على بيانات المتبرعين والمستفيدين ونستخدمها لخدمة العمل الخيري.",
  },
  {
    icon: <FileText className="w-10 h-10 text-[#C2B693]" />,
    title: "شروط الاستخدام",
    desc: "تنظم علاقتنا بالمتبرعين والمستفيدين بما يضمن الشفافية وتحقيق أهدافنا.",
  },
  {
    icon: <Shield className="w-10 h-10 text-[#C2B693]" />,
    title: "الشفافية",
    desc: "نلتزم بالتوضيح في كل مراحل عملنا ونبلغ المتبرعين بالتفاصيل بدقة ووضوح.",
  },
];

export default function PolicySection() {
  return (
    <section className="bg-[#1F3A36] text-white py-20 rounded-t-[100px]   mt-[-50px]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-6 flex flex-col items-center"
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-gray-300 leading-relaxed mb-4">{card.desc}</p>
              <button className="text-[#C2B693] font-semibold hover:underline">
                المزيد
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
