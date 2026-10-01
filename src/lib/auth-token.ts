export const ACCESS_TOKEN_KEY = "ums_access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Try reading from cookie first
  const match = document.cookie.match(
    new RegExp(`(^|;\\s*)${ACCESS_TOKEN_KEY}=([^;]*)`),
  );
  if (match?.[2]) {
    return decodeURIComponent(match[2]);
  }

  // 2. Fallback to localStorage
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // Ignore storage quota or disabled storage
  }

  // Set cookie for 7 days with SameSite=Lax for Next.js middleware protection
  const maxAge = 7 * 24 * 60 * 60;
  document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // Ignore
  }

  // Clear cookie
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function decodeJwtPayload(
  token: string,
): { userId?: string; email?: string; role?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
