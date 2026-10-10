"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMe } from "@/api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

interface DemoAccount {
  label: string;
  roleTag: string;
  role: "SUPER_ADMIN" | "INSTRUCTOR" | "STUDENT";
  email: string;
  description: string;
  icon: typeof ShieldCheck;
  colorScheme: {
    iconBg: string;
    iconColor: string;
    badge: string;
    btn: string;
    border: string;
    bg: string;
  };
  targetDashboard: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Admin",
    roleTag: "Super Admin",
    role: "SUPER_ADMIN",
    email: "admin@university.edu",
    description: "Full system administration, users, invoices & audit logs",
    icon: ShieldCheck,
    colorScheme: {
      iconBg: "bg-purple-100 dark:bg-purple-950/60",
      iconColor: "text-purple-600 dark:text-purple-400",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
      btn: "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-500 shadow-purple-600/20",
      border: "hover:border-purple-500/40 border-border/70",
      bg: "hover:bg-purple-500/[0.03]",
    },
    targetDashboard: "/admin",
  },
  {
    label: "Provider",
    roleTag: "Faculty / Instructor",
    role: "INSTRUCTOR",
    email: "instructor@university.edu",
    description: "Course sections, student attendance, exams & grade entry",
    icon: BookOpen,
    colorScheme: {
      iconBg: "bg-blue-100 dark:bg-blue-950/60",
      iconColor: "text-blue-600 dark:text-blue-400",
      badge:
        "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
      btn: "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-600/20",
      border: "hover:border-blue-500/40 border-border/70",
      bg: "hover:bg-blue-500/[0.03]",
    },
    targetDashboard: "/instructor",
  },
  {
    label: "User",
    roleTag: "Student Scholar",
    role: "STUDENT",
    email: "student@university.edu",
    description: "Self-enrollment, fee payments, semester schedule & CGPA",
    icon: GraduationCap,
    colorScheme: {
      iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      badge:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
      btn: "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-600/20",
      border: "hover:border-emerald-500/40 border-border/70",
      bg: "hover:bg-emerald-500/[0.03]",
    },
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

      // Fetch authoritative profile
      const meRes = await queryClient.fetchQuery({
        queryKey: ["user"],
        queryFn: getMe,
      });

      const user = meRes?.data?.user || meRes?.data;
      const detectedRole = user?.role || acc.role;

      toast.add({
        title: `Welcome, ${acc.label}`,
        description: `Logged in as ${acc.roleTag}. Redirecting to workspace...`,
        type: "success",
      });

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
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-muted/40 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-tight text-foreground uppercase">
              One-Click Role Login
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Select any role below for instant demo authentication
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Instant Access
        </span>
      </div>

      <div className="space-y-2.5">
        {DEMO_ACCOUNTS.map((acc) => {
          const Icon = acc.icon;
          const isLoading = activeRole === acc.role;

          return (
            <div
              key={acc.role}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-2xs transition-all duration-200 ${acc.colorScheme.border} ${acc.colorScheme.bg}`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${acc.colorScheme.iconBg} ${acc.colorScheme.iconColor}`}
                >
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-foreground">
                      {acc.label}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${acc.colorScheme.badge}`}
                    >
                      {acc.roleTag}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {acc.description}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                disabled={!!activeRole}
                onClick={() => handleDemoLogin(acc)}
                className={`w-full sm:w-auto shrink-0 h-8 px-3.5 text-xs font-semibold shadow-xs transition-all ${acc.colorScheme.btn}`}
              >
                {isLoading ? (
                  <>
                    <Spinner className="size-3.5 mr-1.5" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Demo Login
                    <ArrowRight className="size-3.5 ml-1" />
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
