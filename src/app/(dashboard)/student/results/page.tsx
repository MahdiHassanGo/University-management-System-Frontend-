"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, FileCheck2 } from "lucide-react";
import { getMyResults } from "@/api/student.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";

export default function StudentResultsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student", "results"],
    queryFn: () => getMyResults(),
  });

  const results = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Grades & Examination Results
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Official semester evaluations, weighted exam scores, and course grade
          points published by faculty.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load results: {(error as any)?.message || "Unknown error"}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No published results found"
          description="Your semester examination evaluations have not been finalized or published by faculty yet."
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
                  <th className="px-4 py-3">Letter Grade</th>
                  <th className="px-4 py-3">Grade Point</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {results.map((res: any) => (
                  <tr
                    key={res.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {res.enrollment?.section?.course?.code ||
                        res.section?.course?.code ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {res.enrollment?.section?.course?.title ||
                        res.section?.course?.title ||
                        "Course"}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {res.enrollment?.section?.course?.credits || 3.0} cr
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-extrabold text-sm text-foreground inline-flex items-center gap-1">
                        <Award className="size-3.5 text-primary" />
                        <span>{res.letterGrade || res.grade || "A"}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {Number(res.gradePoint || res.gradePoints || 4.0).toFixed(
                        2,
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-semibold">
                        {res.publicationStatus || "PUBLISHED"}
                      </span>
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
