import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                <span>Next-Generation Academic ERP</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Empowering Excellence in{" "}
                <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  Higher Education
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A unified campus operating system uniting Students, Faculty, and
                Super Administrators. Experience automated semester enrollment,
                session attendance, real-time grading, and secure tuition
                payments.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 shadow-md"
                  >
                    <span>Access University Portal</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Student Registration
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Real Backend API Integration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Role-Based Access Control</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>SSLCommerz Gateway Ready</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Credentials Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border bg-card/90 p-6 sm:p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Shield className="size-5 text-primary" />
                  <span>Instant Demo Credentials</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-5">
                  Authenticate instantly using the 1-click credentials below on
                  the sign-in portal.
                </p>

                <div className="space-y-3">
                  <div className="rounded-xl border p-3.5 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-primary flex items-center gap-1.5">
                        <Shield className="size-3.5" /> Super Admin
                      </span>
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-primary text-[10px]">
                        Full Access
                      </span>
                    </div>
                    <div className="mt-1.5 text-xs font-mono text-muted-foreground">
                      admin@university.edu
                    </div>
                    <div className="text-[11px] text-muted-foreground/80">
                      Pass: Admin123!
                    </div>
                  </div>

                  <div className="rounded-xl border p-3.5 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-blue-600 flex items-center gap-1.5">
                        <Users className="size-3.5" /> Instructor
                      </span>
                      <span className="rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 text-[10px]">
                        Faculty
                      </span>
                    </div>
                    <div className="mt-1.5 text-xs font-mono text-muted-foreground">
                      instructor@university.edu
                    </div>
                    <div className="text-[11px] text-muted-foreground/80">
                      Pass: Instructor123!
                    </div>
                  </div>

                  <div className="rounded-xl border p-3.5 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-emerald-600 flex items-center gap-1.5">
                        <GraduationCap className="size-3.5" /> Student
                      </span>
                      <span className="rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 text-[10px]">
                        Learner
                      </span>
                    </div>
                    <div className="mt-1.5 text-xs font-mono text-muted-foreground">
                      student@university.edu
                    </div>
                    <div className="text-[11px] text-muted-foreground/80">
                      Pass: Student123!
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Link href="/login" className="block">
                    <Button variant="default" className="w-full">
                      Launch Demo Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Architecture Highlights */}
      <section className="py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Designed for Institutional Workflows
            </h2>
            <p className="text-base text-muted-foreground">
              Every persona in the university ecosystem operates within a
              purpose-built workspace tailored to academic integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Super Admin Card */}
            <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Shield className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Institutional Governance
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Super Admins oversee academic cataloging, department curricula,
                semester schedules, multi-step section provisioning, and audit
                logs.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pt-2 border-t">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" /> Curricula &
                  Course Prerequisites
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" /> Multi-Step
                  Section Creation Wizard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary" /> Recharts
                  Governance Dashboards
                </li>
              </ul>
            </div>

            {/* Instructor Card */}
            <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="size-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <BookOpen className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Faculty & Grading Hub
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Faculty manage student rosters, conduct date-stamped attendance
                sessions, administer weighted examinations, and calculate final
                grades.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pt-2 border-t">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-blue-600" />{" "}
                  Interactive Attendance Marker
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-blue-600" /> Bulk Exam
                  Marks Entry
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-blue-600" /> Automated
                  GPA & Result Publication
                </li>
              </ul>
            </div>

            {/* Student Card */}
            <div className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <GraduationCap className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Student Academic Journey
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Students enroll in available sections based on credit caps,
                review cumulative transcripts, monitor session attendance, and
                settle tuition fees.
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground pt-2 border-t">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />{" "}
                  Real-time Course Registration & Drop
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />{" "}
                  Verified CGPA & Transcripts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />{" "}
                  SSLCommerz Hosted Payment Checkout
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
