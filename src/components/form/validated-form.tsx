"use client";
import { useForm } from "@tanstack/react-form";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ZodType } from "zod";

export default function ValidatedForm({
  values,
  schema,
  onSubmit,
  className,
  children,
}: {
  values: Record<string, unknown>;
  schema: ZodType;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
  children: ReactNode;
}) {
  const submitEvent = useRef<FormEvent<HTMLFormElement> | null>(null);
  const [attempted, setAttempted] = useState(false);
  const validate = (value: Record<string, unknown>) => {
    const result = schema.safeParse(value);
    return result.success
      ? undefined
      : result.error.issues.map((issue) => issue.message).join(" ");
  };
  const form = useForm({
    defaultValues: { values },
    validators: {
      onSubmit: ({ value }) => validate(value.values),
    },
    onSubmit: () => {
      if (submitEvent.current) onSubmit(submitEvent.current);
    },
  });
  useEffect(() => {
    form.setFieldValue("values", values);
  }, [values, form]);
  const validation = attempted ? schema.safeParse(values) : null;
  return (
    <form
      noValidate
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        submitEvent.current = event;
        setAttempted(true);
        form.setFieldValue("values", values);
        void form.handleSubmit();
      }}
    >
      {children}
      {validation && !validation.success && (
        <ul
          role="alert"
          className="mt-3 space-y-1 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive"
        >
          {validation.error.issues.map((issue) => (
            <li key={issue.path.join(".")}>{issue.message}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
