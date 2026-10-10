"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, GraduationCap, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMe } from "@/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

interface DemoAccount {
  label: string;
  role: "SUPER_ADMIN" | "INSTRUCTOR" | "STUDENT";
  icon: typeof Shield;
  badgeClass: string;
  targetDashboard: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Super Admin",
    role: "SUPER_ADMIN",
    icon: Shield,
    badgeClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
    targetDashboard: "/admin",
  },
  {
    label: "Instructor",
    role: "INSTRUCTOR",
    icon: BookOpen,
    badgeClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
    targetDashboard: "/instructor",
  },
  {
    label: "Student",
    role: "STUDENT",
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
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: acc.role }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!response.ok || !result.success)
        throw new Error(result.message || "Demo sign-in failed.");
      queryClient.clear();

      // 3. Fetch authoritative profile
      const meRes = await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: getMe,
      });

      const user = meRes?.data?.user || meRes?.data;
      const detectedRole = user?.role || acc.role;

      toast.add({
        title: `Welcome, ${acc.label}`,
        description: "Your demo workspace is ready.",
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
    } catch (err: unknown) {
      toast.add({
        title: `Demo Login Failed`,
        description: getErrorMessage(err) || "Failed to authenticate demo user",
        type: "error",
      });
    } finally {
      setActiveRole(null);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
        Explore a workspace
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
              className="h-auto py-2.5 px-3 flex flex-col items-center justify-center gap-1.5 hover:border-primary hover:bg-primary/5 transition-all text-xs"
            >
              {isLoading ? (
                <Spinner className="size-4 text-primary" />
              ) : (
                <Icon className="size-4 text-primary shrink-0" />
              )}
              <span className="font-semibold text-foreground">{acc.label}</span>
              <span className="text-[10px] text-muted-foreground font-mono truncate max-w-full">
                Demo login
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
