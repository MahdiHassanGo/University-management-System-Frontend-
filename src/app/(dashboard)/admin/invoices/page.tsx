"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Receipt } from "lucide-react";
import { useState } from "react";
import {
  bulkCreateInvoices,
  getAllInvoices,
  getAllSemesters,
} from "@/api/admin.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { FeeInvoice, InvoiceStatus } from "@/types";

export default function AdminInvoicesPage() {
  const queryClient = useQueryClient();
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [formData, setFormData] = useState({
    semesterId: "",
    amount: 45000,
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => getAllInvoices(),
  });

  const { data: semestersData } = useQuery({
    queryKey: ["semesters"],
    queryFn: () => getAllSemesters(),
  });

  const bulkMutation = useMutation({
    mutationFn: bulkCreateInvoices,
    onSuccess: (res: any) => {
      toast.add({
        title: "Invoices Generated",
        description:
          res?.message ||
          "Semester tuition invoices generated for all active students",
        type: "success",
      });
      setIsBulkOpen(false);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err: any) => {
      toast.add({
        title: "Generation Failed",
        description:
          err?.data?.message || err?.message || "Could not generate invoices",
        type: "error",
      });
    },
  });

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.semesterId || !formData.amount) return;
    bulkMutation.mutate({
      semesterId: formData.semesterId,
      amount: Number(formData.amount),
      dueDate: new Date(formData.dueDate).toISOString(),
    });
  };

  const invoices = data?.data || [];
  const semesters = semestersData?.data || [];

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "OVERDUE":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
      case "CANCELLED":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Fee Invoices & Billing
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Campus tuition fee invoices, outstanding balances, and payment
            settlements.
          </p>
        </div>

        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="gap-2 shadow-xs">
                <Plus className="size-4" />
                <span>Generate Term Invoices</span>
              </Button>
            }
          />
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bulk Generate Tuition Invoices</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBulkSubmit} className="space-y-3.5 mt-2">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Target Academic Semester *
                </label>
                <select
                  required
                  value={formData.semesterId}
                  onChange={(e) =>
                    setFormData({ ...formData, semesterId: e.target.value })
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus:border-primary focus:outline-hidden"
                >
                  <option value="">-- Choose Semester --</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.term} {s.year} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Tuition Fee Amount (BDT) *
                </label>
                <Input
                  required
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">
                  Payment Due Date *
                </label>
                <Input
                  required
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={bulkMutation.isPending}
                >
                  {bulkMutation.isPending
                    ? "Generating..."
                    : "Generate Invoices"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
          Failed to load invoices: {(error as any)?.message || "Unknown error"}
        </div>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No fee invoices issued"
          description="Use the invoice generator to issue semester tuition invoices to all enrolled students."
          action={
            <Button size="sm" onClick={() => setIsBulkOpen(true)}>
              Issue Invoices
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Invoice Number</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">Amount (BDT)</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((inv: FeeInvoice) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {inv.student?.studentId || "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {inv.student?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {inv.semester
                        ? `${inv.semester.term} ${inv.semester.year}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-foreground">
                      BDT {inv.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(inv.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(inv.status)}`}
                      >
                        {inv.status}
                      </span>
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
