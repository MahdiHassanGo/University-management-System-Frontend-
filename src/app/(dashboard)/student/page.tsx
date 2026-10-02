"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookMarked,
  CalendarCheck2,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Scroll,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import {
  getMyEnrollments,
  getMyInvoices,
  getMyStudentProfile,
  getMyTranscript,
} from "@/api/student.api";
import StatCard from "@/components/common/stat-card";
import { extractDataArray } from "@/lib/utils";

export default function StudentOverviewPage() {
  const { data: profileData } = useQuery({
    queryKey: ["student", "profile"],
    queryFn: () => getMyStudentProfile(),
  });

  const { data: enrollmentsData } = useQuery({
    queryKey: ["student", "enrollments"],
    queryFn: () => getMyEnrollments(),
  });

  const { data: invoicesData } = useQuery({
    queryKey: ["student", "invoices"],
    queryFn: () => getMyInvoices(),
  });

  const { data: transcriptData } = useQuery({
    queryKey: ["student", "transcript"],
    queryFn: () => getMyTranscript(),
  });

  const profile = profileData?.data;
  const enrollments = extractDataArray(enrollmentsData);
  const invoices = extractDataArray(invoicesData);
  const transcript = transcriptData?.data;

  const unpaidInvoices = invoices.filter(
    (i) => i.status === "UNPAID" || i.status === "OVERDUE",
  );
  const totalDue = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="space-y-2 relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Student Academic Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Welcome, {profile?.name || "Student Scholar"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {profile?.program?.name || "Degree Program"} • Student ID:{" "}
            <span className="font-mono font-bold text-foreground">
              {profile?.studentId || "STU-PENDING"}
            </span>
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value={enrollments.filter((e) => e.status === "ENROLLED").length}
          subtitle="Enrolled this semester"
          icon={BookMarked}
          badgeClass="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
        />

        <StatCard
          title="Cumulative CGPA"
          value={transcript?.cgpa ? transcript.cgpa.toFixed(2) : "4.00"}
          subtitle="Out of 4.00 grading scale"
          icon={GraduationCap}
          badgeClass="bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
        />

        <StatCard
          title="Completed Credits"
          value={transcript?.totalCreditsCompleted ?? 0}
          subtitle={`Required: ${profile?.program?.totalCredits || 140} cr`}
          icon={Scroll}
          badgeClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        />

        <StatCard
          title="Tuition Dues"
          value={totalDue > 0 ? `BDT ${totalDue.toLocaleString()}` : "Settled"}
          subtitle={
            unpaidInvoices.length > 0
              ? `${unpaidInvoices.length} unpaid invoices`
              : "All fees paid"
          }
          icon={CreditCard}
          badgeClass={
            totalDue > 0
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          }
        />
      </div>

      {/* Quick Nav Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/student/registration" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BookMarked className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-base font-bold text-foreground">
              Course Registration
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Enroll into available open sections
            </div>
          </div>
        </Link>

        <Link href="/student/courses" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <GraduationCap className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-base font-bold text-foreground">
              My Enrolled Classes
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Class schedule, room & faculty
            </div>
          </div>
        </Link>

        <Link href="/student/attendance" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <CalendarCheck2 className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-base font-bold text-foreground">
              Attendance Records
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Participation percentages & logs
            </div>
          </div>
        </Link>

        <Link href="/student/results" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <FileCheck2 className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-base font-bold text-foreground">
              Semester Grades
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Evaluations & letter grades
            </div>
          </div>
        </Link>

        <Link href="/student/transcript" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Scroll className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-base font-bold text-foreground">
              Official Academic Transcript
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Verified cumulative GPA report
            </div>
          </div>
        </Link>

        <Link href="/student/finance" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <CreditCard className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-base font-bold text-foreground">
              Tuition & Invoices
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Pay fees via SSLCommerz gateway
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
