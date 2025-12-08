"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/features/auth";
import { User } from "@/features/auth/types/auth.schema";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedUser = authService.getUser();
    const token = authService.getToken();

    if (storedUser && token) {
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to require authentication and optionally check role
 */
export function useRequireAuth(allowedRoles?: User["role"][]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !user) {
      router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Check role if specified
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const dashboardMap: Record<User["role"], string> = {
        admin: "/dashboard/(superadmin)/admin",
        delegate: "/dashboard/(representative)",
        contributor: "/dashboard/(contributor)",
      };

      const correctDashboard = dashboardMap[user.role];
      if (correctDashboard && pathname !== correctDashboard) {
        router.push(correctDashboard);
      }
    }
  }, [isAuthenticated, user, isLoading, router, pathname, allowedRoles]);

  return { user, isAuthenticated, isLoading };
}
