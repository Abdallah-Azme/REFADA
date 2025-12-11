"use client";

import ImageFallback from "@/components/shared/image-fallback";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Camp } from "@/features/camps/types/camp.schema";

export default function CampsMapSection({
  secondary,
  dashboard = false,
  camps = [],
}: {
  secondary?: boolean;
  dashboard?: boolean;
  camps?: Camp[];
}) {
  const campIcon = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return new L.Icon({
      iconUrl: "/pages/pages/camping.webp", // put your marker icon here
      iconSize: [24, 24],
      iconAnchor: [16, 40],
    });
  }, []);
  // Filter camps with valid coordinates
  const validCamps = useMemo(() => {
    return camps.filter((camp) => {
      const lat = parseFloat(camp.latitude as any);
      const lng = parseFloat(camp.longitude as any);
      return !isNaN(lat) && !isNaN(lng);
    });
  }, [camps]);

  const [selected, setSelected] = useState<Camp | null>(
    validCamps.length > 0 ? validCamps[0] : null
  );

  return (
    <section
      className={cn(
        "bg-[#E6F0EC] h-full px-6",
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
            مواقع الإيواءات
          </h2>
          <p className="text-gray-600 text-sm">
            من خلال الخريطة التفاعلية التالية يمكنك استعراض أماكن الإيواءات
            المنتشرة في مختلف المناطق بغزة
          </p>
        </motion.div>
      )}

      {/* Map Section */}
      <div
        className={cn(
          "max-w-5xl mx-auto relative h-full bg-white rounded-2xl overflow-hidden shadow",
          secondary ? "" : "h-[400px]"
        )}
      >
        <MapContainer
          center={[31.4, 34.4]} // Approximate center of Gaza Strip
          zoom={10}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validCamps.map((camp) => {
            const lat = parseFloat(camp.latitude as any);
            const lng = parseFloat(camp.longitude as any);
            if (!campIcon) return null;
            return (
              <Marker
                key={camp.id}
                position={[lat, lng]}
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
                        src={camp.campImg}
                        alt={camp.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-gray-500 text-xs mt-2 flex items-center justify-center gap-1">
                      <MapPin size={12} />
                      {camp.location || ""}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Camp Card */}
        {selected && !secondary && (
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
              <ImageFallback
                src={selected.campImg}
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
                {selected.location || "غزة"}
              </p>
              {/* Phone is not in Camp schema provided in task, so removing/commenting out or using placeholder */}
              {/* <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                تواصل معنا: ...
              </p> */}
              {selected.bankAccount && (
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  الحساب البنكي: {selected.bankAccount}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Note */}
      {!secondary && (
        <p className="text-center text-gray-600 text-sm mt-8">
          اضغط على أي موقع في الخريطة للاطلاع على تفاصيل الإيواء وعدد الأسر
          والخدمات المتوفرة
        </p>
      )}
    </section>
  );
}
