import { User, AuthTokens } from "../types/auth.schema";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const authService = {
  // Token management
  storeTokens(tokens: AuthTokens): void {
    if (typeof window !== "undefined") {
      // Store in localStorage (legacy/backup)
      localStorage.setItem("auth_token", tokens.accessToken);
      localStorage.setItem("refresh_token", tokens.refreshToken);

      // Store in cookies for middleware
      setCookie("auth_token", tokens.accessToken, {
        maxAge: tokens.accessExpiresIn || 60 * 60 * 2, // Default 2 hours
        path: "/",
        sameSite: "lax",
      });
      setCookie("refresh_token", tokens.refreshToken, {
        maxAge: tokens.refreshExpiresIn || 60 * 60 * 24 * 30, // Default 30 days
        path: "/",
        sameSite: "lax",
      });
    }
  },

  storeToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      setCookie("auth_token", token, { path: "/" });
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return (
        (getCookie("auth_token") as string) ||
        localStorage.getItem("auth_token")
      );
    }
    return null;
  },

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return (
        (getCookie("refresh_token") as string) ||
        localStorage.getItem("refresh_token")
      );
    }
    return null;
  },

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      deleteCookie("auth_token");
      deleteCookie("refresh_token");
    }
  },

  // User management
  storeUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
      // Store role in cookie for middleware
      setCookie("user_role", user.role, { path: "/" });
    }
  },

  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      deleteCookie("user_role");
    }
  },

  // Auth state
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Role helpers
  getRoleLabel(role: User["role"]): string {
    const labels = {
      admin: "مدير",
      delegate: "مندوب",
      contributor: "مساهم",
    };
    return labels[role];
  },

  // Logout
  logout(): void {
    this.removeToken();
    this.removeUser();
    // Clear any other auth-related data
    if (typeof window !== "undefined") {
      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_token");
    }
  },

  // Password reset flow helpers
  storeResetEmail(email: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("reset_email", email);
    }
  },

  getResetEmail(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("reset_email");
    }
    return null;
  },

  storeResetToken(token: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("reset_token", token);
    }
  },

  getResetToken(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("reset_token");
    }
    return null;
  },

  clearResetData(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_token");
    }
  },
};
