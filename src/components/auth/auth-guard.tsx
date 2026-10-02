"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import { getAccessToken } from "@/lib/auth-token";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = typeof window !== "undefined" ? getAccessToken() : null;
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    if (isPending) return;
    if (isError || !user) {
      router.replace("/login");
    }
  }, [token, isPending, isError, user, router]);

  if (!token || isError || (!isPending && !user)) {
    return <AuthLoading label="Redirecting to sign-in..." />;
  }

  if (isPending) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
