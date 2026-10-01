import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="w-full rounded-xl border bg-card p-4 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="space-y-3">
        <div className="flex gap-4 pb-2 border-b">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={`head-${i}`} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`row-${r}`} className="flex gap-4 py-2 border-b/50">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={`cell-${r}-${c}`} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  );
}
