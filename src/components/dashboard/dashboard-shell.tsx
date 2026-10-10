import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import DashboardHeader from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <DashboardSidebar role={role} />
        <SidebarInset className="flex flex-1 flex-col overflow-x-hidden">
          <DashboardHeader role={role} />
          <main
            id="main-content"
            className="dashboard-main flex-1 bg-background p-4 sm:p-7 lg:p-10"
          >
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
