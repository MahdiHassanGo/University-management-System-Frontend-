"use client";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/errors";
export default function ErrorState({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
    >
      <AlertCircle className="size-6 text-destructive" />
      <h2 className="font-semibold">We couldn’t load this information</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        {getErrorMessage(error)}
      </p>
      {retry && (
        <Button variant="outline" onClick={retry}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
