const tones: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/15",
  UNPAID: "bg-amber-50 text-amber-700 ring-amber-600/15",
  OVERDUE: "bg-rose-50 text-rose-700 ring-rose-600/15",
  FAILED: "bg-rose-50 text-rose-700 ring-rose-600/15",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-500/15",
};
export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tones[status] || tones.CANCELLED}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status.charAt(0) + status.slice(1).toLowerCase().replaceAll("_", " ")}
    </span>
  );
}
