import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "./table-skeleton";
export default function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading workspace" className="space-y-6">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <TableSkeleton />
    </div>
  );
}
