import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function InstructorDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["INSTRUCTOR", "SUPER_ADMIN"]}>
      <DashboardShell role="INSTRUCTOR">{children}</DashboardShell>
    </RoleGuard>
  );
}
