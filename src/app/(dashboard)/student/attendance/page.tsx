"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck2, CheckCircle, Clock, XCircle } from "lucide-react";
import { getMyAttendance } from "@/api/student.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";

export default function StudentAttendancePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student", "attendance"],
    queryFn: () => getMyAttendance(),
  });

  const attendancePayload = data?.data;
  const summary = attendancePayload?.summary || [];
  const records = attendancePayload?.records || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Attendance Records
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Verified session participation logs and attendance rates across your
          enrolled sections.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load attendance:{" "}
          {(error as any)?.message || "Unknown error"}
        </div>
      ) : summary.length === 0 && records.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="No attendance records found"
          description="Your instructors have not recorded any attendance sessions yet."
        />
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          {summary.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.map((item) => (
                <div
                  key={item.sectionId}
                  className="rounded-xl border bg-card p-4 shadow-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono font-bold text-sm text-foreground">
                        {item.courseCode}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {item.courseTitle}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                        item.attendancePercentage >= 75
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {item.attendancePercentage}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t flex justify-between">
                    <span>Present: {item.presentCount} sessions</span>
                    <span>Total: {item.totalSessions} sessions</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Records Table */}
          {records.length > 0 && (
            <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
              <div className="border-b px-4 py-3 bg-muted/20 font-semibold text-xs text-foreground">
                Session Log History
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Session Date</th>
                      <th className="px-4 py-3">Topic / Class Content</th>
                      <th className="px-4 py-3">Recorded Status</th>
                      <th className="px-4 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {records.map((rec: any) => (
                      <tr
                        key={rec.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-muted-foreground">
                          {rec.session?.sessionDate
                            ? new Date(
                                rec.session.sessionDate,
                              ).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {rec.session?.topic || "Instructional Class Session"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              rec.status === "PRESENT"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : rec.status === "LATE"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            }`}
                          >
                            {rec.status === "PRESENT" && (
                              <CheckCircle className="size-3" />
                            )}
                            {rec.status === "ABSENT" && (
                              <XCircle className="size-3" />
                            )}
                            {rec.status === "LATE" && (
                              <Clock className="size-3" />
                            )}
                            <span>{rec.status}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {rec.remarks || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
