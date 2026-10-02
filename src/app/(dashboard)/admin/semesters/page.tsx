"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, CheckCheck, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  createSemester,
  deleteSemester,
  getAllSemesters,
  updateSemesterStatus,
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
import type { AcademicSemester, SemesterStatus, SemesterTerm } from "@/types";

export default function AdminSemestersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    term: "FALL" as SemesterTerm,
    registrationStart: new Date().toISOString().split("T")[0],
    registrationEnd: new Date(Date.now() + 14 * 86400000)
      .toISOString()
      .split("T")[0],
    classStart: new Date(Date.now() + 20 * 86400000)
      .toISOString()
      .split("T")[0],
    classEnd: new Date(Date.now() + 120 * 86400000).toISOString().split("T")[0],
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["semesters"],
    queryFn: () => getAllSemesters(),
  });

  const createMutation = useMutation({
    mutationFn: createSemester,
    onSuccess: () => {
      toast.add({
        title: "Semester Scheduled",
        description: `Semester ${formData.term} ${formData.year} created successfully`,
        type: "success",
      });
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Failed",
        description:
          err?.data?.message || err?.message || "Could not schedule semester",
        type: "error",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateSemesterStatus(id, status),
    onSuccess: () => {
      toast.add({
        title: "Status Updated",
        description: "Semester operational status changed",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Transition Error",
        description:
          err?.data?.message ||
          err?.message ||
          "Failed to update semester status",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSemester,
    onSuccess: () => {
      toast.add({
        title: "Semester Deleted",
        description: "Semester removed from academic calendar",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["semesters"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Deletion Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Cannot delete semester with active sections",
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      year: Number(formData.year),
      registrationStart: new Date(formData.registrationStart).toISOString(),
      registrationEnd: new Date(formData.registrationEnd).toISOString(),
      classStart: new Date(formData.classStart).toISOString(),
      classEnd: new Date(formData.classEnd).toISOString(),
    });
  };

  const semesters = extractDataArray<AcademicSemester>(data);

  const getStatusBadge = (status: SemesterStatus) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "ONGOING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "COMPLETED":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Academic Semesters
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure term calendar dates, open registration cycles, and advance
            operational semesters.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2 shadow-xs">
                <Plus className="size-4" />
                <span>Schedule Semester</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Academic Semester</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Academic Year *
                  </label>
                  <Input
                    required
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Semester Term *
                  </label>
                  <select
                    value={formData.term}
                    onChange={(e) =>
                      setFormData({ ...formData, term: e.target.value as any })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
                  >
                    <option value="SPRING">SPRING</option>
                    <option value="SUMMER">SUMMER</option>
                    <option value="FALL">FALL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Registration Start
                  </label>
                  <Input
                    type="date"
                    value={formData.registrationStart}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationStart: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Registration End
                  </label>
                  <Input
                    type="date"
                    value={formData.registrationEnd}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationEnd: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Classes Start
                  </label>
                  <Input
                    type="date"
                    value={formData.classStart}
                    onChange={(e) =>
                      setFormData({ ...formData, classStart: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Classes End
                  </label>
                  <Input
                    type="date"
                    value={formData.classEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, classEnd: e.target.value })
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
                  {createMutation.isPending
                    ? "Scheduling..."
                    : "Schedule Semester"}
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
          Failed to load semesters: {(error as any)?.message || "Unknown error"}
        </div>
      ) : semesters.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No semesters scheduled"
          description="Create your first academic semester to open registration and assign class sections."
          action={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              Schedule First Semester
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Term & Year</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3">Registration Window</th>
                  <th className="px-4 py-3">Instruction Period</th>
                  <th className="px-4 py-3 text-right">Status Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {semesters.map((sem: AcademicSemester) => (
                  <tr
                    key={sem.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {sem.term} {sem.year}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(sem.status)}`}
                      >
                        {sem.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(sem.registrationStart).toLocaleDateString()} –{" "}
                      {new Date(sem.registrationEnd).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(sem.classStart).toLocaleDateString()} –{" "}
                      {new Date(sem.classEnd).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {sem.status === "DRAFT" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              statusMutation.mutate({
                                id: sem.id,
                                status: "REGISTRATION_OPEN",
                              })
                            }
                            className="h-7 text-[11px] gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          >
                            <Play className="size-3" />
                            <span>Open Registration</span>
                          </Button>
                        )}
                        {sem.status === "REGISTRATION_OPEN" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              statusMutation.mutate({
                                id: sem.id,
                                status: "ONGOING",
                              })
                            }
                            className="h-7 text-[11px] gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Play className="size-3" />
                            <span>Start Classes</span>
                          </Button>
                        )}
                        {sem.status === "ONGOING" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              statusMutation.mutate({
                                id: sem.id,
                                status: "COMPLETED",
                              })
                            }
                            className="h-7 text-[11px] gap-1 text-slate-600 border-slate-200 hover:bg-slate-50"
                          >
                            <CheckCheck className="size-3" />
                            <span>Complete Term</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete semester ${sem.term} ${sem.year}?`,
                              )
                            ) {
                              deleteMutation.mutate(sem.id);
                            }
                          }}
                          className="text-destructive hover:bg-destructive/10 size-7 p-0"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
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
