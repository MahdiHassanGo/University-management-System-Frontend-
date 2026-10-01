import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccessDenied({
  message = "You do not have administrative permission to view this academic resource.",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="size-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
        <ShieldAlert className="size-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Access Restricted
      </h1>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
        {message}
      </p>
      <div className="pt-2 flex gap-3">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            <span>Return Home</span>
          </Button>
        </Link>
        <Link href="/login">
          <Button>Switch Account</Button>
        </Link>
      </div>
    </div>
  );
}
