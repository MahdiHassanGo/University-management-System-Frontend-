"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  createSection,
  getAllCourses,
  getAllInstructors,
  getAllSemesters,
} from "@/api/admin.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

interface WizardProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateSectionWizard({
  onSuccess,
  onCancel,
}: WizardProps) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    courseId: "",
    semesterId: "",
    sectionNumber: 1,
    instructorId: "",
    capacity: 35,
    roomNumber: "Room 402",
    day: "SUNDAY",
    startTime: "09:00",
    endTime: "10:30",
  });

  // Queries for options
  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => getAllCourses({ limit: 100 }),
  });

  const { data: semestersData, isLoading: loadingSemesters } = useQuery({
    queryKey: ["semesters"],
    queryFn: () => getAllSemesters(),
  });

  const { data: instructorsData, isLoading: loadingInstructors } = useQuery({
    queryKey: ["instructors"],
    queryFn: () => getAllInstructors({ limit: 100 }),
  });

  const courses = coursesData?.data || [];
  const semesters = semestersData?.data || [];
  const instructors = instructorsData?.data || [];

  // Selected object helpers for review
  const selectedCourse = courses.find((c) => c.id === formData.courseId);
  const selectedSemester = semesters.find((s) => s.id === formData.semesterId);
  const selectedInstructor = instructors.find(
    (i) => i.id === formData.instructorId,
  );

  // Mutation
  const createMutation = useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      toast.add({
        title: "Section Created",
        description: `Section ${formData.sectionNumber} for ${selectedCourse?.code || "course"} has been scheduled.`,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.add({
        title: "Creation Error",
        description:
          err?.data?.message ||
          err?.message ||
          "Failed to create course section",
        type: "error",
      });
    },
  });

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.courseId || !formData.semesterId) {
        toast.add({
          title: "Incomplete Step 1",
          description: "Please select both a Course and a Semester",
          type: "error",
        });
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.instructorId || !formData.capacity) {
        toast.add({
          title: "Incomplete Step 2",
          description:
            "Please designate a faculty Instructor and student Capacity",
          type: "error",
        });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const payload = {
      courseId: formData.courseId,
      semesterId: formData.semesterId,
      instructorId: formData.instructorId,
      sectionNumber: Number(formData.sectionNumber),
      capacity: Number(formData.capacity),
      roomNumber: formData.roomNumber || undefined,
      schedule: [
        {
          dayOfWeek: formData.day,
          startTime: formData.startTime,
          endTime: formData.endTime,
          room: formData.roomNumber,
        },
      ],
    };
    createMutation.mutate(payload);
  };

  const stepTitles = [
    { num: 1, label: "Academic Details", icon: BookOpen },
    { num: 2, label: "Faculty & Capacity", icon: User },
    { num: 3, label: "Schedule & Timing", icon: Calendar },
    { num: 4, label: "Review & Submit", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-4 gap-2 border-b pb-4">
        {stepTitles.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          const _Icon = step.icon;

          return (
            <div
              key={step.num}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-all ${
                isCurrent
                  ? "bg-primary/10 text-primary font-bold border border-primary/20"
                  : isDone
                    ? "text-emerald-600"
                    : "text-muted-foreground opacity-60"
              }`}
            >
              <div
                className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isDone ? "✓" : step.num}
              </div>
              <span className="hidden sm:inline truncate">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Academic Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            <span>Step 1: Academic Course & Term</span>
          </h3>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Select Academic Course *
            </label>
            <select
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
              disabled={loadingCourses}
            >
              <option value="">-- Choose Course from Catalog --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title} ({c.credits} cr)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Select Academic Semester *
            </label>
            <select
              value={formData.semesterId}
              onChange={(e) =>
                setFormData({ ...formData, semesterId: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
              disabled={loadingSemesters}
            >
              <option value="">-- Choose Semester Term --</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.term} {s.year} ({s.status.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Section Number *
            </label>
            <Input
              type="number"
              min={1}
              value={formData.sectionNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sectionNumber: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      )}

      {/* Step 2: Instructor & Capacity */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="size-4 text-primary" />
            <span>Step 2: Faculty Designation & Capacity</span>
          </h3>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Assign Instructor *
            </label>
            <select
              value={formData.instructorId}
              onChange={(e) =>
                setFormData({ ...formData, instructorId: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
              disabled={loadingInstructors}
            >
              <option value="">-- Select Instructor Member --</option>
              {instructors.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.name} ({ins.designation || "Faculty"} -{" "}
                  {ins.department?.code || "Dept"})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Seat Capacity *
              </label>
              <Input
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Classroom Room #
              </label>
              <Input
                placeholder="e.g. Room 402, Lab B"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Schedule & Timing */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <span>Step 3: Class Schedule & Routine</span>
          </h3>

          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Class Day of Week
            </label>
            <select
              value={formData.day}
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
            >
              <option value="SUNDAY">Sunday</option>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                Start Time
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">
                End Time
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Step 4: Review Section Configuration</span>
          </h3>

          <div className="rounded-xl border bg-muted/30 p-4 space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Course:</span>
              <span className="font-semibold text-foreground">
                {selectedCourse
                  ? `${selectedCourse.code} — ${selectedCourse.title}`
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Semester Term:</span>
              <span className="font-semibold text-foreground">
                {selectedSemester
                  ? `${selectedSemester.term} ${selectedSemester.year}`
                  : "—"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Section Number:</span>
              <span className="font-mono font-bold text-foreground">
                Section {formData.sectionNumber}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Assigned Faculty:</span>
              <span className="font-semibold text-foreground">
                {selectedInstructor?.name || "—"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Seat Capacity:</span>
              <span className="font-semibold text-foreground">
                {formData.capacity} Seats ({formData.roomNumber})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Weekly Schedule:</span>
              <span className="font-mono text-foreground font-semibold">
                {formData.day} ({formData.startTime} – {formData.endTime})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="gap-1.5"
          >
            <ChevronLeft className="size-4" />
            <span>Previous</span>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-xs text-muted-foreground"
          >
            Cancel
          </Button>
        )}

        {currentStep < 4 ? (
          <Button
            type="button"
            size="sm"
            onClick={handleNext}
            className="gap-1.5 shadow-xs"
          >
            <span>Next Step</span>
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
          >
            {createMutation.isPending ? (
              <>
                <Spinner className="size-4" />
                <span>Publishing Section...</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                <span>Confirm & Publish Section</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
