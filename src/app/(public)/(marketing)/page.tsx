import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const workspaces = [
  {
    icon: GraduationCap,
    title: "For students",
    description:
      "Plan your semester, register for courses, and follow your progress from one personal workspace.",
    items: [
      "Course registration",
      "Attendance & results",
      "Tuition & receipts",
    ],
  },
  {
    icon: BookOpen,
    title: "For faculty",
    description:
      "Spend more time teaching with a connected view of your sections, student rosters, and assessments.",
    items: [
      "Assigned sections",
      "Session attendance",
      "Exams & grade publishing",
    ],
  },
  {
    icon: Users,
    title: "For administrators",
    description:
      "Bring people, academic operations, and finance together with a clear view of campus activity.",
    items: [
      "Academic catalog",
      "Student & faculty records",
      "Reports & audit history",
    ],
  },
];
export const metadata = {
  title: "UniCore | Your campus, connected",
  description:
    "A connected university workspace for students, faculty, and administrators.",
  openGraph: {
    title: "UniCore — Your campus, connected",
    description: "Manage academic life in one secure workspace.",
  },
};
export default function HomePage() {
  return (
    <main id="main-content">
      <section className="relative overflow-hidden border-b bg-[#112d32] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <div className="space-y-7">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              University management, simplified
            </p>
            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Your campus.
              <br />
              <span className="text-emerald-200">Connected.</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-white/70">
              A thoughtful workspace for academic life. Manage courses, connect
              your people, and keep every semester moving forward.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-3 rounded-lg bg-emerald-200 px-6 text-sm font-semibold text-[#112d32] transition hover:bg-emerald-100"
              >
                Enter your workspace
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/academics"
                className="inline-flex h-12 items-center gap-3 rounded-lg border border-white/25 px-6 text-sm font-medium transition hover:bg-white/10"
              >
                Explore academics
              </Link>
            </div>
            <div className="flex flex-wrap gap-5 border-t border-white/15 pt-6 text-xs text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-200" />
                Secure role access
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-emerald-200" />
                One connected semester
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15">
              <Image
                src="/campus.svg"
                alt="Illustration of a university academic building"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#112d32]/80 to-transparent" />
              <div className="absolute bottom-20 left-6 right-6">
                <p className="text-xs uppercase tracking-widest text-white/70">
                  Built around your academic life
                </p>
                <p className="mt-2 text-2xl font-medium">
                  More clarity. Every semester.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-xl border bg-card p-5 text-foreground shadow-lg sm:left-8 sm:right-8">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="size-6" />
              </span>
              <div>
                <p className="text-sm font-semibold">
                  A workspace for everyone
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Students · Faculty · Administration
                </p>
              </div>
              <Link
                href="/login"
                aria-label="Explore demo workspaces"
                className="ml-auto rounded-full border p-2 text-primary hover:bg-muted"
              >
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
              One platform, three perspectives
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Designed for the way you work.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Each role gets the tools and information it needs, with a shared
            foundation for the whole university.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {workspaces.map(({ icon: Icon, title, description, items }) => (
            <article
              key={title}
              className="flex flex-col rounded-2xl border bg-card p-7 shadow-xs"
            >
              <span className="mb-6 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <ul className="my-6 space-y-3 border-t pt-5 text-sm">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Open workspace
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y bg-primary/5">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <CreditCard className="size-9 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">
                Tuition payments, with clarity.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                View invoices, use secure checkout, and keep confirmed receipts
                together.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Sign in to get started
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
