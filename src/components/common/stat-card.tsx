import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  badgeClass?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  badgeClass = "bg-primary/10 text-primary",
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-xs hover:shadow-sm transition-all space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`flex size-8 items-center justify-center rounded-lg ${badgeClass}`}
        >
          <Icon className="size-4" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {trend && (
              <span className="font-semibold text-emerald-600">{trend}</span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
