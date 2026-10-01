"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, KeyRound, Mail, Save, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { changePassword } from "@/api/auth.api";
import {
  getMyInstructorProfile,
  updateMyInstructorProfile,
} from "@/api/instructor.api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function InstructorProfilePage() {
  const queryClient = useQueryClient();
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["instructor", "profile"],
    queryFn: () => getMyInstructorProfile(),
  });

  const profile = profileData?.data;

  // Edit profile state
  const [designation, setDesignation] = useState("");
  const [contactNo, setContactNo] = useState("");

  // Change password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setDesignation(profile.designation || "");
      setContactNo(profile.contactNo || "");
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      updateMyInstructorProfile({
        designation: designation || undefined,
        contactNo: contactNo || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor", "profile"] });
      toast.add({
        title: "Profile Updated",
        description: "Your faculty information has been successfully saved.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Update Failed",
        description:
          err?.data?.message || err?.message || "Could not update profile",
        type: "error",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => changePassword({ oldPassword, newPassword }),
    onSuccess: () => {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.add({
        title: "Password Changed",
        description: "Your security credentials have been updated.",
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
          Faculty Profile & Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your faculty member identity, contact information, and
          security.
        </p>
      </div>

      {/* Header Profile Card */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-2xl font-extrabold shrink-0">
          {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "FC"}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
              {profile?.name || "Faculty Member"}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              {profile?.academicStatus || "ACTIVE"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Employee ID: {profile?.employeeId || "—"}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5 text-primary" />
              {profile?.department?.name || "Department"}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" />
              {profile?.user?.email || "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Academic Details */}
        <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <User className="size-4 text-primary" />
            Contact & Designation
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Academic Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Associate Professor"
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Contact Number
              </label>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="+880 1XXXXXXXXX"
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">
                Registered University Email
              </label>
              <input
                type="text"
                disabled
                value={profile?.user?.email || ""}
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-muted/50 text-muted-foreground cursor-not-allowed"
              />
            </div>

            <Button
              size="sm"
              onClick={() => updateProfileMutation.mutate()}
              disabled={updateProfileMutation.isPending}
              className="mt-2 font-semibold"
            >
              <Save className="size-3.5 mr-1.5" />
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            Security & Password
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
