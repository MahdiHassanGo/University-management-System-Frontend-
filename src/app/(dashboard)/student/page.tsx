import {
  ArrowUpRight,
  BookMarked,
  CalendarCheck2,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Scroll,
} from "lucide-react";
import Link from "next/link";

export default function StudentOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Student Portal
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Access course registration, view personal class schedules, track
          attendance, and inspect published results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/student/registration" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BookMarked className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Course Registration
            </div>
            <div className="text-xs text-muted-foreground">
              Select open semester sections
            </div>
          </div>
        </Link>

        <Link href="/student/courses" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <GraduationCap className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              My Enrolled Classes
            </div>
            <div className="text-xs text-muted-foreground">
              Current courses & instructors
            </div>
          </div>
        </Link>

        <Link href="/student/attendance" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <CalendarCheck2 className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Attendance Records
            </div>
            <div className="text-xs text-muted-foreground">
              Classroom participation stats
            </div>
          </div>
        </Link>

        <Link href="/student/results" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <FileCheck2 className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Grades & Results
            </div>
            <div className="text-xs text-muted-foreground">
              Published semester evaluations
            </div>
          </div>
        </Link>

        <Link href="/student/transcript" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Scroll className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Official Transcript
            </div>
            <div className="text-xs text-muted-foreground">
              Cumulative CGPA and credits
            </div>
          </div>
        </Link>

        <Link href="/student/finance" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <CreditCard className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Tuition & Invoices
            </div>
            <div className="text-xs text-muted-foreground">
              Fee payment via SSLCommerz
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
