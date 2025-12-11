"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Logo from "../logo";
import { Settings } from "@/features/settings/types/settings.schema";
import ImageFallback from "../shared/image-fallback";

interface FooterProps {
  settings?: Settings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#10201C] text-white pt-10 pb-4  ">
      <div className="container px-4 mx-auto">
        {/* Top Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Column 1 - الرئيسية */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">الرئيسية</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/signin"
                  className="hover:text-white transition cursor-pointer"
                >
                  تسجيل الدخول
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="hover:text-white transition cursor-pointer"
                >
                  إنشاء حساب{" "}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - من نحن */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">من نحن</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/aboutus"
                  className="hover:text-white transition cursor-pointer"
                >
                  من نحن
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition cursor-pointer"
                >
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - المشاريع */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">المشاريع</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/camps"
                  className="hover:text-white transition cursor-pointer"
                >
                  الإيواءات
                </Link>
              </li>
              <li>
                <Link
                  href="/stats"
                  className="hover:text-white transition cursor-pointer"
                >
                  الإحصائيات
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - الشكاوى والمقترحات */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">الشكاوى والمقترحات</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/suggestions"
                  className="hover:text-white transition cursor-pointer"
                >
                  الشكاوى
                </Link>
              </li>
              <li>
                <Link
                  href="/transparency"
                  className="hover:text-white transition cursor-pointer"
                >
                  الشفافية
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Contact + Social + Logo */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-700 pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start gap-2 text-sm text-gray-300">
            {settings?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span dir="ltr">{settings.phone}</span>
              </div>
            )}
            {settings?.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{settings.email}</span>
              </div>
            )}
            {/* Fallback if no settings */}
            {!settings && (
              <>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>+972-22-333-4444</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>info@hemtna.com</span>
                </div>
              </>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[
              {
                Icon: Instagram,
                label: "Instagram",
                href: settings?.instagram || "#",
              },
              {
                Icon: Twitter,
                label: "Twitter",
                href: settings?.twitter || "#",
              },
              {
                Icon: Facebook,
                label: "Facebook",
                href: settings?.facebook || "#",
              },
              {
                Icon: Linkedin,
                label: "LinkedIn",
                href: settings?.linkedin || "#",
              },
            ].map(({ Icon, label, href }) => (
              // Only render if href is valid or just render anyway?
              // Assuming # is placeholder.
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition cursor-pointer"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>

          {/* Logo */}
          {settings?.siteLogo ? (
            <div className="relative w-32 h-12">
              <ImageFallback
                src={settings.siteLogo}
                alt={settings.siteName?.ar || "Logo"}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <Logo />
          )}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#203730] mt-6 py-3 text-center text-xs text-gray-400">
        جميع الحقوق محفوظة لجمعية رفاد © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
