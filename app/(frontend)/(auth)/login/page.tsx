"use client";

import { useState } from "react";
import LoginForm from "@/components/pages/login/login-form";
import LoginImageSection from "@/components/pages/login/login-image-section";

export default function LoginPage() {
  const [userType, setUserType] = useState<"contributor" | "blogger">(
    "contributor"
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-5xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Side - Login Form */}
          <LoginForm userType={userType} setUserType={setUserType} />

          {/* Right Side - Image Section */}
          <LoginImageSection />
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white text-center py-4 text-sm">
        جميع الحقوق محفوظة لمحفوظطة لهمنا غزة....2025
      </div>
    </div>
  );
}
