"use client";
import ErrorState from "@/components/common/error-state";
export default function PageError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState error={error} retry={reset} />;
}
