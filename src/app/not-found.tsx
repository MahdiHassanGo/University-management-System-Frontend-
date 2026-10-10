import { ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 text-center"
    >
      <GraduationCap className="size-12 text-primary" />
      <p className="text-xs font-semibold tracking-widest text-primary">
        404 / PAGE NOT FOUND
      </p>
      <h1 className="text-3xl font-semibold">Let’s get you back on course.</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you’re looking for may have moved or the address may be
        incorrect.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm text-primary-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>
    </main>
  );
}
