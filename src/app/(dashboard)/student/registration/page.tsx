"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookMarked, Plus } from "lucide-react";
import { enrollCourse, getAvailableSections } from "@/api/student.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { extractDataArray } from "@/lib/utils";
import type { Section } from "@/types";

export default function StudentCourseRegistrationPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student", "available-sections"],
    queryFn: () => getAvailableSections(),
  });

  const enrollMutation = useMutation({
    mutationFn: enrollCourse,
    onSuccess: () => {
      toast.add({
        title: "Enrolled Successfully",
        description: "You have been registered into the course section.",
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["student", "available-sections"],
      });
      queryClient.invalidateQueries({ queryKey: ["student", "enrollments"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Registration Failed",
        description:
          err?.data?.message || err?.message || "Could not enroll into section",
        type: "error",
      });
    },
  });

  const sections = extractDataArray<Section>(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Course Registration
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select open course sections to register for the upcoming academic
          semester.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load available sections:{" "}
          {(error as any)?.message || "Unknown error"}
        </div>
      ) : sections.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No open sections available"
          description="There are currently no course sections open for self-registration. Please check registration dates with the Registrar."
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Course Code</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Section #</th>
                  <th className="px-4 py-3">Faculty Instructor</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sections.map((sec: Section) => {
                  const isFull =
                    sec.enrolledCount !== undefined &&
                    sec.enrolledCount >= sec.capacity;

                  return (
                    <tr
                      key={sec.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        {sec.course?.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {sec.course?.title}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {sec.course?.credits} cr
                      </td>
                      <td className="px-4 py-3 font-mono">
                        Sec {sec.sectionNumber}
                      </td>
                      <td className="px-4 py-3 text-foreground font-medium">
                        {sec.instructor?.name || "TBA"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {sec.roomNumber || "TBD"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono text-[11px] ${
                            isFull
                              ? "text-destructive font-bold"
                              : "text-foreground"
                          }`}
                        >
                          {sec.enrolledCount ?? 0} / {sec.capacity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          disabled={isFull || enrollMutation.isPending}
                          onClick={() => enrollMutation.mutate(sec.id)}
                          className="h-7 text-xs gap-1 shadow-xs"
                        >
                          <Plus className="size-3" />
                          <span>Enroll</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
