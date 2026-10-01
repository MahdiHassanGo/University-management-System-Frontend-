"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getAllDepartments,
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
import type { Course } from "@/types";

function CoursesTableContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || undefined;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    credits: 3.0,
    departmentId: "",
    isElective: false,
    description: "",
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courses", { page, searchTerm }],
    queryFn: () =>
      getAllCourses({
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
    mutationFn: createCourse,
    onSuccess: () => {
      toast.add({
        title: "Course Added",
        description: `Course "${formData.title}" added to catalog`,
        type: "success",
      });
      setIsCreateOpen(false);
      setFormData({
        code: "",
        title: "",
        credits: 3.0,
        departmentId: "",
        isElective: false,
        description: "",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Failed",
        description:
          err?.data?.message || err?.message || "Could not add course",
        type: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.add({
        title: "Course Deleted",
        description: "Course removed from catalog",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Deletion Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Cannot delete course with active sections",
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.title || !formData.departmentId) return;
    createMutation.mutate({
      ...formData,
      code: formData.code.toUpperCase(),
      credits: Number(formData.credits),
    });
  };

  const courses = data?.data || [];
  const meta = data?.meta;
  const departments = departmentsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Course Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage instructional courses, syllabus details, and departmental
            credits.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2 shadow-xs">
                <Plus className="size-4" />
                <span>Add Course</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Course to Catalog</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Course Code *
                </label>
                <Input
                  required
                  placeholder="e.g. CSE101, MAT120, PHY101"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Course Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Introduction to Computer Science"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
                    <option value="">Select Dept</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Credit Units
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Description / Syllabus Summary
                </label>
                <Input
                  placeholder="Core foundational curriculum topics..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                  {createMutation.isPending ? "Saving..." : "Create Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <UrlSearch placeholder="Search courses by code or title..." />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load courses: {(error as any)?.message || "Unknown error"}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={
            searchTerm
              ? `No course matching "${searchTerm}" was located.`
              : "No courses are configured in the catalog yet."
          }
          action={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              Add First Course
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Course Code</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Elective?</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courses.map((c: Course) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {c.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.title}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {c.credits} cr
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.department?.code || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-muted-foreground">
                        {c.isElective ? "Elective" : "Required Core"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Delete course ${c.code}?`)) {
                            deleteMutation.mutate(c.id);
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

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={5} cols={5} />}>
      <CoursesTableContent />
    </Suspense>
  );
}
