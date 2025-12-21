"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/features/auth";
import { refreshTokenApi } from "@/features/auth/api";
import { User, AuthTokens } from "@/features/auth/types/auth.schema";

interface LoginData {
  user: User;
  tokens: AuthTokens;
  accessExpiresIn: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => void;
  logout: () => void;
  refreshAuthTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token refresh threshold: refresh 5 minutes before expiry
const REFRESH_THRESHOLD_SECONDS = 300;
// Check interval: check every minute
const CHECK_INTERVAL_MS = 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Function to refresh tokens
  const refreshAuthTokens = useCallback(async (): Promise<boolean> => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) return false;
    isRefreshingRef.current = true;

    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        console.warn("No refresh token available");
        isRefreshingRef.current = false;
        return false;
      }

      const response = await refreshTokenApi(refreshToken);

      if (response.success && response.data) {
        // Store new tokens
        const tokens = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          tokenType: response.data.tokenType,
          accessExpiresIn: response.data.accessExpiresIn,
          refreshExpiresIn: response.data.refreshExpiresIn,
        };

        authService.storeTokens(tokens);
        authService.storeUser(response.data.user);
        authService.storeTokenExpiry(response.data.accessExpiresIn);
        setUser(response.data.user);

        isRefreshingRef.current = false;
        return true;
      }

      isRefreshingRef.current = false;
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // If refresh fails, logout the user
      authService.logout();
      setUser(null);
      isRefreshingRef.current = false;
      return false;
    }
  }, []);

  // Check and refresh token if needed
  const checkAndRefreshToken = useCallback(async () => {
    if (!authService.getToken()) return;

    if (authService.isTokenExpiringSoon(REFRESH_THRESHOLD_SECONDS)) {
      await refreshAuthTokens();
    }
  }, [refreshAuthTokens]);

  useEffect(() => {
    // Check if user is authenticated on mount
    const storedUser = authService.getUser();
    const token = authService.getToken();

    // IMPORTANT: Check if the auth_token cookie exists
    // The middleware uses cookies for auth, so we must verify cookie exists
    // If localStorage has data but cookie is missing (expired), clear localStorage
    const hasCookie = document.cookie.includes("auth_token");

    if (storedUser && token && hasCookie) {
      setUser(storedUser);

      // Check if token is expiring soon and refresh immediately
      if (authService.isTokenExpiringSoon(REFRESH_THRESHOLD_SECONDS)) {
        refreshAuthTokens();
      }

      // Set up interval to check token expiry
      refreshIntervalRef.current = setInterval(
        checkAndRefreshToken,
        CHECK_INTERVAL_MS
      );
    } else if (storedUser || token) {
      // Mismatch: localStorage has data but cookie is missing
      // Try to refresh using refresh token first
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        refreshAuthTokens().then((success) => {
          if (!success) {
            console.warn(
              "Auth state mismatch detected - clearing stale auth data"
            );
            authService.logout();
            setUser(null);
          }
        });
      } else {
        // No refresh token, clear everything
        console.warn("Auth state mismatch detected - clearing stale auth data");
        authService.logout();
        setUser(null);
      }
    }

    setIsLoading(false);

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshAuthTokens, checkAndRefreshToken]);

  // Login function - stores auth data and updates React state
  const login = useCallback(
    (data: LoginData) => {
      // Store tokens, user data, and token expiry
      authService.storeTokens(data.tokens);
      authService.storeUser(data.user);
      authService.storeTokenExpiry(data.accessExpiresIn);

      // Update React state
      setUser(data.user);

      // Set up interval to check token expiry
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      refreshIntervalRef.current = setInterval(
        checkAndRefreshToken,
        CHECK_INTERVAL_MS
      );
    },
    [checkAndRefreshToken]
  );

  const logout = () => {
    // Clear the refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshAuthTokens,
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
