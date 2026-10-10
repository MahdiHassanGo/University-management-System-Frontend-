import { ofetch } from "ofetch";
export const API_BASE_URL = "/api/backend";
export const apiClient = ofetch.create({
  baseURL: API_BASE_URL,
  credentials: "same-origin",
  retry: 0,
  onResponseError({ response }) {
    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      /^(\/admin|\/student|\/instructor|\/payment)/.test(
        window.location.pathname,
      )
    ) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    }
  },
});
export default apiClient;
