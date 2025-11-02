"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock } from "lucide-react"

interface LoginFormProps {
  userType: "contributor" | "blogger"
  setUserType: (type: "contributor" | "blogger") => void
}

export default function LoginForm({ userType, setUserType }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="p-8 lg:p-12 flex flex-col justify-center">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
            <path d="M8 8L16 2L24 8V24L16 30L8 24V8Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 12L16 8L20 12" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <span>هضنا... غزة</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 bg-blue-100 p-1 rounded-full w-fit">
        <button
          onClick={() => setUserType("contributor")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            userType === "contributor" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          مساهم
        </button>
        <button
          onClick={() => setUserType("blogger")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            userType === "blogger" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          مدون
        </button>
      </div>

      {/* Form Title */}
      <h1 className="text-3xl font-bold text-slate-900 mb-8">تسجيل الدخول</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            required
          />
          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            required
          />
          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            نسيت كلمة المرور
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors mt-6"
        >
          {isLoading ? "جاري التحميل..." : "دخول"}
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-center text-gray-600 mt-6 text-sm">
        ليس لديك حساب؟{" "}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
          تسجيل حساب جديد
        </a>
      </p>
    </div>
  )
}
