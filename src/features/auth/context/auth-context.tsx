"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
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
 * Note: The middleware already handles auth redirects for dashboard routes.
 * This hook is a client-side fallback for edge cases.
 */
export function useRequireAuth(allowedRoles?: User["role"][]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // Only perform the check once per mount to avoid race conditions
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    // Double-check token directly from storage to avoid React state race conditions
    const token = authService.getToken();
    const storedUser = authService.getUser();

    // If there's a valid token and user in storage, we're authenticated
    // even if React state hasn't caught up yet
    if (token && storedUser) {
      // Check role if specified
      if (allowedRoles && !allowedRoles.includes(storedUser.role)) {
        const dashboardMap: Record<User["role"], string> = {
          admin: "/dashboard/admin",
          delegate: "/dashboard/families",
          contributor: "/dashboard/contributor",
        };

        const correctDashboard = dashboardMap[storedUser.role];
        if (correctDashboard && pathname !== correctDashboard) {
          router.replace(correctDashboard);
        }
      }
      return;
    }

    // Not authenticated - redirect to login
    // Only redirect if we're sure there's no token
    if (!token || !storedUser) {
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, router, pathname, allowedRoles, isAuthenticated, user]);

  return { user, isAuthenticated, isLoading };
}
