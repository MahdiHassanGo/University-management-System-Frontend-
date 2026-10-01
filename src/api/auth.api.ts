import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  RegistrationPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient<ApiResponse<any>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}

export function getMe() {
  return apiClient<ApiResponse<any>>("/auth/me");
}

export function googleOAuth(payload: {
  idToken: string;
  programId?: string;
  admissionSemesterId?: string;
}) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function changePassword(payload: ChangePasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
}

export function refreshToken() {
  return apiClient<ApiResponse<{ accessToken: string }>>(
    "/auth/refresh-token",
    {
      method: "POST",
    },
  );
}
