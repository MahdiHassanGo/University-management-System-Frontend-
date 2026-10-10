import { type NextRequest, NextResponse } from "next/server";
import { backendBase, SESSION_COOKIE } from "@/lib/server-api";
import type { UserRole } from "@/types";

const home: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  INSTRUCTOR: "/instructor",
  STUDENT: "/student",
};
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const targetRole = pathname.startsWith("/admin")
    ? "SUPER_ADMIN"
    : pathname.startsWith("/instructor")
      ? "INSTRUCTOR"
      : pathname.startsWith("/student")
        ? "STUDENT"
        : null;
  const isProtected = !!targetRole;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const signIn = () => {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  };
  if (!token) return isProtected ? signIn() : NextResponse.next();
  try {
    // Authorize with the API: decoding an unsigned JWT is not authentication.
    const result = await fetch(`${backendBase()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) {
      if (result.status >= 500) return NextResponse.next(); // Pages/API still deny access; avoid losing a valid session during an outage.
      const response = isProtected ? signIn() : NextResponse.next();
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
    const body = (await result.json()) as {
      data: { role?: UserRole; user?: { role?: UserRole } };
    };
    const role = body.data.user?.role || body.data.role;
    if (!role || !home[role])
      return isProtected ? signIn() : NextResponse.next();
    if (targetRole && targetRole !== role)
      return NextResponse.redirect(new URL(home[role], request.url));
    if (pathname === "/login" || pathname === "/register")
      return NextResponse.redirect(new URL(home[role], request.url));
  } catch {
    return NextResponse.next();
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
