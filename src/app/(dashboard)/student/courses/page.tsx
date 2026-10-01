"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Layers } from "lucide-react";
import Link from "next/link";
import { dropCourse, getMyEnrollments } from "@/api/student.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { Enrollment } from "@/types";

export default function StudentCoursesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student", "enrollments"],
    queryFn: () => getMyEnrollments(),
  });

  const dropMutation = useMutation({
    mutationFn: dropCourse,
    onSuccess: () => {
      toast.add({
        title: "Course Dropped",
        description: "Your course enrollment has been dropped.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["student", "enrollments"] });
      queryClient.invalidateQueries({
        queryKey: ["student", "available-sections"],
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Drop Request Failed",
        description:
          err?.data?.message || err?.message || "Could not drop course",
        type: "error",
      });
    },
  });

  const enrollments = data?.data || [];
  const activeEnrollments = enrollments.filter((e) => e.status === "ENROLLED");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Enrolled Classes
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active courses, instructor contacts, and routine schedules for the
            current semester.
          </p>
        </div>

        <Link href="/student/registration">
          <Button size="sm" variant="outline">
            Register More Courses
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load enrollments:{" "}
          {(error as any)?.message || "Unknown error"}
        </div>
      ) : activeEnrollments.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No active class enrollments"
          description="You are not currently enrolled in any course sections for this semester."
          action={
            <Link href="/student/registration">
              <Button size="sm">Go to Course Registration</Button>
            </Link>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Course Code</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Section #</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeEnrollments.map((enr: Enrollment) => (
                  <tr
                    key={enr.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {enr.section?.course?.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {enr.section?.course?.title}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {enr.section?.course?.credits} cr
                    </td>
                    <td className="px-4 py-3 font-mono">
                      Sec {enr.section?.sectionNumber}
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      {enr.section?.instructor?.name || "Faculty Member"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {enr.section?.roomNumber || "TBD"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={dropMutation.isPending}
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to drop ${enr.section?.course?.code} (Section ${enr.section?.sectionNumber})?`,
                            )
                          ) {
                            dropMutation.mutate(enr.id);
                          }
                        }}
                        className="text-destructive hover:bg-destructive/10 text-xs h-7 gap-1"
                      >
                        <AlertTriangle className="size-3" />
                        <span>Drop</span>
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
