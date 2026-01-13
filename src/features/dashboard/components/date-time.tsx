"use client";
import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function DateTime() {
  const locale = useLocale();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const daysArabic = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const daysEnglish = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayName =
    locale === "ar" ? daysArabic[now.getDay()] : daysEnglish[now.getDay()];

  const date = now.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    timeZone: "Asia/Gaza",
  });

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Gaza",
  });

  return (
    <div className="text-sm text-gray-500   items-center gap-2 hidden xl:flex">
      <span>{dayName}</span>
      <span>{date}</span>
      <span>{time}</span>
    </div>
  );
}
