import { User } from "../types/auth.schema";

export const authService = {
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

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

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

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getRoleLabel(role: User["role"]): string {
    const labels = {
      admin: "مدير",
      representative: "مندوب",
      contributor: "مساهم",
    };
    return labels[role];
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
  },
};
