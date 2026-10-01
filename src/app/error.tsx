"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="size-8" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          {error.message ||
            "An unexpected error occurred while rendering the academic resource."}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={() => reset()} className="gap-2">
          <RefreshCw className="size-4" />
          <span>Try Again</span>
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <Home className="size-4" />
            <span>Portal Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
