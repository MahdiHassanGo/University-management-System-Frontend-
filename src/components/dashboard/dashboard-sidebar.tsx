"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/common/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes, instructorRoutes, studentRoutes } from "@/routes";
import type { SidebarItems, UserRole } from "@/types";

const sidebarRouteMap: Record<UserRole, SidebarItems> = {
  SUPER_ADMIN: adminRoutes,
  INSTRUCTOR: instructorRoutes,
  STUDENT: studentRoutes,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const routes: SidebarItems = sidebarRouteMap[role] || [];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-3.5">
        <Logo size="sm" />
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-4">
        {routes.map((group) => (
          <SidebarGroup key={group.title} className="p-0">
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-1">
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (item.url !== "/admin" &&
                      item.url !== "/instructor" &&
                      item.url !== "/student" &&
                      pathname.startsWith(item.url));
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={<Link href={item.url} />}
                        isActive={isActive}
                        className={`gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary hover:text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {Icon && <Icon className="size-4 shrink-0" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
