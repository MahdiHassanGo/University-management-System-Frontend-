"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Receipt, ShieldCheck } from "lucide-react";
import { useState } from "react";
import {
  getMyInvoices,
  getMyPayments,
  initiatePayment,
} from "@/api/student.api";
import EmptyState from "@/components/common/empty-state";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { extractDataArray } from "@/lib/utils";
import type { FeeInvoice, InvoiceStatus, Payment } from "@/types";

export default function StudentFinancePage() {
  const _queryClient = useQueryClient();
  const [activePayingId, setActivePayingId] = useState<string | null>(null);

  const {
    data: invoicesData,
    isLoading: loadingInvoices,
    isError,
    error,
  } = useQuery({
    queryKey: ["student", "invoices"],
    queryFn: () => getMyInvoices(),
  });

  const { data: paymentsData, isLoading: loadingPayments } = useQuery({
    queryKey: ["student", "payments"],
    queryFn: () => getMyPayments(),
  });

  const paymentMutation = useMutation({
    mutationFn: initiatePayment,
    onSuccess: (res) => {
      const data = res?.data;
      const gatewayUrl = data?.sslcommerzGatewayUrl || data?.bkashURL;

      if (gatewayUrl) {
        toast.add({
          title: "Redirecting to Gateway",
          description: "Launching secure payment portal...",
          type: "info",
        });
        window.location.href = gatewayUrl;
      } else if (data?.paymentId) {
        // Fallback to simulated test gateway redirect for sandbox
        toast.add({
          title: "Payment Initiated",
          description: `Transaction reference: ${data.merchantInvoiceNumber}`,
          type: "success",
        });
        // Redirect to success callback with transaction details
        window.location.href = `/payment/success?paymentId=${data.paymentId}&amount=${data.amount}&trxID=${data.merchantInvoiceNumber}`;
      } else {
        toast.add({
          title: "Payment Initiated",
          description: "Payment session active",
          type: "success",
        });
      }
    },
    onError: (err: any) => {
      toast.add({
        title: "Payment Error",
        description:
          err?.data?.message ||
          err?.message ||
          "Failed to initialize payment gateway",
        type: "error",
      });
      setActivePayingId(null);
    },
  });

  const handlePay = async (inv: FeeInvoice) => {
    setActivePayingId(inv.id);
    try {
      const res = await fetch("/api/payment/sslcommerz/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: inv.id,
          amount: inv.amount,
          studentName: inv.student?.name,
          studentId: inv.student?.studentId,
        }),
      });
      const result = await res.json();
      if (result.success && result.gatewayUrl) {
        toast.add({
          title: "Connecting to SSLCommerz",
          description: "Redirecting to secure test payment gateway...",
          type: "info",
        });
        window.location.href = result.gatewayUrl;
        return;
      }
    } catch {
      // Fallback to backend initiate
    }
    paymentMutation.mutate(inv.id);
  };

  const invoices = extractDataArray<FeeInvoice>(invoicesData);
  const payments = extractDataArray<Payment>(paymentsData);

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "OVERDUE":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Student Tuition & Billing
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          View tuition invoices, settle outstanding semester fees, and verify
          payment transaction receipts.
        </p>
      </div>

      {/* Gateway Trust Banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-5 text-primary shrink-0" />
          <div>
            <div className="font-semibold text-foreground">
              SSLCommerz / Online Gateway Active
            </div>
            <div className="text-muted-foreground">
              Transactions are processed and verified securely via authorized
              payment gateways.
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          <span>Tuition Fee Invoices</span>
        </h2>

        {loadingInvoices ? (
          <TableSkeleton rows={3} cols={5} />
        ) : isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-xs text-destructive">
            Failed to load invoices:{" "}
            {(error as any)?.message || "Unknown error"}
          </div>
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No tuition invoices issued"
            description="You do not have any pending or issued fee invoices for this semester."
          />
        ) : (
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Invoice Number</th>
                    <th className="px-4 py-3">Term</th>
                    <th className="px-4 py-3">Amount (BDT)</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Payment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((inv: FeeInvoice) => {
                    const isPaid = inv.status === "PAID";
                    const isPaying =
                      activePayingId === inv.id && paymentMutation.isPending;

                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {inv.semester
                            ? `${inv.semester.term} ${inv.semester.year}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
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
                        <td className="px-4 py-3 text-right">
                          {isPaid ? (
                            <span className="text-emerald-600 font-semibold text-xs inline-flex items-center gap-1">
                              ✓ Paid
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              disabled={isPaying}
                              onClick={() => handlePay(inv)}
                              className="h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
                            >
                              {isPaying ? (
                                <>
                                  <Spinner className="size-3" />
                                  <span>Connecting...</span>
                                </>
                              ) : (
                                <>
                                  <CreditCard className="size-3" />
                                  <span>Pay Now</span>
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="size-4 text-primary" />
          <span>Payment History & Transaction Receipts</span>
        </h2>

        {loadingPayments ? (
          <TableSkeleton rows={2} cols={5} />
        ) : payments.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/40 p-6 text-center text-xs text-muted-foreground">
            No completed payment transactions on record yet.
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Transaction ID / Trx</th>
                    <th className="px-4 py-3">Merchant Invoice</th>
                    <th className="px-4 py-3">Gateway</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map((pm: Payment) => (
                    <tr key={pm.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono font-semibold text-foreground">
                        {pm.trxID || pm.merchantInvoiceNumber}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {pm.invoice?.invoiceNumber || "—"}
                      </td>
                      <td className="px-4 py-3 font-medium">{pm.gateway}</td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        BDT {pm.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-semibold">
                          {pm.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(pm.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
