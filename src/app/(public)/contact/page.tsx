import { BookOpen, CreditCard, MessageSquare } from "lucide-react";
import ContactForm from "@/components/form/contact-form";
export const metadata = {
  title: "Contact & support | UniCore",
  description:
    "Get help with university enrollment, academic records, or tuition payments.",
};
export default function ContactPage() {
  return (
    <main
      id="main-content"
      className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          We’re here to help
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Let’s get you
          <br />
          back on track.
        </h1>
        <p className="mt-5 max-w-md text-muted-foreground">
          Send an inquiry to the university administration. Include the relevant
          course, semester, or invoice reference so your question can be
          resolved.
        </p>
        <div className="mt-8 space-y-5">
          {[
            [
              BookOpen,
              "Academic support",
              "Enrollment, attendance, and published results.",
            ],
            [
              CreditCard,
              "Finance support",
              "Tuition invoices and payment verification.",
            ],
            [
              MessageSquare,
              "Portal support",
              "Account access and profile information.",
            ],
          ].map(([Icon, title, description]) => {
            const ContactIcon = Icon as typeof BookOpen;
            return (
              <div key={title as string} className="flex gap-4">
                <ContactIcon className="mt-1 size-5 text-primary" />
                <div>
                  <h2 className="text-sm font-semibold">{title as string}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description as string}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
        <h2 className="mb-6 text-xl font-semibold">Send an inquiry</h2>
        <ContactForm />
      </div>
    </main>
  );
}
