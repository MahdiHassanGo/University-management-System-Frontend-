"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BookOpen,
  GraduationCap,
  LogOut,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import apiClient from "@/lib/apiClient";
import type { ApiResponse, AppNotification, UserRole } from "@/types";

export default function DashboardHeader({ role }: { role: UserRole }) {
  const { data: userData } = useGetMe();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const queryClient = useQueryClient();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const profile = userData?.data;
  const user = profile?.user || profile;
  const displayName = profile?.name || user?.email?.split("@")[0] || "User";

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiClient<ApiResponse<AppNotification[]>>("/notifications"),
    staleTime: 30000,
  });

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Optimistic Mark-as-read mutation (Meets Day 4 item 3 requirement)
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient<ApiResponse<AppNotification>>(`/notifications/${id}/read`, {
        method: "PATCH",
      }),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previousNotifications = queryClient.getQueryData<
        ApiResponse<AppNotification[]>
      >(["notifications"]);

      if (previousNotifications) {
        queryClient.setQueryData<ApiResponse<AppNotification[]>>(
          ["notifications"],
          {
            ...previousNotifications,
            data: previousNotifications.data.map((item) =>
              item.id === id ? { ...item, isRead: true } : item,
            ),
          },
        );
      }
      return { previousNotifications };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications,
        );
      }
      toast.add({
        title: "Update Failed",
        description: "Could not mark notification as read",
        type: "error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Logged out",
          description: "Session closed successfully",
          type: "success",
        });
      },
    });
  };

  const roleMeta = {
    SUPER_ADMIN: {
      label: "Super Admin",
      badgeClass:
        "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300",
      icon: Shield,
    },
    INSTRUCTOR: {
      label: "Faculty",
      badgeClass:
        "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
      icon: BookOpen,
    },
    STUDENT: {
      label: "Student",
      badgeClass:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
      icon: GraduationCap,
    },
  };

  const currentRoleMeta = roleMeta[role] || roleMeta.STUDENT;
  const RoleIcon = currentRoleMeta.icon;

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-md transition-all sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">University ERP</span>
          <span className="text-muted-foreground">/</span>
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium ${currentRoleMeta.badgeClass}`}
          >
            <RoleIcon className="size-3" />
            <span>{currentRoleMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="relative size-9 p-0 text-muted-foreground hover:text-foreground"
                aria-label="View notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                  </span>
                )}
              </Button>
            }
          />
          <PopoverContent align="end" className="w-80 sm:w-96 p-0 shadow-lg">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <div className="font-semibold text-sm">Notifications</div>
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No notifications found
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 transition-colors flex flex-col gap-1 ${
                      n.isRead ? "bg-card opacity-70" : "bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <button
                          type="button"
                          onClick={() => markAsReadMutation.mutate(n.id)}
                          className="text-[10px] text-primary hover:underline font-medium"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/75 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 rounded-full border bg-muted/40 py-1 pl-2.5 pr-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <UserIcon className="size-3.5 text-muted-foreground" />
            <span className="max-w-[120px] truncate sm:max-w-[180px]">
              {displayName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="size-7 rounded-full p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Sign Out"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
