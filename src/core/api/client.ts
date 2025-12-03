import { ofetch } from "ofetch";

// API base URL from environment or default
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Create API client with ofetch
export const apiClient = ofetch.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Automatically parse JSON responses
  parseResponse: JSON.parse,
  // Handle errors
  onResponseError({ response }) {
    console.error("API Error:", response.status, response.statusText);
  },
});

// Helper methods for common HTTP operations
export const api = {
  get: <T>(url: string, options?: any) =>
    apiClient<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body?: any, options?: any) =>
    apiClient<T>(url, { method: "POST", body, ...options }),

  put: <T>(url: string, body?: any, options?: any) =>
    apiClient<T>(url, { method: "PUT", body, ...options }),

  patch: <T>(url: string, body?: any, options?: any) =>
    apiClient<T>(url, { method: "PATCH", body, ...options }),

  delete: <T>(url: string, options?: any) =>
    apiClient<T>(url, { method: "DELETE", ...options }),
};
