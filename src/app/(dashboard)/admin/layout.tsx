import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RoleGuard roles={["SUPER_ADMIN"]}>
      <DashboardShell role="SUPER_ADMIN">{children}</DashboardShell>
    </RoleGuard>
  );
}
