"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileSpreadsheet, Plus, Save, Trash2, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  bulkMarkExamResults,
  createSectionExam,
  deleteExam,
  getExamResults,
  getInstructorSections,
  getMyInstructorProfile,
  getSectionExams,
  getSectionStudents,
} from "@/api/instructor.api";
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
import { toast } from "@/components/ui/toast";
import type { Exam, Section } from "@/types";

export default function InstructorExamsPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    searchParams.get("sectionId") || "",
  );
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New exam form state
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("MIDTERM");
  const [maxMarks, setMaxMarks] = useState<number>(30);
  const [weightage, setWeightage] = useState<number>(25);
  const [examDate, setExamDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Marks state: { [studentId]: { marks: number; remarks: string } }
  const [marksState, setMarksState] = useState<
    Record<string, { marks: number; remarks: string }>
  >({});

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

  // Section exams
  const { data: examsData, isLoading: loadingExams } = useQuery({
    queryKey: ["section", activeSectionId, "exams"],
    queryFn: () => getSectionExams(activeSectionId),
    enabled: !!activeSectionId,
  });
  const exams: Exam[] = examsData?.data || [];
  const activeExamId = selectedExamId || (exams[0]?.id ?? "");
  const currentExam = exams.find((e) => e.id === activeExamId);

  // Students for the section
  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ["section", activeSectionId, "students"],
    queryFn: () => getSectionStudents(activeSectionId),
    enabled: !!activeSectionId,
  });
  const students = studentsData?.data || [];

  // Existing marks for current exam
  const { data: existingMarksData } = useQuery({
    queryKey: ["exam", activeExamId, "results"],
    queryFn: () => getExamResults(activeExamId),
    enabled: !!activeExamId,
  });

  // Create exam mutation
  const createExamMutation = useMutation({
    mutationFn: () =>
      createSectionExam(activeSectionId, {
        name: examName,
        examType,
        maxMarks: Number(maxMarks),
        weightage: Number(weightage),
        examDate,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["section", activeSectionId, "exams"],
      });
      setIsCreateOpen(false);
      setExamName("");
      if (res?.data?.id) setSelectedExamId(res.data.id);
      toast.add({
        title: "Exam Created",
        description: "Examination registered. You can now enter student marks.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Failed",
        description:
          err?.data?.message || err?.message || "Could not create exam",
        type: "error",
      });
    },
  });

  // Delete exam mutation
  const deleteExamMutation = useMutation({
    mutationFn: (id: string) => deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["section", activeSectionId, "exams"],
      });
      setSelectedExamId("");
      toast.add({
        title: "Exam Deleted",
        description: "The exam assessment has been removed.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Delete Failed",
        description:
          err?.data?.message || err?.message || "Could not delete exam",
        type: "error",
      });
    },
  });

  // Bulk save marks mutation
  const saveMarksMutation = useMutation({
    mutationFn: () => {
      const marksPayload = students.map((enr: any) => {
        const studentId = enr.student?.id || enr.studentId || enr.id;
        const entry = marksState[studentId] || { marks: 0, remarks: "" };
        return {
          studentId,
          obtainedMarks: Number(entry.marks) || 0,
          remarks: entry.remarks || undefined,
        };
      });

      return bulkMarkExamResults(activeExamId, { marks: marksPayload });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exam", activeExamId, "results"],
      });
      toast.add({
        title: "Marks Recorded",
        description:
          "Student examination marks have been committed successfully.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Save Failed",
        description:
          err?.data?.message || err?.message || "Could not record marks",
        type: "error",
      });
    },
  });

  const handleMarkChange = (studentId: string, marks: number) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        marks,
        remarks: prev[studentId]?.remarks || "",
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setMarksState((prev) => ({
      ...prev,
      [studentId]: {
        marks: prev[studentId]?.marks ?? 0,
        remarks,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Examinations & Marks Entry
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure quizzes, midterms, and final assessments with grade
            matrices.
          </p>
        </div>

        {activeSectionId && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger
              render={
                <Button size="sm" className="font-semibold shadow-xs">
                  <Plus className="size-4 mr-1.5" />
                  Create New Assessment
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Section Assessment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Assessment Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Midterm Examination"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Assessment Type
                    </label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                    >
                      <option value="QUIZ">Quiz</option>
                      <option value="ASSIGNMENT">Assignment / Project</option>
                      <option value="MIDTERM">Midterm Exam</option>
                      <option value="FINAL">Final Exam</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Exam Date
                    </label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Max Total Marks
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Weightage (%)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={weightage}
                      onChange={(e) => setWeightage(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                    />
                  </div>
                </div>
                <Button
                  className="w-full mt-2 font-semibold"
                  disabled={createExamMutation.isPending || !examName}
                  onClick={() => createExamMutation.mutate()}
                >
                  {createExamMutation.isPending
                    ? "Creating..."
                    : "Create Assessment"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                setSelectedExamId("");
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
          icon={FileSpreadsheet}
          title="No Teaching Sections"
          description="You do not have any assigned teaching sections to manage exams."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Assessment List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileSpreadsheet className="size-4 text-primary" />
              Assessments ({exams.length})
            </h3>

            {loadingExams ? (
              <div className="space-y-2">
                <div className="h-14 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-14 bg-muted/50 rounded-lg animate-pulse" />
              </div>
            ) : exams.length === 0 ? (
              <div className="rounded-xl border border-dashed p-4 text-center bg-card text-xs text-muted-foreground">
                No exams or quizzes created yet. Click &quot;Create New
                Assessment&quot; to begin.
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {exams.map((ex) => {
                  const isSelected = ex.id === activeExamId;
                  return (
                    <div
                      key={ex.id}
                      className={`w-full p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground font-semibold shadow-xs"
                          : "bg-card border-border text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedExamId(ex.id)}
                        className="text-left flex-1"
                      >
                        <div className="font-bold text-foreground text-sm">
                          {ex.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {ex.examType} • Max: {ex.maxMarks} pts ({ex.weightage}
                          %)
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete assessment ${ex.name}?`)) {
                            deleteExamMutation.mutate(ex.id);
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Marks Entry Matrix */}
          <div className="lg:col-span-3 space-y-4">
            {!activeExamId ? (
              <EmptyState
                icon={FileSpreadsheet}
                title="Select or Create an Assessment"
                description="Select an assessment from the left or create one to input and save student scores."
              />
            ) : (
              <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Marks Entry: {currentExam?.name}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Max: {currentExam?.maxMarks} marks • Weightage:{" "}
                      {currentExam?.weightage}% • Total students:{" "}
                      {students.length}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => saveMarksMutation.mutate()}
                    disabled={
                      saveMarksMutation.isPending || students.length === 0
                    }
                    className="text-xs font-semibold"
                  >
                    <Save className="size-3.5 mr-1" />
                    {saveMarksMutation.isPending
                      ? "Saving..."
                      : "Save All Marks"}
                  </Button>
                </div>

                {loadingStudents ? (
                  <div className="p-4">
                    <TableSkeleton rows={5} cols={4} />
                  </div>
                ) : students.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    <Users className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                    No enrolled students in this section.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/40 border-b text-xs font-semibold text-muted-foreground">
                        <tr>
                          <th className="px-4 py-2.5">Student</th>
                          <th className="px-4 py-2.5">
                            Marks (Max: {currentExam?.maxMarks})
                          </th>
                          <th className="px-4 py-2.5">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {students.map((enr: any) => {
                          const student = enr.student || enr;
                          const studentId = student?.id || enr.id;

                          // Find existing result if available
                          const existingRes = existingMarksData?.data?.find(
                            (r: any) => r.studentId === studentId,
                          );
                          const currentMarks =
                            marksState[studentId]?.marks ??
                            existingRes?.obtainedMarks ??
                            "";
                          const currentRemarks =
                            marksState[studentId]?.remarks ??
                            existingRes?.remarks ??
                            "";

                          return (
                            <tr
                              key={studentId}
                              className="hover:bg-muted/20 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="font-semibold text-foreground text-xs">
                                  {student?.name || "Student"}
                                </div>
                                <div className="font-mono text-[11px] text-muted-foreground">
                                  {student?.studentId || "—"}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={0}
                                    max={currentExam?.maxMarks || 100}
                                    value={currentMarks}
                                    placeholder="0"
                                    onChange={(e) =>
                                      handleMarkChange(
                                        studentId,
                                        Number(e.target.value),
                                      )
                                    }
                                    className="w-24 text-xs font-mono font-bold px-2.5 py-1.5 rounded-md border bg-background"
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    / {currentExam?.maxMarks}
                                  </span>
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  placeholder="Feedback / notes..."
                                  value={currentRemarks}
                                  onChange={(e) =>
                                    handleRemarkChange(
                                      studentId,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-xs px-2.5 py-1.5 rounded-md border bg-background"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
