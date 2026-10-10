import { ArrowLeft, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/common/Logo";
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="grid min-h-[85vh] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#112d32] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image
          src="/campus.svg"
          alt="Illustration of university academic buildings"
          fill
          sizes="50vw"
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#112d32] via-[#112d32]/60 to-transparent" />
        <div className="relative text-white">
          <span className="text-xs uppercase tracking-[.2em] text-white/70">
            UniCore / Campus workspace
          </span>
        </div>
        <div className="relative max-w-md space-y-6 text-white">
          <GraduationCap className="size-12 text-emerald-300" />
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            A clearer view of
            <br />
            your academic journey.
          </h2>
          <p className="text-base leading-relaxed text-white/70">
            From your first enrollment to your final transcript, everything you
            need is here.
          </p>
          <div className="flex gap-5 border-t border-white/15 pt-6 text-xs text-white/80">
            <span className="flex items-center gap-2">
              <BookOpen className="size-4" />
              Academic workspace
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Secure access
            </span>
          </div>
        </div>
      </aside>
      <div className="flex flex-col items-center justify-center bg-card px-5 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <div className="mb-8">
            <Logo size="lg" />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
