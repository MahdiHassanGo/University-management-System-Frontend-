"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteSection, getAllSections } from "@/api/admin.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import CreateSectionWizard from "@/components/modules/section-wizard/create-section-wizard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { extractDataArray } from "@/lib/utils";
import type { Section } from "@/types";

export default function AdminSectionsPage() {
  const queryClient = useQueryClient();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sections"],
    queryFn: () => getAllSections(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      toast.add({
        title: "Section Removed",
        description: "Course section deleted from academic offerings",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Deletion Failed",
        description:
          err?.data?.message ||
          err?.message ||
          "Cannot delete section with active student enrollments",
        type: "error",
      });
    },
  });

  const sections = extractDataArray<Section>(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Course Sections
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure term class offerings, seat capacities, faculty
            instructors, and routines.
          </p>
        </div>

        <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2 shadow-xs">
                <Plus className="size-4" />
                <span>New Section Wizard</span>
              </Button>
            }
          />
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Multi-Step Section Creator Wizard</DialogTitle>
            </DialogHeader>
            <CreateSectionWizard
              onSuccess={() => setIsWizardOpen(false)}
              onCancel={() => setIsWizardOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load sections: {(error as any)?.message || "Unknown error"}
        </div>
      ) : sections.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No course sections found"
          description="Use the multi-step section creation wizard to publish new course sections for open semesters."
          action={
            <Button size="sm" onClick={() => setIsWizardOpen(true)}>
              Launch Section Wizard
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Course Code</th>
                  <th className="px-4 py-3">Course Title</th>
                  <th className="px-4 py-3">Section #</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Enrollment / Capacity</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sections.map((sec: Section) => (
                  <tr
                    key={sec.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {sec.course?.code || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {sec.course?.title || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">
                      Sec {sec.sectionNumber}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {sec.semester
                        ? `${sec.semester.term} ${sec.semester.year}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {sec.instructor?.name || "Unassigned"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">
                        {sec.enrolledCount ?? 0} / {sec.capacity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {sec.roomNumber || "TBD"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Delete section ${sec.sectionNumber}?`)) {
                            deleteMutation.mutate(sec.id);
                          }
                        }}
                        className="text-destructive hover:bg-destructive/10 size-8 p-0"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
