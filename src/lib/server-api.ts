import "server-only";
import { type NextRequest, NextResponse } from "next/server";

export const SESSION_COOKIE = "ums_access_token";
export const REFRESH_COOKIE = "ums_refresh_token";
export const backendBase = () =>
  (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:5000/api/v1"
  ).replace(/\/$/, "");
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
export function clearSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
export function setSession(
  response: NextResponse,
  token: string,
  refreshToken?: string,
) {
  let maxAge = 86400;
  try {
    const claims = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    ) as { exp?: number };
    if (claims.exp)
      maxAge = Math.max(0, claims.exp - Math.floor(Date.now() / 1000));
  } catch {
    /* Backend still validates the token on every protected request. */
  }
  response.cookies.set(SESSION_COOKIE, token, { ...cookieOptions, maxAge });
  if (refreshToken)
    response.cookies.set(REFRESH_COOKIE, refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 86400,
    });
}
export function sameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}
export async function backendRequest(path: string, options: RequestInit = {}) {
  return fetch(`${backendBase()}/${path}`, {
    ...options,
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  });
}
export async function loginResponse(upstream: Response) {
  const result = (await upstream.json()) as {
    success: boolean;
    message: string;
    data?: { accessToken?: string; needPasswordChange?: boolean };
  };
  const response = NextResponse.json(
    {
      ...result,
      data: result.success
        ? {
            authenticated: true,
            needPasswordChange: result.data?.needPasswordChange,
          }
        : null,
    },
    { status: upstream.status },
  );
  response.headers.set("Cache-Control", "no-store");
  if (upstream.ok && result.data?.accessToken) {
    const setCookie = upstream.headers.get("set-cookie");
    const refresh = setCookie?.match(/refreshToken=([^;]+)/)?.[1];
    setSession(response, result.data.accessToken, refresh);
  }
  return response;
}
