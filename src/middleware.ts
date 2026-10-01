import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ACCESS_TOKEN_KEY = "ums_access_token";

function decodeJwtPayload(
  token: string,
): { role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isAdminRoute = pathname.startsWith("/admin");
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isStudentRoute = pathname.startsWith("/student");
  const isProtectedRoute = isAdminRoute || isInstructorRoute || isStudentRoute;

  // 1. If trying to access protected route without token -> redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If token exists, inspect token claims and enforce role boundaries
  if (token) {
    const payload = decodeJwtPayload(token);
    const role = payload?.role;
    const isExpired = payload?.exp ? Date.now() >= payload.exp * 1000 : false;

    // If token expired, clear and redirect to login if protected
    if (isExpired && isProtectedRoute) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(ACCESS_TOKEN_KEY);
      return response;
    }

    // If logged in and visiting /login or /register, redirect to appropriate portal
    if (isAuthRoute && !isExpired && role) {
      const target =
        role === "SUPER_ADMIN"
          ? "/admin"
          : role === "INSTRUCTOR"
            ? "/instructor"
            : "/student";
      return NextResponse.redirect(new URL(target, request.url));
    }

    // Role-based route protection
    if (isAdminRoute && role !== "SUPER_ADMIN") {
      const fallback = role === "INSTRUCTOR" ? "/instructor" : "/student";
      return NextResponse.redirect(new URL(fallback, request.url));
    }

    if (isInstructorRoute && role !== "INSTRUCTOR" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/student", request.url));
    }

    if (isStudentRoute && role !== "STUDENT" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/instructor", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/instructor/:path*",
    "/student/:path*",
    "/login",
    "/register",
  ],
};
