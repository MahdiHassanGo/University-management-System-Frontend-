import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["STUDENT", "SUPER_ADMIN"]}>
      <DashboardShell role="STUDENT">{children}</DashboardShell>
    </RoleGuard>
  );
}
