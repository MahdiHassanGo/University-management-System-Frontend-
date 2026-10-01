"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, GraduationCap, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMe, userLogin } from "@/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { setAccessToken } from "@/lib/auth-token";

interface DemoAccount {
  label: string;
  role: "SUPER_ADMIN" | "INSTRUCTOR" | "STUDENT";
  email: string;
  pass: string;
  icon: typeof Shield;
  badgeClass: string;
  targetDashboard: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Super Admin",
    role: "SUPER_ADMIN",
    email: "admin@university.edu",
    pass: "Admin123!",
    icon: Shield,
    badgeClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
    targetDashboard: "/admin",
  },
  {
    label: "Instructor",
    role: "INSTRUCTOR",
    email: "instructor@university.edu",
    pass: "Instructor123!",
    icon: BookOpen,
    badgeClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    targetDashboard: "/instructor",
  },
  {
    label: "Student",
    role: "STUDENT",
    email: "student@university.edu",
    pass: "Student123!",
    icon: GraduationCap,
    badgeClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
    targetDashboard: "/student",
  },
];

export default function DemoLoginButtons() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const handleDemoLogin = async (acc: DemoAccount) => {
    setActiveRole(acc.role);

    try {
      // 1. Authenticate against real backend
      const loginRes = await userLogin({
        email: acc.email,
        password: acc.pass,
      });

      if (!loginRes?.data?.accessToken) {
        throw new Error("Missing access token in login response");
      }

      // 2. Establish session (sets cookie & localStorage)
      setAccessToken(loginRes.data.accessToken);

      // 3. Fetch authoritative profile
      const meRes = await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: getMe,
      });

      const user = meRes?.data?.user || meRes?.data;
      const detectedRole = user?.role || acc.role;

      toast.add({
        title: `Welcome, ${acc.label}`,
        description: `Authenticated successfully as ${acc.email}`,
        type: "success",
      });

      // 4. Role-based redirect
      const destination =
        detectedRole === "SUPER_ADMIN"
          ? "/admin"
          : detectedRole === "INSTRUCTOR"
            ? "/instructor"
            : "/student";

      router.push(destination);
    } catch (err: any) {
      toast.add({
        title: `Demo Login Failed`,
        description:
          err?.data?.message ||
          err?.message ||
          "Failed to authenticate demo user",
        type: "error",
      });
    } finally {
      setActiveRole(null);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
        1-Click Institutional Demo Login
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((acc) => {
          const Icon = acc.icon;
          const isLoading = activeRole === acc.role;

          return (
            <Button
              key={acc.role}
              type="button"
              variant="outline"
              disabled={!!activeRole}
              onClick={() => handleDemoLogin(acc)}
              className="h-auto py-2.5 px-3 flex flex-col items-center justify-center gap-1.5 border-dashed hover:border-primary hover:bg-primary/5 transition-all text-xs"
            >
              {isLoading ? (
                <Spinner className="size-4 text-primary" />
              ) : (
                <Icon className="size-4 text-primary shrink-0" />
              )}
              <span className="font-semibold text-foreground">{acc.label}</span>
              <span className="text-[10px] text-muted-foreground font-mono truncate max-w-full">
                {acc.email.split("@")[0]}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
