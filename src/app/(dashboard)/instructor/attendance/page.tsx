"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Plus,
  Save,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  bulkMarkAttendance,
  createAttendanceSession,
  getInstructorSections,
  getMyInstructorProfile,
  getSectionAttendance,
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
import type { AttendanceSession, Section } from "@/types";

type AttendanceStatusType = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export default function InstructorAttendancePage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    searchParams.get("sectionId") || "",
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state for new session
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:30");
  const [topic, setTopic] = useState("");

  // Student attendance status state: { [studentId]: { status: AttendanceStatusType, remark: string } }
  const [attendanceState, setAttendanceState] = useState<
    Record<string, { status: AttendanceStatusType; remark: string }>
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

  // Auto-select first section if not selected
  const activeSectionId = selectedSectionId || (sections[0]?.id ?? "");

  // Fetch sessions for active section
  const { data: sessionsData, isLoading: loadingSessions } = useQuery({
    queryKey: ["section", activeSectionId, "attendance-sessions"],
    queryFn: () => getSectionAttendance(activeSectionId),
    enabled: !!activeSectionId,
  });
  const sessions: AttendanceSession[] = sessionsData?.data || [];

  // Auto-select first session if none selected
  const activeSessionId = selectedSessionId || (sessions[0]?.id ?? "");

  // Fetch students for active section
  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ["section", activeSectionId, "students"],
    queryFn: () => getSectionStudents(activeSectionId),
    enabled: !!activeSectionId,
  });
  const students = studentsData?.data || [];

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: () =>
      createAttendanceSession(activeSectionId, {
        sessionDate,
        startTime,
        endTime,
        topic: topic || undefined,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["section", activeSectionId, "attendance-sessions"],
      });
      setIsCreateOpen(false);
      setTopic("");
      if (res?.data?.id) {
        setSelectedSessionId(res.data.id);
      }
      toast.add({
        title: "Session Created",
        description:
          "Attendance session opened. You can now mark student attendance.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Could not create attendance session",
        type: "error",
      });
    },
  });

  // Bulk save attendance mutation
  const saveAttendanceMutation = useMutation({
    mutationFn: () => {
      const records = students.map((enr: any) => {
        const studentId = enr.student?.id || enr.studentId || enr.id;
        const entry = attendanceState[studentId] || {
          status: "PRESENT",
          remark: "",
        };
        return {
          studentId,
          status: entry.status,
          remark: entry.remark || undefined,
        };
      });

      return bulkMarkAttendance(activeSessionId, { records });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["section", activeSectionId, "attendance-sessions"],
      });
      toast.add({
        title: "Attendance Saved",
        description: "Student attendance records updated successfully.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Save Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Could not save attendance records",
        type: "error",
      });
    },
  });

  const handleMarkAllPresent = () => {
    const updated: Record<
      string,
      { status: AttendanceStatusType; remark: string }
    > = {};
    for (const enr of students) {
      const studentId = enr.student?.id || enr.id;
      updated[studentId] = {
        status: "PRESENT",
        remark: attendanceState[studentId]?.remark || "",
      };
    }
    setAttendanceState(updated);
  };

  const handleStatusChange = (
    studentId: string,
    status: AttendanceStatusType,
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        status,
        remark: prev[studentId]?.remark || "",
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || "PRESENT",
        remark,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Class Attendance Register
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conduct daily attendance sessions and record student presence in
            real time.
          </p>
        </div>

        {activeSectionId && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger
              render={
                <Button size="sm" className="font-semibold shadow-xs">
                  <Plus className="size-4 mr-1.5" />
                  New Attendance Session
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Attendance Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Session Date
                  </label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Topic / Lecture Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chapter 4: Database Normalization"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-lg border bg-background"
                  />
                </div>
                <Button
                  className="w-full mt-2 font-semibold"
                  disabled={createSessionMutation.isPending}
                  onClick={() => createSessionMutation.mutate()}
                >
                  {createSessionMutation.isPending
                    ? "Creating..."
                    : "Start Session"}
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
                setSelectedSessionId("");
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

      {/* Main Content Area */}
      {!activeSectionId ? (
        <EmptyState
          icon={CalendarCheck2}
          title="No Teaching Sections"
          description="You do not have any assigned teaching sections to conduct attendance."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Clock className="size-4 text-primary" />
              Past Sessions ({sessions.length})
            </h3>

            {loadingSessions ? (
              <div className="space-y-2">
                <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                <div className="h-12 bg-muted/50 rounded-lg animate-pulse" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="rounded-xl border border-dashed p-4 text-center bg-card text-xs text-muted-foreground">
                No attendance sessions created yet. Click &quot;New Attendance
                Session&quot; to begin.
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {sessions.map((sess) => {
                  const isSelected = sess.id === activeSessionId;
                  return (
                    <button
                      key={sess.id}
                      type="button"
                      onClick={() => setSelectedSessionId(sess.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground font-semibold shadow-xs"
                          : "bg-card border-border text-muted-foreground hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono">
                        <span>
                          {new Date(sess.sessionDate).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {sess.startTime} - {sess.endTime}
                        </span>
                      </div>
                      {sess.topic && (
                        <div className="mt-1 line-clamp-1 font-normal text-muted-foreground">
                          {sess.topic}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Attendance Sheet */}
          <div className="lg:col-span-3 space-y-4">
            {!activeSessionId ? (
              <EmptyState
                icon={CalendarCheck2}
                title="Select or Create a Session"
                description="Select a session from the left or create a new session to record student attendance."
              />
            ) : (
              <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Attendance Sheet
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Mark presence for {students.length} enrolled students
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleMarkAllPresent}
                      className="text-xs"
                    >
                      <CheckCircle2 className="size-3.5 mr-1 text-emerald-600" />
                      Mark All Present
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => saveAttendanceMutation.mutate()}
                      disabled={
                        saveAttendanceMutation.isPending ||
                        students.length === 0
                      }
                      className="text-xs font-semibold"
                    >
                      <Save className="size-3.5 mr-1" />
                      {saveAttendanceMutation.isPending
                        ? "Saving..."
                        : "Save Attendance"}
                    </Button>
                  </div>
                </div>

                {loadingStudents ? (
                  <div className="p-4">
                    <TableSkeleton rows={4} cols={4} />
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
                          <th className="px-4 py-2.5">Attendance Status</th>
                          <th className="px-4 py-2.5">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {students.map((enr: any) => {
                          const student = enr.student || enr;
                          const studentId = student?.id || enr.id;
                          const currentStatus =
                            attendanceState[studentId]?.status || "PRESENT";
                          const currentRemark =
                            attendanceState[studentId]?.remark || "";

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
                                <div className="inline-flex rounded-lg border bg-muted/30 p-0.5">
                                  {(
                                    [
                                      [
                                        "PRESENT",
                                        "Present",
                                        "text-emerald-700 bg-emerald-500/15 border-emerald-500/30",
                                      ],
                                      [
                                        "ABSENT",
                                        "Absent",
                                        "text-red-700 bg-red-500/15 border-red-500/30",
                                      ],
                                      [
                                        "LATE",
                                        "Late",
                                        "text-amber-700 bg-amber-500/15 border-amber-500/30",
                                      ],
                                      [
                                        "EXCUSED",
                                        "Excused",
                                        "text-blue-700 bg-blue-500/15 border-blue-500/30",
                                      ],
                                    ] as const
                                  ).map(([st, label, activeClass]) => {
                                    const isActive = currentStatus === st;
                                    return (
                                      <button
                                        key={st}
                                        type="button"
                                        onClick={() =>
                                          handleStatusChange(
                                            studentId,
                                            st as AttendanceStatusType,
                                          )
                                        }
                                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                                          isActive
                                            ? `${activeClass} shadow-xs font-bold border`
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                      >
                                        {label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  placeholder="Optional remark..."
                                  value={currentRemark}
                                  onChange={(e) =>
                                    handleRemarkChange(
                                      studentId,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-xs px-2.5 py-1 rounded-md border bg-background"
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
