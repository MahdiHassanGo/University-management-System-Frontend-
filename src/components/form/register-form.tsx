"use client";

import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeClosed, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useRegistration } from "@/hooks";
import apiClient from "@/lib/apiClient";
import type { AcademicSemester, ApiResponse, Program } from "@/types";
import { registerSchema } from "@/validation";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerStudent, isPending: isRegistering } =
    useRegistration();

  // Fetch dynamic programs from real backend
  const { data: programsData, isLoading: isLoadingPrograms } = useQuery({
    queryKey: ["programs", "catalog"],
    queryFn: () => apiClient<ApiResponse<Program[]>>("/programs"),
  });

  // Fetch dynamic semesters from real backend
  const { data: semestersData, isLoading: isLoadingSemesters } = useQuery({
    queryKey: ["semesters", "catalog"],
    queryFn: () => apiClient<ApiResponse<AcademicSemester[]>>("/semesters"),
  });

  const programs = programsData?.data || [];
  const semesters = semestersData?.data || [];

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      programId: "",
      admissionSemesterId: "",
      gender: "MALE" as "MALE" | "FEMALE" | "OTHER",
      contactNo: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      registerStudent(
        {
          name: value.name,
          email: value.email,
          password: value.password,
          programId: value.programId,
          admissionSemesterId: value.admissionSemesterId,
          gender: value.gender,
          contactNo: value.contactNo || undefined,
        },
        {
          onSuccess: (res: any) => {
            const studentId = res?.data?.studentId;
            toast.add({
              title: "Admission Registered",
              description: studentId
                ? `Student profile created: ID ${studentId}. Please sign in.`
                : "Student registration successful. Please sign in.",
              type: "success",
            });
            router.push("/login");
          },
          onError: (err: any) => {
            const errorMsg =
              err?.data?.message ||
              err?.message ||
              "Registration failed. Please check the details and try again.";
            toast.add({
              title: "Registration Failed",
              description: errorMsg,
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Student Admission Application
        </h1>
        <p className="text-xs text-muted-foreground">
          Register for enrollment in university degree programs
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="gap-3.5">
          {/* Full Name */}
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Full Legal Name</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Mahdi Hassan"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      aria-invalid={isInvalid}
                      className="pl-9"
                    />
                    <User className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Email */}
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="scholar@university.edu"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="email"
                      aria-invalid={isInvalid}
                      className="pl-9"
                    />
                    <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Dynamic Academic Program */}
          <form.Field name="programId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Academic Degree Program
                  </FieldLabel>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-hidden"
                    disabled={isLoadingPrograms}
                  >
                    <option value="">
                      {isLoadingPrograms
                        ? "Loading programs..."
                        : "-- Select Degree Program --"}
                    </option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Dynamic Admission Semester */}
          <form.Field name="admissionSemesterId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Admission Term / Semester
                  </FieldLabel>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-hidden"
                    disabled={isLoadingSemesters}
                  >
                    <option value="">
                      {isLoadingSemesters
                        ? "Loading semesters..."
                        : "-- Select Admission Semester --"}
                    </option>
                    {semesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.term} {s.year} ({s.status.replace("_", " ")})
                      </option>
                    ))}
                  </select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Gender & Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <form.Field name="gender">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-primary focus:outline-hidden"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </Field>
              )}
            </form.Field>

            <form.Field name="contactNo">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="+8801700000000"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      className="pl-9"
                    />
                    <Phone className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </Field>
              )}
            </form.Field>
          </div>

          {/* Password & Confirm Password */}
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 chars, uppercase, lowercase & digit"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="new-password"
                      aria-invalid={isInvalid}
                      className="pl-9 pr-10"
                    />
                    <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeClosed className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="new-password"
                      aria-invalid={isInvalid}
                      className="pl-9"
                    />
                    <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button
            type="submit"
            disabled={isRegistering}
            className="w-full gap-2 mt-2 shadow-sm font-semibold"
          >
            {isRegistering ? (
              <>
                <Spinner className="size-4" />
                <span>Registering student...</span>
              </>
            ) : (
              <span>Submit Admission Application</span>
            )}
          </Button>
        </FieldGroup>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Already enrolled as a student or staff?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
        >
          Sign in to portal
        </Link>
      </div>
    </div>
  );
}
