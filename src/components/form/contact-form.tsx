"use client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import apiClient from "@/lib/apiClient";
import { getErrorMessage } from "@/lib/errors";
import ValidatedForm from "./validated-form";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  message: z
    .string()
    .trim()
    .min(10, "Please include at least 10 characters.")
    .max(2000, "Use at most 2,000 characters."),
});
export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [pending, setPending] = useState(false);
  async function submit() {
    setPending(true);
    try {
      await apiClient("/contact", { method: "POST", body: values });
      toast.add({
        title: "Inquiry received",
        description:
          "Your message has been delivered to university administration.",
        type: "success",
      });
      setValues({ name: "", email: "", message: "" });
    } catch (error) {
      toast.add({
        title: "Couldn’t send your message",
        description: getErrorMessage(error),
        type: "error",
      });
    } finally {
      setPending(false);
    }
  }
  return (
    <ValidatedForm
      values={values}
      schema={schema}
      onSubmit={() => void submit()}
      className="space-y-5"
    >
      {(["name", "email", "message"] as const).map((field) => (
        <div key={field}>
          <label
            htmlFor={`contact-${field}`}
            className="mb-2 block text-sm font-medium"
          >
            {field === "name"
              ? "Full name"
              : field === "email"
                ? "Email address"
                : "Your message"}
          </label>
          {field === "message" ? (
            <textarea
              id={`contact-${field}`}
              rows={5}
              value={values[field]}
              onChange={(e) =>
                setValues({ ...values, [field]: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          ) : (
            <Input
              id={`contact-${field}`}
              type={field === "email" ? "email" : "text"}
              value={values[field]}
              onChange={(e) =>
                setValues({ ...values, [field]: e.target.value })
              }
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send inquiry"}
      </Button>
    </ValidatedForm>
  );
}
