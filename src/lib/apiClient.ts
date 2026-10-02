import { ofetch } from "ofetch";
import { clearAccessToken, getAccessToken } from "./auth-token";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://university-management-system-mu-sage.vercel.app/api/v1";

export const apiClient = ofetch.create({
  baseURL: API_BASE_URL,
  credentials: "include",
  onRequest({ options }) {
    const token = getAccessToken();
    if (token) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${token}`);
      options.headers = headers;
    }
  },
  onResponseError({ request, response }) {
    const errorData = response._data;
    const message =
      errorData?.message || response.statusText || "Request failed";
    console.warn(`[API ${response.status}] ${request}:`, message);

    // On 401 Unauthorized, if on a protected route in browser, clear token and redirect to login
    if (response.status === 401 && typeof window !== "undefined") {
      clearAccessToken();
      const path = window.location.pathname;
      if (
        path.startsWith("/admin") ||
        path.startsWith("/instructor") ||
        path.startsWith("/student")
      ) {
        window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
      }
    }
  },
});

export default apiClient;
