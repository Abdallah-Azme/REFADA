"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

// Dynamically import Leaflet components to prevent SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Component to handle map click events
const MapClickHandler = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMapEvents } = mod;
      return function ClickHandler({
        onClick,
      }: {
        onClick: (lat: number, lng: number) => void;
      }) {
        useMapEvents({
          click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
          },
        });
        return null;
      };
    }),
  { ssr: false }
);

// Gaza Strip center coordinates
const GAZA_CENTER = { lat: 31.4, lng: 34.4 };

interface LocationPickerMapProps {
  value: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
  height?: string;
}

export default function LocationPickerMap({
  value,
  onChange,
  height = "300px",
}: LocationPickerMapProps) {
  const [markerIcon, setMarkerIcon] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dynamically load Leaflet CSS and create marker icon
  useEffect(() => {
    if (!isClient) return;

    // Inject Leaflet CSS via link tag
    const linkId = "leaflet-css";
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    // Dynamically import Leaflet JS and create icon
    import("leaflet").then((L) => {
      setMarkerIcon(
        new L.Icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      );
    });
  }, [isClient]);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      onChange({ lat, lng });
    },
    [onChange]
  );

  // Get map center - use value if valid, otherwise use Gaza center
  const mapCenter =
    value.lat !== 0 || value.lng !== 0
      ? [value.lat, value.lng]
      : [GAZA_CENTER.lat, GAZA_CENTER.lng];

  // Get marker position
  const markerPosition =
    value.lat !== 0 || value.lng !== 0
      ? [value.lat, value.lng]
      : [GAZA_CENTER.lat, GAZA_CENTER.lng];

  if (!isClient) {
    return (
      <div
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-gray-500 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>جاري تحميل الخريطة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="rounded-lg overflow-hidden border border-gray-200"
        style={{ height }}
      >
        <MapContainer
          center={mapCenter as [number, number]}
          zoom={11}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onClick={handleMapClick} />
          {markerIcon && (
            <Marker
              position={markerPosition as [number, number]}
              icon={markerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  onChange({ lat: position.lat, lng: position.lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          اضغط على الخريطة أو اسحب الدبوس لتحديد الموقع
        </span>
        <span className="font-mono text-[10px]">
          {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </span>
      </div>
    </div>
  );
}
