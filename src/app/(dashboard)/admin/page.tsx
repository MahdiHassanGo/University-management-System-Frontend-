"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  FileCheck2,
  GraduationCap,
  Layers,
  Receipt,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  getAllCourses,
  getAllInstructors,
  getAllSections,
  getAllStudents,
} from "@/api/admin.api";
import StatCard from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ["admin", "students-summary"],
    queryFn: () => getAllStudents({ limit: 1 }),
  });

  const { data: instructorsData, isLoading: loadingInstructors } = useQuery({
    queryKey: ["admin", "instructors-summary"],
    queryFn: () => getAllInstructors({ limit: 1 }),
  });

  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ["admin", "courses-summary"],
    queryFn: () => getAllCourses({ limit: 1 }),
  });

  const { data: sectionsData, isLoading: loadingSections } = useQuery({
    queryKey: ["admin", "sections-summary"],
    queryFn: () => getAllSections(),
  });

  const totalStudents =
    studentsData?.meta?.total ?? studentsData?.data?.length ?? 0;
  const totalInstructors =
    instructorsData?.meta?.total ?? instructorsData?.data?.length ?? 0;
  const totalCourses =
    coursesData?.meta?.total ?? coursesData?.data?.length ?? 0;
  const totalSections = sectionsData?.data?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-primary/85 p-6 sm:p-8 text-primary-foreground shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="size-3.5 text-accent" />
            <span>Master Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Administration
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Complete institutional control: academic catalogs, faculty
            assignments, student enrollments, fee invoicing, and live analytics.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/sections">
              <Button
                size="sm"
                variant="secondary"
                className="font-semibold shadow-xs"
              >
                <Layers className="size-4 mr-1.5" />
                Manage Course Sections
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold"
              >
                <BarChart3 className="size-4 mr-1.5" />
                View Analytics Reports
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-12 opacity-10 pointer-events-none">
          <Shield className="size-64" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={loadingStudents ? "—" : totalStudents}
          subtitle="Registered scholars"
          icon={<Users className="size-5 text-primary" />}
        />
        <StatCard
          title="Faculty Members"
          value={loadingInstructors ? "—" : totalInstructors}
          subtitle="Department instructors"
          icon={<Shield className="size-5 text-indigo-500" />}
        />
        <StatCard
          title="Curriculum Courses"
          value={loadingCourses ? "—" : totalCourses}
          subtitle="Academic syllabus catalog"
          icon={<BookOpen className="size-5 text-emerald-500" />}
        />
        <StatCard
          title="Active Sections"
          value={loadingSections ? "—" : totalSections}
          subtitle="Term class offerings"
          icon={<Layers className="size-5 text-amber-500" />}
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/students" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Users className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Students
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Profiles, admissions, academic status
            </div>
          </div>
        </Link>

        <Link href="/admin/instructors" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <Shield className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Instructors
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Faculty roster, departments & designations
            </div>
          </div>
        </Link>

        <Link href="/admin/courses" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BookOpen className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Course Catalog
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Curriculum, prerequisites & credits
            </div>
          </div>
        </Link>

        <Link href="/admin/reports" className="block">
          <div className="rounded-xl border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between text-muted-foreground group-hover:text-primary">
              <BarChart3 className="size-5" />
              <ArrowRight className="size-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-3 text-lg font-bold text-foreground">
              Analytics Hub
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Enrollments, pass rates, finance metrics
            </div>
          </div>
        </Link>
      </div>

      {/* Catalog & Operations Grid */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs">
        <h2 className="text-base font-bold text-foreground mb-1">
          Catalog & Operations Directory
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mb-5">
          Access specialized institutional administrative modules:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/departments"
            className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-center block group"
          >
            <Building2 className="size-5 mx-auto text-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Departments</div>
            <div className="text-[10px] text-muted-foreground">Catalogs</div>
          </Link>

          <Link
            href="/admin/programs"
            className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-center block group"
          >
            <GraduationCap className="size-5 mx-auto text-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Programs</div>
            <div className="text-[10px] text-muted-foreground">Degree caps</div>
          </Link>

          <Link
            href="/admin/semesters"
            className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-center block group"
          >
            <CalendarDays className="size-5 mx-auto text-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Semesters</div>
            <div className="text-[10px] text-muted-foreground">
              Terms & lifecycle
            </div>
          </Link>

          <Link
            href="/admin/sections"
            className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-center block group"
          >
            <Layers className="size-5 mx-auto text-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Sections</div>
            <div className="text-[10px] text-muted-foreground">
              Class wizard
            </div>
          </Link>

          <Link
            href="/admin/enrollments"
            className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-center block group"
          >
            <FileCheck2 className="size-5 mx-auto text-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">Enrollments</div>
            <div className="text-[10px] text-muted-foreground">
              Student course history
            </div>
          </Link>

          <Link
            href="/admin/invoices"
            className="p-3.5 rounded-xl border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all text-center block group"
          >
            <Receipt className="size-5 mx-auto text-primary mb-1.5 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-foreground">
              Fee Invoices
            </div>
            <div className="text-[10px] text-muted-foreground">
              Billing & payments
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
