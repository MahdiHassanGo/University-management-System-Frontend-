"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserCheck, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  createInstructor,
  getAllDepartments,
  getAllInstructors,
} from "@/api/admin.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import UrlPagination from "@/components/common/url-pagination";
import UrlSearch from "@/components/common/url-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { extractDataArray, extractPaginationMeta } from "@/lib/utils";
import type { InstructorProfile } from "@/types";

function InstructorsTableContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || undefined;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "Instructor123!",
    departmentId: "",
    designation: "Assistant Professor",
    contactNo: "",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["instructors", { page, searchTerm }],
    queryFn: () =>
      getAllInstructors({
        page,
        limit: 10,
        searchTerm,
      }),
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getAllDepartments({ isActive: true }),
  });

  const createMutation = useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      toast.add({
        title: "Instructor Created",
        description: "New faculty member registered successfully",
        type: "success",
      });
      setIsCreateOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "Instructor123!",
        departmentId: "",
        designation: "Assistant Professor",
        contactNo: "",
      });
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Could not register faculty member",
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.departmentId) {
      toast.add({
        title: "Validation Error",
        description: "Please fill in all mandatory fields",
        type: "error",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const instructors = extractDataArray<InstructorProfile>(data);
  const meta = extractPaginationMeta(data);
  const departments = extractDataArray(departmentsData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Faculty & Instructors
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage institutional faculty profiles, academic departments, and
            appointments.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button
                size="sm"
                className="gap-2 self-start sm:self-auto shadow-xs"
              >
                <UserPlus className="size-4" />
                <span>Add Faculty Member</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Faculty Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Full Legal Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Dr. Alan Turing"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Faculty Email *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="instructor@university.edu"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Initial Password *
                </label>
                <Input
                  required
                  type="text"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Designation
                  </label>
                  <Input
                    placeholder="e.g. Professor"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Contact Phone
                </label>
                <Input
                  placeholder="+8801700000000"
                  value={formData.contactNo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNo: e.target.value })
                  }
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Save Faculty"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <UrlSearch placeholder="Search faculty by ID, name, or email..." />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load faculty: {(error as any)?.message || "Unknown error"}
        </div>
      ) : instructors.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No instructors found"
          description={
            searchTerm
              ? `No instructor matching "${searchTerm}" was located.`
              : "No faculty members are currently registered."
          }
          action={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              Add First Faculty Member
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Faculty Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {instructors.map((ins: InstructorProfile) => (
                  <tr
                    key={ins.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">
                      {ins.employeeId}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {ins.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">
                      {ins.user?.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {ins.department?.code || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {ins.designation || "Faculty"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 text-[10px] font-semibold">
                        {ins.academicStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className="p-4">
              <UrlPagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                pageSize={meta.limit}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminInstructorsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={5} cols={5} />}>
      <InstructorsTableContent />
    </Suspense>
  );
}
