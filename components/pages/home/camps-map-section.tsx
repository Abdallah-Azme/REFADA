"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import L from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

// Custom icon
const campIcon = new L.Icon({
  iconUrl: "/icons/marker.svg", // put your marker icon here
  iconSize: [32, 40],
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
    image: "/camps/jabalia.jpg",
    position: [31.535, 34.495],
  },
  {
    id: 2,
    name: "مخيم الشاطئ",
    location: "غرب مدينة غزة",
    phone: "+972 22 333 3333",
    image: "/camps/beach.jpg",
    position: [31.535, 34.47],
  },
  {
    id: 3,
    name: "مخيم النصيرات",
    location: "وسط قطاع غزة",
    phone: "+972 22 444 4444",
    image: "/camps/nuseirat.jpg",
    position: [31.45, 34.39],
  },
];

export default function CampsMapSection() {
  const [selected, setSelected] = useState<Camp | null>(camps[0]);

  return (
    <section className="bg-[#E6F0EC] py-16 px-6" dir="rtl">
      {/* Title */}
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

      {/* Map Section */}
      <div className="max-w-5xl mx-auto relative bg-white rounded-2xl shadow overflow-hidden">
        <MapContainer
          center={[31.52, 34.47]}
          zoom={12}
          style={{ height: "400px", width: "100%" }}
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
              <Popup>{camp.name}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Camp Card */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 bg-white rounded-xl shadow-md flex items-center gap-3 p-3 w-[90%] sm:w-[400px]"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={selected.image}
                alt={selected.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1C3A34] text-sm mb-1">
                {selected.name}
              </h3>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                <MapPin size={12} />
                {selected.location}
              </p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                <Phone size={12} />
                {selected.phone}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Note */}
      <p className="text-center text-gray-600 text-sm mt-8">
        اضغط على أي موقع في الخريطة للاطلاع على تفاصيل المخيم وعدد الأسر
        والخدمات المتوفرة
      </p>
    </section>
  );
}
