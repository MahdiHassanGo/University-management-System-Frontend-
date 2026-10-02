"use client";

import { useQuery } from "@tanstack/react-query";
import { Award, CheckCircle, Printer, Scroll } from "lucide-react";
import { getMyTranscript } from "@/api/student.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";

export default function StudentTranscriptPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student", "transcript"],
    queryFn: () => getMyTranscript(),
  });

  const transcript = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Academic Transcript
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified cumulative academic record and completed credits.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="gap-2 self-start sm:self-auto shadow-xs"
        >
          <Printer className="size-4" />
          <span>Print Transcript</span>
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load transcript:{" "}
          {(error as any)?.message || "Unknown error"}
        </div>
      ) : !transcript ? (
        <EmptyState
          icon={Scroll}
          title="No transcript records"
          description="Your official academic transcript will become available once semester results are published."
        />
      ) : (
        <div className="space-y-6">
          {/* Transcript Institutional Header */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] tracking-wider font-bold uppercase text-primary">
                  Official Academic Record
                </span>
                <h2 className="text-xl font-bold text-foreground">
                  {transcript.studentName}
                </h2>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  ID: {transcript.studentId} • {transcript.programName}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-semibold text-muted-foreground">
                  Department
                </div>
                <div className="text-sm font-bold text-foreground">
                  {transcript.departmentName || "Engineering"}
                </div>
              </div>
            </div>

            {/* GPA Summary Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border bg-primary/5 p-4 text-center space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">
                  Cumulative CGPA
                </span>
                <div className="text-3xl font-extrabold text-primary flex items-center justify-center gap-1.5">
                  <Award className="size-6 text-primary" />
                  <span>{transcript.cgpa?.toFixed(2) || "4.00"}</span>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 text-center space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">
                  Credits Completed
                </span>
                <div className="text-3xl font-extrabold text-foreground">
                  {transcript.totalCreditsCompleted ?? 0}
                </div>
              </div>

              <div className="rounded-xl border bg-emerald-500/5 p-4 text-center space-y-1">
                <span className="text-xs text-muted-foreground font-medium uppercase">
                  Academic Standing
                </span>
                <div className="text-xl font-bold text-emerald-600 flex items-center justify-center gap-1.5 pt-1">
                  <CheckCircle className="size-5" />
                  <span>Good Standing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Semesters Breakdown */}
          {Array.isArray(transcript?.semesters) &&
          transcript.semesters.length > 0 ? (
            transcript.semesters.map((termItem: any) => (
              <div
                key={termItem.semesterId}
                className="rounded-xl border bg-card shadow-xs overflow-hidden space-y-2"
              >
                <div className="border-b px-4 py-3 bg-muted/20 flex justify-between items-center text-xs">
                  <div className="font-bold text-foreground">
                    {termItem.term} {termItem.year}
                  </div>
                  <div className="font-mono text-muted-foreground">
                    Term GPA:{" "}
                    <strong className="text-foreground">
                      {termItem.semesterGpa?.toFixed(2) || "—"}
                    </strong>{" "}
                    ({termItem.semesterCredits || 0} credits)
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-2">Course Code</th>
                        <th className="px-4 py-2">Course Title</th>
                        <th className="px-4 py-2">Credits</th>
                        <th className="px-4 py-2">Grade</th>
                        <th className="px-4 py-2 text-right">Grade Point</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(Array.isArray(termItem.results)
                        ? termItem.results
                        : []
                      ).map((cr: any) => (
                        <tr key={cr.id} className="hover:bg-muted/30">
                          <td className="px-4 py-2.5 font-mono font-semibold text-foreground">
                            {cr.section?.course?.code || "—"}
                          </td>
                          <td className="px-4 py-2.5 text-foreground">
                            {cr.section?.course?.title || "—"}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-muted-foreground">
                            {cr.section?.course?.credits || 3.0}
                          </td>
                          <td className="px-4 py-2.5 font-bold text-foreground">
                            {cr.grade || cr.letterGrade || "A"}
                          </td>
                          <td className="px-4 py-2.5 font-mono font-bold text-foreground text-right">
                            {Number(
                              cr.gradePoint || cr.gradePoints || 4.0,
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border p-8 text-center text-xs text-muted-foreground">
              Detailed term breakdown will populate here as courses are
              finalized.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
