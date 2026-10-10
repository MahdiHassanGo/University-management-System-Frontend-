import { BookOpen, CalendarDays } from "lucide-react";
import Link from "next/link";
import { backendRequest } from "@/lib/server-api";
import { extractDataArray } from "@/lib/utils";
import type { AcademicSemester, ApiResponse, Program } from "@/types";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Academics | UniCore",
  description:
    "Explore the university’s current degree programs and academic calendar.",
};
export default async function AcademicsPage() {
  let programs: Program[] = [];
  let semesters: AcademicSemester[] = [];
  let unavailable = false;
  try {
    const responses = await Promise.all([
      backendRequest("public/programs?isActive=true&limit=100"),
      backendRequest("public/semesters?limit=100"),
    ]);
    if (responses.some((r) => !r.ok)) throw new Error("Unavailable");
    programs = extractDataArray(
      (await responses[0].json()) as ApiResponse<Program[]>,
    );
    semesters = extractDataArray(
      (await responses[1].json()) as ApiResponse<AcademicSemester[]>,
    );
  } catch {
    unavailable = true;
  }
  return (
    <main
      id="main-content"
      className="mx-auto max-w-7xl space-y-10 px-5 py-16 sm:px-8"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Academic life
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Find your path forward.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Explore current degree programs and the university’s published
          semester calendar.
        </p>
      </div>
      {unavailable ? (
        <div role="alert" className="rounded-xl border bg-card p-8">
          The academic catalog is temporarily unavailable. Please try again
          shortly.
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <BookOpen className="size-5 text-primary" />
              Degree programs
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <article key={p.id} className="rounded-2xl border bg-card p-6">
                  <p className="text-xs font-semibold text-primary">{p.code}</p>
                  <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {p.department?.name} · {p.degreeType}
                  </p>
                  <div className="mt-5 border-t pt-4 text-sm">
                    {p.totalCredits} credits · up to {p.maxSemesterCredits} each
                    semester
                  </div>
                </article>
              ))}
            </div>
            {programs.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No active programs have been published.
              </p>
            )}
          </section>
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <CalendarDays className="size-5 text-primary" />
              Academic calendar
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {semesters.map((s) => (
                <article key={s.id} className="rounded-2xl border bg-card p-6">
                  <h3 className="font-semibold">
                    {s.term} {s.year}
                  </h3>
                  <p className="mt-2 text-xs text-primary">
                    {s.status.replaceAll("_", " ")}
                  </p>
                  <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div>
                      Registration:{" "}
                      {new Date(s.registrationStart).toLocaleDateString(
                        "en-GB",
                      )}{" "}
                      –{" "}
                      {new Date(s.registrationEnd).toLocaleDateString("en-GB")}
                    </div>
                    <div>
                      Classes:{" "}
                      {new Date(s.classStart).toLocaleDateString("en-GB")} –{" "}
                      {new Date(s.classEnd).toLocaleDateString("en-GB")}
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            {semesters.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No semesters have been published.
              </p>
            )}
          </section>
        </>
      )}
      <Link
        href="/register"
        className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Register as a student
      </Link>
    </main>
  );
}
