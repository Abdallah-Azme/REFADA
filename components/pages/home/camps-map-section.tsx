"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Tent } from "lucide-react";
import L from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import ImageFallback from "@/components/shared/image-fallback";

// Custom icon
const campIcon = new L.Icon({
  iconUrl: "/pages/pages/camping.webp", // put your marker icon here
  iconSize: [24, 24],
  iconAnchor: [16, 40],
});

interface Camp {
  id: number;
  name: string;
  location: string;
  phone: string;
  image: string;
  position: [number, number];
}

const camps: Camp[] = [
  {
    id: 1,
    name: "مخيم جباليا",
    location: "المخيم الشمالي - غزة",
    phone: "+972 22 222 2222",
    image: "/pages/home/gaza-camp-1.webp",
    position: [31.535, 34.495],
  },
  {
    id: 2,
    name: "مخيم الشاطئ",
    location: "غرب مدينة غزة",
    phone: "+972 22 333 3333",
    image: "/pages/home/gaza-camp-2.webp",
    position: [31.535, 34.47],
  },
  {
    id: 3,
    name: "مخيم النصيرات",
    location: "وسط قطاع غزة",
    phone: "+972 22 444 4444",
    image: "/pages/home/gaza-camp-3.webp",
    position: [31.45, 34.39],
  },
];

export default function CampsMapSection({
  secondary,
  dashboard = false,
}: {
  secondary?: boolean;
  dashboard?: boolean;
}) {
  const [selected, setSelected] = useState<Camp | null>(camps[0]);

  return (
    <section
      className={cn(
        "bg-[#E6F0EC]  px-6",
        secondary ? "py-4 rounded-2xl" : "py-16"
      )}
    >
      {/* Title */}
      {!secondary && (
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-[#1C3A34] mb-2">
            مواقع المخيمات
          </h2>
          <p className="text-gray-600 text-sm">
            من خلال الخريطة التفاعلية التالية يمكنك استعراض أماكن المخيمات
            المنتشرة في مختلف المناطق بغزة
          </p>
        </motion.div>
      )}

      {/* Map Section */}
      <div
        className={cn(
          "max-w-5xl mx-auto relative  bg-white rounded-2xl overflow-hidden shadow",
          secondary ? "h-80" : "h-[400px]"
        )}
      >
        <MapContainer
          center={[31.52, 34.47]}
          zoom={12}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {camps.map((camp) => (
            <Marker
              key={camp.id}
              position={camp.position}
              icon={campIcon}
              eventHandlers={{
                click: () => setSelected(camp),
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold text-[#1C3A34] mb-2 text-sm">
                    {camp.name}
                  </h3>
                  <div className="relative w-40 h-24 mx-auto rounded-lg overflow-hidden">
                    <ImageFallback
                      src={camp.image}
                      alt={camp.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-2 flex items-center justify-center gap-1">
                    <MapPin size={12} />
                    {camp.location}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Camp Card */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "absolute bottom-1 right-1 bg-white rounded-xl shadow-md flex items-center gap-3 p-3  z-[1000] pointer-events-auto",
              dashboard ? "w-[99%]" : "w-[90%] sm:w-[400px]"
            )}
            style={{ zIndex: 1000 }}
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h3 className="font-semibold text-[#1C3A34] text-sm mb-1">
                {selected.name}
              </h3>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                شمال قطاع غزة - على بُعد نحو 4 كيلومترات
              </p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                تواصل معنا:
                {selected.phone}
              </p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                الحساب البنكي: 10008890003444
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Note */}
      {!secondary && (
        <p className="text-center text-gray-600 text-sm mt-8">
          اضغط على أي موقع في الخريطة للاطلاع على تفاصيل المخيم وعدد الأسر
          والخدمات المتوفرة
        </p>
      )}
    </section>
  );
}
