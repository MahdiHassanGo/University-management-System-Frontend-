"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  CalendarCheck,
  Clock,
  FileSpreadsheet,
  MapPin,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  getInstructorSections,
  getMyInstructorProfile,
} from "@/api/instructor.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import type { Section } from "@/types";

export default function InstructorSectionsPage() {
  const { data: profileData } = useQuery({
    queryKey: ["instructor", "profile"],
    queryFn: () => getMyInstructorProfile(),
  });

  const profile = profileData?.data;

  const { data: sectionsData, isLoading } = useQuery({
    queryKey: ["instructor", "sections", profile?.id],
    queryFn: () => getInstructorSections(profile?.id),
    enabled: !!profile?.id,
  });

  const sections: Section[] = sectionsData?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Assigned Teaching Sections
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View all academic course sections assigned to you for teaching,
          attendance, and grading.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : sections.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Teaching Sections Assigned"
          description="You currently do not have any assigned course sections. Contact your department administrator if you believe this is in error."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sections.map((sec) => {
            const enrolled = sec.enrolledCount || 0;
            const pct = Math.round((enrolled / (sec.capacity || 1)) * 100);

            return (
              <div
                key={sec.id}
                className="rounded-xl border bg-card p-5 shadow-xs hover:border-border/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10">
                      {sec.course?.code || "COURSE"}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Section {sec.sectionNumber}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground mt-3 line-clamp-1">
                    {sec.course?.title || "Course Section"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sec.semester
                      ? `${sec.semester.term} ${sec.semester.year}`
                      : "Term"}
                    {" • "}
                    {sec.course?.credits || 3} Credit Hours
                  </p>

                  <div className="mt-4 pt-3 border-t space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        Enrollment:
                      </span>
                      <span className="font-semibold text-foreground">
                        {enrolled} / {sec.capacity} students ({pct}%)
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>

                    {sec.roomNumber && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          Room Location:
                        </span>
                        <span className="font-medium text-foreground">
                          {sec.roomNumber}
                        </span>
                      </div>
                    )}

                    {sec.status && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          Status:
                        </span>
                        <span className="font-semibold text-foreground uppercase text-[10px] px-2 py-0.5 rounded bg-muted">
                          {sec.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/instructor/sections/${sec.id}`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs w-full"
                      >
                        <Users className="size-3.5 mr-1.5" />
                        Roster
                      </Button>
                    </Link>
                    <Link
                      href={`/instructor/attendance?sectionId=${sec.id}`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs w-full"
                      >
                        <CalendarCheck className="size-3.5 mr-1.5" />
                        Attendance
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/instructor/exams?sectionId=${sec.id}`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs w-full"
                      >
                        <FileSpreadsheet className="size-3.5 mr-1.5" />
                        Exams
                      </Button>
                    </Link>
                    <Link
                      href={`/instructor/results?sectionId=${sec.id}`}
                      className="w-full"
                    >
                      <Button
                        size="sm"
                        variant="default"
                        className="text-xs w-full"
                      >
                        <Award className="size-3.5 mr-1.5" />
                        Grades
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
