"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending) return;
    if (isError || !user) {
      if (typeof window !== "undefined") {
        const redirect = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        router.replace(`/login?redirect=${redirect}`);
      } else {
        router.replace("/login");
      }
    }
  }, [isPending, isError, user, router]);

  if (isError || (!isPending && !user)) {
    return <AuthLoading label="Redirecting to sign-in..." />;
  }

  if (isPending) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}
