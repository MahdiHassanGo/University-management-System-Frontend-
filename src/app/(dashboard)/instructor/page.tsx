"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarCheck,
  Clock,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  getInstructorSections,
  getMyInstructorProfile,
} from "@/api/instructor.api";
import StatCard from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import type { Section } from "@/types";

export default function InstructorOverviewPage() {
  const { data: profileData } = useQuery({
    queryKey: ["instructor", "profile"],
    queryFn: () => getMyInstructorProfile(),
  });

  const profile = profileData?.data;

  const { data: sectionsData, isLoading: loadingSections } = useQuery({
    queryKey: ["instructor", "sections", profile?.id],
    queryFn: () => getInstructorSections(profile?.id),
    enabled: !!profile?.id,
  });

  const sections: Section[] = sectionsData?.data || [];
  const totalStudents = sections.reduce(
    (acc, sec) => acc + (sec.enrolledCount || 0),
    0,
  );
  const totalCapacity = sections.reduce(
    (acc, sec) => acc + (sec.capacity || 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/95 via-primary to-primary/80 p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="size-3.5 text-accent" />
            <span>Faculty Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.name || "Professor"}
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {profile?.designation || "Faculty Member"} •{" "}
            {profile?.department?.name || "Academic Department"} (ID:{" "}
            {profile?.employeeId || "—"})
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/instructor/attendance">
              <Button
                size="sm"
                variant="secondary"
                className="font-semibold shadow-xs"
              >
                <CalendarCheck className="size-4 mr-1.5" />
                Take Attendance
              </Button>
            </Link>
            <Link href="/instructor/exams">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold"
              >
                <FileSpreadsheet className="size-4 mr-1.5" />
                Record Exam Marks
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none">
          <GraduationCap className="size-64" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Sections"
          value={loadingSections ? "—" : sections.length}
          subtitle="Active academic offerings"
          icon={<BookOpen className="size-5 text-primary" />}
        />
        <StatCard
          title="Total Students"
          value={loadingSections ? "—" : totalStudents}
          subtitle={`${totalCapacity} total seat capacity`}
          icon={<Users className="size-5 text-indigo-500" />}
        />
        <StatCard
          title="Attendance Sessions"
          value="Session Portal"
          subtitle="Mark daily present / absent"
          icon={<CalendarCheck className="size-5 text-emerald-500" />}
        />
        <StatCard
          title="Grade Publishing"
          value="Compute & Publish"
          subtitle="Final semester transcripts"
          icon={<Award className="size-5 text-amber-500" />}
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/instructor/sections" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BookOpen className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Teaching Sections
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Class rosters, room locations & schedules
            </div>
          </div>
        </Link>

        <Link href="/instructor/attendance" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <CalendarCheck className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Attendance Register
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Bulk attendance sheets & history logs
            </div>
          </div>
        </Link>

        <Link href="/instructor/exams" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <FileSpreadsheet className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Exams & Marksheets
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Quizzes, midterms & marks entry matrix
            </div>
          </div>
        </Link>

        <Link href="/instructor/results" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Award className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Grade Calculation
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Automated CGPA computation & student publishing
            </div>
          </div>
        </Link>
      </div>

      {/* Active Teaching Sections Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Current Teaching Sections
          </h2>
          <Link href="/instructor/sections" className="text-xs">
            <Button variant="ghost" size="sm">
              View all ({sections.length})
            </Button>
          </Link>
        </div>

        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center bg-card">
            <BookOpen className="size-8 mx-auto text-muted-foreground/60 mb-2" />
            <div className="text-sm font-medium text-foreground">
              No sections assigned yet
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your academic department chair will assign course sections for
              upcoming terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.slice(0, 6).map((sec) => (
              <div
                key={sec.id}
                className="rounded-xl border bg-card p-5 shadow-xs hover:border-border/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                      {sec.course?.code || "COURSE"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Sec {sec.sectionNumber}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-foreground mt-2 line-clamp-1">
                    {sec.course?.title || "Course Section"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sec.semester
                      ? `${sec.semester.term} ${sec.semester.year}`
                      : "Current Term"}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        Enrollment:
                      </span>
                      <span className="font-medium text-foreground">
                        {sec.enrolledCount || 0} / {sec.capacity} students
                      </span>
                    </div>
                    {sec.roomNumber && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          Room:
                        </span>
                        <span className="font-medium text-foreground">
                          {sec.roomNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t flex items-center justify-between gap-2">
                  <Link
                    href={`/instructor/sections/${sec.id}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs w-full"
                    >
                      Roster
                    </Button>
                  </Link>
                  <Link
                    href={`/instructor/attendance?sectionId=${sec.id}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      variant="default"
                      className="text-xs w-full"
                    >
                      Attendance
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
