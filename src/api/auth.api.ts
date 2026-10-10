import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthProfile,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  RegistrationPayload,
  StudentProfile,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient<ApiResponse<StudentProfile>>("/auth/register", {
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
  return apiClient<ApiResponse<AuthProfile>>("/auth/me");
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
  return apiClient<ApiResponse<{ authenticated: boolean }>>(
    "/auth/refresh-token",
    {
      method: "POST",
    },
  );
}
