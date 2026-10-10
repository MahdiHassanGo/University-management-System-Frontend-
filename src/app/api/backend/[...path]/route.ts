import { type NextRequest, NextResponse } from "next/server";
import {
  backendRequest,
  clearSession,
  loginResponse,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  sameOrigin,
  setSession,
} from "@/lib/server-api";

type Context = { params: Promise<{ path: string[] }> };
async function handle(request: NextRequest, context: Context) {
  if (!["GET", "HEAD"].includes(request.method) && !sameOrigin(request)) {
    return NextResponse.json(
      { success: false, message: "Invalid request origin" },
      { status: 403 },
    );
  }
  const { path } = await context.params;
  if (path.some((part) => !/^[a-zA-Z0-9_-]+$/.test(part)))
    return NextResponse.json({ message: "Invalid API path" }, { status: 400 });
  const route = path.join("/");
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refresh && route === "auth/refresh-token")
    headers.set("Cookie", `refreshToken=${refresh}`);
  headers.set("x-frontend-origin", request.nextUrl.origin);
  try {
    const upstream = await backendRequest(`${route}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : await request.text(),
    });
    if (route === "auth/login" || route === "auth/google")
      return loginResponse(upstream);
    const result = (await upstream.json()) as {
      data?: { accessToken?: string };
      message?: string;
    };
    const response = NextResponse.json(result, { status: upstream.status });
    response.headers.set("Cache-Control", "no-store");
    if (
      route === "auth/refresh-token" &&
      upstream.ok &&
      result.data?.accessToken
    ) {
      setSession(response, result.data.accessToken);
      return NextResponse.json(
        { success: true, data: { authenticated: true } },
        { headers: response.headers },
      );
    }
    if (route === "auth/logout" || upstream.status === 401)
      clearSession(response);
    return response;
  } catch {
    const response = NextResponse.json(
      {
        success: false,
        message:
          "The university service is unavailable. Please try again shortly.",
      },
      { status: 502 },
    );
    if (route === "auth/logout") clearSession(response);
    return response;
  }
}
export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
