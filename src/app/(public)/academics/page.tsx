import { BookOpen, Calendar, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AcademicsPage() {
  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Academic Catalog & Programs
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Explore accredited undergraduate and graduate programs offered by the
          university faculties.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Computer Science & Engineering
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            Department: CSE • Code: BSCSE
          </p>
          <p className="text-sm text-muted-foreground">
            A comprehensive 140-credit curriculum spanning software engineering,
            algorithms, databases, artificial intelligence, and network systems.
          </p>
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Maximum Semester Load: 21 Credits
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <Calendar className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Semester Structure
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            3 Terms Annually
          </p>
          <p className="text-sm text-muted-foreground">
            The university operates on a tri-semester schedule: Spring, Summer,
            and Fall. Each semester consists of 14 instructional weeks and a
            2-week final exam cycle.
          </p>
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Active Term: Fall 2026
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
          <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="size-5" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Admission Requirements
          </h2>
          <p className="text-xs font-mono text-muted-foreground">
            Enrolling Now
          </p>
          <p className="text-sm text-muted-foreground">
            Eligible candidates can register online through our Student
            Admission Portal. Once admitted, students receive institutional
            student IDs and portal access.
          </p>
          <div className="pt-2 border-t">
            <Link href="/register">
              <Button size="sm" variant="outline" className="w-full">
                Apply for Admission
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
