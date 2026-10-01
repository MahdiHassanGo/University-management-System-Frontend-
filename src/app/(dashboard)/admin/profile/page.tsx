"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { KeyRound, Mail, Shield, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { changePassword, getMe } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function AdminProfilePage() {
  const { data: meData, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getMe(),
  });

  const user = meData?.data;

  // Change password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: () => changePassword({ oldPassword, newPassword }),
    onSuccess: () => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.add({
        title: "Password Changed",
        description:
          "Your administrator security credentials have been updated.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to Change Password",
        description:
          err?.data?.message || err?.message || "Invalid current password",
        type: "error",
      });
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.add({
        title: "Passwords Do Not Match",
        description: "New password and confirmation must match exactly.",
        type: "error",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast.add({
        title: "Password Too Short",
        description: "New password must be at least 6 characters.",
        type: "error",
      });
      return;
    }
    changePasswordMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-muted/40 rounded-xl animate-pulse" />
        <div className="h-64 bg-muted/40 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Administrator Security & Profile
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View system authorization credentials and update your security access
          key.
        </p>
      </div>

      {/* Header Profile Card */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-2xl font-extrabold shrink-0">
          SA
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
              {user?.name || "System Administrator"}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              {user?.role || "SUPER_ADMIN"}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" />
              {user?.email || "admin@university.edu"}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Full System Access & Audit Authority
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Overview */}
        <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            Security & Privilege Status
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <div className="font-semibold text-foreground">
                Account Status
              </div>
              <div className="text-muted-foreground">
                Active • High-Privilege Master Account
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <div className="font-semibold text-foreground">
                Authentication Provider
              </div>
              <div className="text-muted-foreground">
                {user?.provider || "CREDENTIALS"} (Argon2 / JWT Standard)
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <div className="font-semibold text-foreground">
                Audit Tracking
              </div>
              <div className="text-muted-foreground">
                All administrative writes are logged to the immutable audit
                trail.
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            Update Access Key
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Current Password
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={changePasswordMutation.isPending}
              className="mt-2 font-semibold"
            >
              <Shield className="size-3.5 mr-1.5" />
              {changePasswordMutation.isPending
                ? "Updating..."
                : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
