"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Award,
  Calculator,
  CheckCircle,
  FileCheck2,
  Send,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  calculateSectionResults,
  getInstructorSections,
  getMyInstructorProfile,
  getSectionStudents,
  publishSectionResults,
} from "@/api/instructor.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import type { Section } from "@/types";

export default function InstructorResultsPage() {
  const searchParams = useSearchParams();
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    searchParams.get("sectionId") || "",
  );
  const [calculatedResults, setCalculatedResults] = useState<any[] | null>(
    null,
  );
  const [isConfirmPublishOpen, setIsConfirmPublishOpen] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ["instructor", "profile"],
    queryFn: () => getMyInstructorProfile(),
  });
  const profile = profileData?.data;

  const { data: sectionsData } = useQuery({
    queryKey: ["instructor", "sections", profile?.id],
    queryFn: () => getInstructorSections(profile?.id),
    enabled: !!profile?.id,
  });
  const sections: Section[] = sectionsData?.data || [];
  const activeSectionId = selectedSectionId || (sections[0]?.id ?? "");
  const currentSection = sections.find((s) => s.id === activeSectionId);

  // Enrolled students for roster preview
  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ["section", activeSectionId, "students"],
    queryFn: () => getSectionStudents(activeSectionId),
    enabled: !!activeSectionId,
  });
  const students = studentsData?.data || [];

  // Calculate results mutation
  const calculateMutation = useMutation({
    mutationFn: () => calculateSectionResults(activeSectionId),
    onSuccess: (res) => {
      setCalculatedResults(res?.data || []);
      toast.add({
        title: "Calculation Complete",
        description:
          "Course results and GPA points computed from all exam assessments.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Calculation Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Ensure exams and marks are recorded for this section first.",
        type: "error",
      });
    },
  });

  // Publish results mutation
  const publishMutation = useMutation({
    mutationFn: () => publishSectionResults(activeSectionId),
    onSuccess: () => {
      setIsConfirmPublishOpen(false);
      toast.add({
        title: "Results Published!",
        description:
          "Final grades are now official and visible to students on their transcripts.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Publishing Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Could not publish section results.",
        type: "error",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Grade Calculation & Publishing
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compute final letter grades and GPA from exam marks, review
            distributions, and publish.
          </p>
        </div>

        {activeSectionId && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateMutation.mutate()}
              disabled={calculateMutation.isPending}
              className="text-xs font-semibold"
            >
              <Calculator className="size-3.5 mr-1.5" />
              {calculateMutation.isPending
                ? "Calculating..."
                : "Calculate Final Grades"}
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setIsConfirmPublishOpen(true)}
              disabled={publishMutation.isPending || !calculatedResults}
              className="text-xs font-semibold"
            >
              <Send className="size-3.5 mr-1.5" />
              Publish Grades
            </Button>
          </div>
        )}
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map((sec) => {
          const isSelected = sec.id === activeSectionId;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setSelectedSectionId(sec.id);
                setCalculatedResults(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground hover:text-foreground border-border"
              }`}
            >
              {sec.course?.code} — Sec {sec.sectionNumber}
            </button>
          );
        })}
      </div>

      {!activeSectionId ? (
        <EmptyState
          icon={Award}
          title="No Teaching Sections"
          description="You do not have any assigned teaching sections to publish results."
        />
      ) : (
        <div className="space-y-6">
          {/* Workflow Guide Card */}
          <div className="rounded-xl border bg-card p-5 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileCheck2 className="size-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Grading Workflow for {currentSection?.course?.code} (Section{" "}
                  {currentSection?.sectionNumber})
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  1. Verify all assessment marks (quizzes, assignments,
                  midterms, finals) are recorded in the Exams portal.
                  <br />
                  2. Click &quot;Calculate Final Grades&quot; to compute
                  weighted scores and letter grades.
                  <br />
                  3. Verify the computed grade table below, then click
                  &quot;Publish Grades&quot; to finalize student transcripts.
                </p>
              </div>
            </div>
          </div>

          {/* Student Roster / Computed Results Table */}
          <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Section Student Gradebook ({students.length} students)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {calculatedResults
                    ? `Showing ${calculatedResults.length} calculated grades`
                    : "Grades not calculated yet. Click 'Calculate Final Grades' above."}
                </p>
              </div>
              {calculatedResults && (
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="size-3.5" />
                  Ready to Publish
                </span>
              )}
            </div>

            {loadingStudents ? (
              <div className="p-4">
                <TableSkeleton rows={5} cols={5} />
              </div>
            ) : students.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No enrolled students found in this section.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 border-b text-xs uppercase font-medium text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Student ID</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Total Weighted Score</th>
                      <th className="px-4 py-3">Letter Grade</th>
                      <th className="px-4 py-3">Grade Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {students.map((enr: any, idx: number) => {
                      const student = enr.student || enr;
                      const studentId = student?.id || enr.studentId || enr.id;

                      const computed = calculatedResults?.find(
                        (r: any) =>
                          r.studentId === studentId ||
                          r.enrollmentId === enr.id ||
                          r.enrollment?.studentId === studentId,
                      );

                      return (
                        <tr
                          key={studentId || idx}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 font-mono font-bold text-primary">
                            {student?.studentId || "—"}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {student?.name || "Student"}
                          </td>
                          <td className="px-4 py-3 font-mono text-sm">
                            {computed?.totalMarks !== undefined
                              ? `${Number(computed.totalMarks).toFixed(1)} / 100`
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {computed?.letterGrade || computed?.grade ? (
                              <span className="font-mono font-extrabold text-sm px-2 py-0.5 rounded bg-primary/10 text-primary">
                                {computed.letterGrade || computed.grade}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold text-foreground">
                            {computed?.gradePoint !== undefined ||
                            computed?.gradePoints !== undefined
                              ? Number(
                                  computed.gradePoint ?? computed.gradePoints,
                                ).toFixed(2)
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog before Publishing */}
      <Dialog
        open={isConfirmPublishOpen}
        onOpenChange={setIsConfirmPublishOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="size-5" />
              Publish Final Grades?
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Publishing will lock the results for this section and make them
              immediately available to students in their academic portal and
              cumulative transcripts. This action is officially recorded.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmPublishOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={publishMutation.isPending}
              onClick={() => publishMutation.mutate()}
            >
              {publishMutation.isPending
                ? "Publishing..."
                : "Confirm & Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
