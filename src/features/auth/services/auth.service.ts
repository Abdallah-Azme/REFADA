import { User, AuthTokens } from "../types/auth.schema";

export const authService = {
  // Token management
  storeTokens(tokens: AuthTokens): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
    }
  },

  storeToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token");
    }
    return null;
  },

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
    }
  },

  // User management
  storeUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
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
