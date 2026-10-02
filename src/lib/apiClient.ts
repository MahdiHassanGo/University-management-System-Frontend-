import { ofetch } from "ofetch";
import { getAccessToken } from "./auth-token";

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
  onResponseError({ response }) {
    const errorData = response._data;
    const message =
      errorData?.message || response.statusText || "Request failed";
    console.error(`[API Error ${response.status}]`, message, errorData);
  },
});

export default apiClient;
