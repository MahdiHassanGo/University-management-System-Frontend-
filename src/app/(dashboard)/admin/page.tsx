import { ArrowUpRight, BarChart3, BookOpen, Shield, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Super Admin Console
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Institutional governance, catalog control, faculty management, and
          university metrics.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/students" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Users className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Students
            </div>
            <div className="text-xs text-muted-foreground">
              Manage enrolled scholars
            </div>
          </div>
        </Link>

        <Link href="/admin/instructors" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Shield className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Instructors
            </div>
            <div className="text-xs text-muted-foreground">
              Faculty profiles & departments
            </div>
          </div>
        </Link>

        <Link href="/admin/courses" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BookOpen className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Curriculum
            </div>
            <div className="text-xs text-muted-foreground">
              Courses & prerequisites
            </div>
          </div>
        </Link>

        <Link href="/admin/reports" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BarChart3 className="size-5" />
              <ArrowUpRight className="size-4 opacity-50 group-hover:opacity-100" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Analytics
            </div>
            <div className="text-xs text-muted-foreground">
              Real-time Recharts reports
            </div>
          </div>
        </Link>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-2">
          Academic Catalogs & Sections
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mb-4">
          Access the comprehensive administrative modules to configure
          departments, degree programs, semester schedules, and multi-step
          course section offerings.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/departments">
            <Button variant="outline" size="sm">
              Departments
            </Button>
          </Link>
          <Link href="/admin/programs">
            <Button variant="outline" size="sm">
              Programs
            </Button>
          </Link>
          <Link href="/admin/semesters">
            <Button variant="outline" size="sm">
              Academic Semesters
            </Button>
          </Link>
          <Link href="/admin/sections">
            <Button variant="outline" size="sm">
              Course Sections
            </Button>
          </Link>
          <Link href="/admin/enrollments">
            <Button variant="outline" size="sm">
              Student Enrollments
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
