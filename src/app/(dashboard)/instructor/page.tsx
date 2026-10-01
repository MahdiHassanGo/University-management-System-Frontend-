import {
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";

export default function InstructorOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Faculty Workspace
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review assigned teaching sections, conduct attendance, record
          examination scores, and publish final student results.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/instructor/sections" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BookOpen className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Teaching Sections
            </div>
            <div className="text-xs text-muted-foreground">
              Class rosters & schedules
            </div>
          </div>
        </Link>

        <Link href="/instructor/attendance" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <CalendarCheck className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Attendance
            </div>
            <div className="text-xs text-muted-foreground">
              Session-based bulk markers
            </div>
          </div>
        </Link>

        <Link href="/instructor/exams" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <FileSpreadsheet className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Exams & Marks
            </div>
            <div className="text-xs text-muted-foreground">
              Weightages & grade entry
            </div>
          </div>
        </Link>

        <Link href="/instructor/results" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Award className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Grade Publishing
            </div>
            <div className="text-xs text-muted-foreground">
              Final grade calculations
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
