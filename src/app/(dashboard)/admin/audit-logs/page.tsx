"use client";

import { useQuery } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { getAllAuditLogs } from "@/api/admin.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { extractDataArray } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => getAllAuditLogs(),
  });

  const logs = extractDataArray(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Audit Logs
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Immutable institutional activity trails, permission changes, and
          security events.
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load audit logs:{" "}
          {(error as any)?.message || "Unknown error"}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No audit entries logged"
          description="Administrative and user events will be automatically recorded here."
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity Type</th>
                  <th className="px-4 py-3">Entity ID</th>
                  <th className="px-4 py-3">Performed By</th>
                  <th className="px-4 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log: any) => (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {log.entityType}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground text-[11px]">
                      {log.entityId}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {log.performedBy || "System Admin"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
