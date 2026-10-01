"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import { getAllEnrollments } from "@/api/admin.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import type { Enrollment } from "@/types";

export default function AdminEnrollmentsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["enrollments"],
    queryFn: () => getAllEnrollments(),
  });

  const enrollments = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Student Course Enrollments
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Campus-wide registration records, active course rosters, and drop
          histories.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load enrollments:{" "}
          {(error as any)?.message || "Unknown error"}
        </div>
      ) : enrollments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No enrollments recorded"
          description="When students register into open course sections, their enrollments will populate here."
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Section #</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enrollments.map((enr: Enrollment) => (
                  <tr
                    key={enr.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">
                      {enr.student?.studentId || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {enr.student?.name || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {enr.section?.course?.code} — {enr.section?.course?.title}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      Sec {enr.section?.sectionNumber}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          enr.status === "ENROLLED"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : enr.status === "DROPPED"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {enr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(enr.enrolledAt).toLocaleDateString()}
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
