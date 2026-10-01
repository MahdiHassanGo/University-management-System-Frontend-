"use client";

import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeClosed, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMe } from "@/api";
import DemoLoginButtons from "@/components/auth/demo-login-buttons";
import GoogleLoginComponent from "@/components/modules/google-login/GoogleLogin";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/validation";

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      login(
        { email: value.email, password: value.password },
        {
          onSuccess: async () => {
            try {
              // Fetch user profile to determine authoritative role
              const meRes = await queryClient.fetchQuery({
                queryKey: ["user"],
                queryFn: getMe,
              });

              const profile = meRes?.data;
              const user = profile?.user || profile;
              const role = user?.role || "STUDENT";

              toast.add({
                title: "Welcome Back",
                description: `Signed in as ${user?.email || value.email}`,
                type: "success",
              });

              const target =
                role === "SUPER_ADMIN"
                  ? "/admin"
                  : role === "INSTRUCTOR"
                    ? "/instructor"
                    : "/student";

              router.push(target);
            } catch (_err: any) {
              toast.add({
                title: "Profile Resolution Failed",
                description: "Session active, redirecting to home",
                type: "info",
              });
              router.push("/");
            }
          },
          onError: (err: any) => {
            const errorMsg =
              err?.data?.message ||
              err?.message ||
              "Invalid email or password. Please verify credentials.";
            toast.add({
              title: "Sign-in Failed",
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
          Sign In to Portal
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter your academic credentials to access your university dashboard
        </p>
      </div>

      {/* Mandatory 1-Click Demo Login */}
      <DemoLoginButtons />

      <FieldSeparator>or sign in with credentials</FieldSeparator>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="gap-4">
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Academic Email</FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="admin@university.edu"
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
                      placeholder="••••••••"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      value={field.state.value}
                      autoComplete="current-password"
                      aria-invalid={isInvalid}
                      className="pl-9 pr-10"
                    />
                    <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full gap-2 mt-1 shadow-sm font-semibold"
          >
            {isLoggingIn ? (
              <>
                <Spinner className="size-4" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </Button>
        </FieldGroup>
      </form>

      <FieldSeparator>or social account</FieldSeparator>

      <GoogleLoginComponent />

      <div className="text-center text-xs text-muted-foreground">
        Prospective student seeking admission?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
        >
          Apply & Register here
        </Link>
      </div>
    </div>
  );
}
