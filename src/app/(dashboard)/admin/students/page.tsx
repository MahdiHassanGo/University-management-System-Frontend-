"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  createStudent,
  getAllPrograms,
  getAllSemesters,
  getAllStudents,
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
import type { StudentProfile } from "@/types";

function StudentsTableContent() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const searchTerm = searchParams.get("searchTerm") || undefined;
  const academicStatus = searchParams.get("academicStatus") || undefined;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "Student123!",
    programId: "",
    admissionSemesterId: "",
    gender: "MALE",
    contactNo: "",
  });

  // Query Students
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["students", { page, searchTerm, academicStatus }],
    queryFn: () =>
      getAllStudents({
        page,
        limit: 10,
        searchTerm,
        academicStatus,
      }),
  });

  // Query Programs for Form
  const { data: programsData } = useQuery({
    queryKey: ["programs"],
    queryFn: () => getAllPrograms({ isActive: true }),
  });

  // Query Semesters for Form
  const { data: semestersData } = useQuery({
    queryKey: ["semesters"],
    queryFn: () => getAllSemesters(),
  });

  // Mutation to Create Student
  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      toast.add({
        title: "Student Created",
        description: "New student profile registered successfully",
        type: "success",
      });
      setIsCreateOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "Student123!",
        programId: "",
        admissionSemesterId: "",
        gender: "MALE",
        contactNo: "",
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Failed",
        description:
          err?.data?.message || err?.message || "Could not create student",
        type: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.programId ||
      !formData.admissionSemesterId
    ) {
      toast.add({
        title: "Validation Error",
        description: "Please fill in all mandatory fields",
        type: "error",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const students = extractDataArray<StudentProfile>(data);
  const meta = extractPaginationMeta(data);
  const programs = extractDataArray(programsData);
  const semesters = extractDataArray(semestersData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Student Administration
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage academic profiles, enrollment status, and degree programs.
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
                <span>Register Student</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Student Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Full Legal Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Academic Email *
                </label>
                <Input
                  required
                  type="email"
                  placeholder="student@university.edu"
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
                    Degree Program *
                  </label>
                  <select
                    required
                    value={formData.programId}
                    onChange={(e) =>
                      setFormData({ ...formData, programId: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
                  >
                    <option value="">Select Program</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Admission Term *
                  </label>
                  <select
                    required
                    value={formData.admissionSemesterId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admissionSemesterId: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.term} {s.year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    Contact Number
                  </label>
                  <Input
                    placeholder="+8801700000000"
                    value={formData.contactNo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNo: e.target.value })
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
                  {createMutation.isPending ? "Creating..." : "Save Student"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <UrlSearch placeholder="Search by student ID, name, or email..." />
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load students: {(error as any)?.message || "Unknown error"}
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description={
            searchTerm
              ? `No student matching "${searchTerm}" was located.`
              : "No students are currently registered in the database."
          }
          action={
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              Register First Student
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Program</th>
                  <th className="px-4 py-3">Academic Status</th>
                  <th className="px-4 py-3">Admission Term</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((stu: StudentProfile) => (
                  <tr
                    key={stu.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">
                      {stu.studentId}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {stu.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">
                      {stu.user?.email || "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {stu.program?.code || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          stu.academicStatus === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {stu.academicStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {stu.admissionSemester
                        ? `${stu.admissionSemester.term} ${stu.admissionSemester.year}`
                        : "—"}
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

export default function AdminStudentsPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={5} cols={5} />}>
      <StudentsTableContent />
    </Suspense>
  );
}
