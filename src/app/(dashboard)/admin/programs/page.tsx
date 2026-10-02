"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  createProgram,
  deleteProgram,
  getAllDepartments,
  getAllPrograms,
} from "@/api/admin.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
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
import { extractDataArray } from "@/lib/utils";
import type { Program } from "@/types";

export default function AdminProgramsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    departmentId: "",
    degreeType: "BACHELORS",
    totalCredits: 140,
    maxSemesterCredits: 21,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["programs"],
    queryFn: () => getAllPrograms(),
  });

  const { data: departmentsData } = useQuery({
    queryKey: ["departments"],
    queryFn: () => getAllDepartments({ isActive: true }),
  });

  const createMutation = useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      toast.add({
        title: "Program Created",
        description: `Program "${formData.name}" added successfully`,
        type: "success",
      });
      setIsCreateOpen(false);
      setFormData({
        code: "",
        name: "",
        departmentId: "",
        degreeType: "BACHELORS",
        totalCredits: 140,
        maxSemesterCredits: 21,
      });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Failed",
        description:
          err?.data?.message || err?.message || "Could not create program",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      toast.add({
        title: "Program Deleted",
        description: "Program removed from catalog",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Deletion Failed",
        description:
          err?.data?.message || err?.message || "Cannot delete program",
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name || !formData.departmentId) return;
    createMutation.mutate({
      ...formData,
      code: formData.code.toUpperCase(),
      totalCredits: Number(formData.totalCredits),
      maxSemesterCredits: Number(formData.maxSemesterCredits),
    });
  };

  const programs = extractDataArray<Program>(data);
  const departments = extractDataArray(departmentsData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Academic Degree Programs
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure degree structures, credit requirements, and departmental
            curricula.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2 shadow-xs">
                <Plus className="size-4" />
                <span>Add Degree Program</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Degree Program</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Program Code *
                </label>
                <Input
                  required
                  placeholder="e.g. BSCSE, BBA, MSCSE"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Program Title *
                </label>
                <Input
                  required
                  placeholder="e.g. B.Sc. in Computer Science & Engineering"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                    Degree Type
                  </label>
                  <select
                    value={formData.degreeType}
                    onChange={(e) =>
                      setFormData({ ...formData, degreeType: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
                  >
                    <option value="BACHELORS">Bachelors</option>
                    <option value="MASTERS">Masters</option>
                    <option value="DOCTORATE">Doctorate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Total Required Credits
                  </label>
                  <Input
                    type="number"
                    value={formData.totalCredits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalCredits: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Max Term Credits
                  </label>
                  <Input
                    type="number"
                    value={formData.maxSemesterCredits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxSemesterCredits: Number(e.target.value),
                      })
                    }
                  />
                </div>
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
                  {createMutation.isPending ? "Saving..." : "Create Program"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load programs: {(error as any)?.message || "Unknown error"}
        </div>
      ) : programs.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No degree programs found"
          description="Create degree programs to associate courses and enroll students."
          action={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              Create Degree Program
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Program Title</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Degree Level</th>
                  <th className="px-4 py-3">Credits Required</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {programs.map((prog: Program) => (
                  <tr
                    key={prog.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {prog.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {prog.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {prog.department?.code || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-primary text-[10px]">
                        {prog.degreeType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {prog.totalCredits} Credits (Max {prog.maxSemesterCredits}
                      /term)
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Delete program ${prog.code}?`)) {
                            deleteMutation.mutate(prog.id);
                          }
                        }}
                        className="text-destructive hover:bg-destructive/10 size-8 p-0"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
