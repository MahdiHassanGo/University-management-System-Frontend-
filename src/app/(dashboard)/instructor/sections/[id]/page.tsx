"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSectionById } from "@/api/admin.api";
import { getSectionStudents } from "@/api/instructor.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";

export default function InstructorSectionDetailPage() {
  const params = useParams();
  const sectionId = params?.id as string;

  const { data: sectionData } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: () => getSectionById(sectionId),
    enabled: !!sectionId,
  });

  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ["section", sectionId, "students"],
    queryFn: () => getSectionStudents(sectionId),
    enabled: !!sectionId,
  });

  const section = sectionData?.data;
  const enrollments = studentsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/instructor/sections">
            <Button variant="outline" size="icon" className="size-8">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {section?.course?.code || "Course"} — Sec{" "}
                {section?.sectionNumber || 1}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary">
                {section?.status || "OPEN"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {section?.course?.title} • {section?.semester?.term}{" "}
              {section?.semester?.year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/instructor/attendance?sectionId=${sectionId}`}>
            <Button size="sm" variant="outline">
              <CalendarCheck className="size-3.5 mr-1.5" />
              Attendance
            </Button>
          </Link>
          <Link href={`/instructor/exams?sectionId=${sectionId}`}>
            <Button size="sm" variant="outline">
              <FileSpreadsheet className="size-3.5 mr-1.5" />
              Exams
            </Button>
          </Link>
          <Link href={`/instructor/results?sectionId=${sectionId}`}>
            <Button size="sm" variant="default">
              <Award className="size-3.5 mr-1.5" />
              Grades
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs text-muted-foreground">Class Capacity</div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {enrollments.length} / {section?.capacity || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Registered students
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs text-muted-foreground">Room / Location</div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {section?.roomNumber || "TBD"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Assigned lecture hall
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="text-xs text-muted-foreground">Course Credits</div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {section?.course?.credits || 3}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Credit units</div>
        </div>
      </div>

      {/* Student Roster */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Users className="size-4 text-primary" />
            Enrolled Student Roster ({enrollments.length})
          </h2>
        </div>

        {loadingStudents ? (
          <TableSkeleton rows={5} cols={5} />
        ) : enrollments.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Students Enrolled"
            description="No students have registered for this section yet."
          />
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b text-xs uppercase font-medium text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Student ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Enrolled At</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {enrollments.map((enr: any, idx: number) => {
                    const student = enr.student || enr;
                    return (
                      <tr
                        key={enr.id || idx}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-primary">
                          {student?.studentId || "—"}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {student?.name || "Student"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            {student?.user?.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="size-3" />
                                {student.user.email}
                              </span>
                            )}
                            {student?.contactNo && (
                              <span className="flex items-center gap-1">
                                <Phone className="size-3" />
                                {student.contactNo}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            {enr.status || "ENROLLED"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {enr.enrolledAt
                            ? new Date(enr.enrolledAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
