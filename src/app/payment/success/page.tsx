"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Clock3, Receipt } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { getPaymentById } from "@/api/student.api";
import AuthGuard from "@/components/auth/auth-guard";
import ErrorState from "@/components/common/error-state";
import Logo from "@/components/common/Logo";
import StatusBadge from "@/components/common/status-badge";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";

function ReceiptContent() {
  const params = useSearchParams();
  const id = params.get("paymentId");
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPaymentById(id || ""),
    enabled: !!id,
    retry: false,
    refetchInterval: (q) =>
      q.state.data?.data.status === "PENDING" && q.state.dataUpdateCount < 6
        ? 5000
        : false,
  });
  const payment = query.data?.data;
  const paid = payment?.status === "PAID";
  useEffect(() => {
    if (paid) {
      client.invalidateQueries({ queryKey: ["student", "invoices"] });
      client.invalidateQueries({ queryKey: ["student", "payments"] });
    }
  }, [paid, client]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-9">
        <div className="flex justify-center">
          <Logo withLink={false} />
        </div>
        {query.isLoading ? (
          <TableSkeleton rows={3} cols={2} />
        ) : query.isError ? (
          <ErrorState error={query.error} retry={() => query.refetch()} />
        ) : !payment ? (
          <div className="space-y-3 text-center">
            <Receipt className="mx-auto size-9 text-muted-foreground" />
            <h1 className="text-2xl font-semibold">
              Payment reference missing
            </h1>
            <p className="text-sm text-muted-foreground">
              Open a transaction from your payment history to view its confirmed
              details.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div
                className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${paid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
              >
                {paid ? (
                  <CheckCircle2 className="size-8" />
                ) : (
                  <Clock3 className="size-8" />
                )}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {paid
                  ? "Payment confirmed"
                  : payment.status === "PENDING"
                    ? "Awaiting confirmation"
                    : "Payment details"}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {paid
                  ? "Your payment has been verified and your invoice is settled."
                  : "Your invoice is settled only after the payment provider confirms a completed transaction. Check this record before starting another checkout."}
              </p>
            </div>
            <dl className="divide-y rounded-xl border px-4 text-sm">
              {[
                ["Invoice", payment.invoice?.invoiceNumber || "—"],
                [
                  "Amount",
                  new Intl.NumberFormat("en-BD", {
                    style: "currency",
                    currency: "BDT",
                  }).format(payment.amount),
                ],
                ["Transaction", payment.trxID || "Not confirmed"],
                ["Provider", payment.gateway],
                [
                  "Date",
                  new Date(payment.createdAt).toLocaleDateString("en-GB"),
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="shrink-0 text-muted-foreground">{k}</dt>
                  <dd className="break-all text-right font-medium">{v}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={payment.status} />
                </dd>
              </div>
            </dl>
            {payment.status === "PENDING" && (
              <Button
                variant="outline"
                className="w-full"
                disabled={query.isFetching}
                onClick={() => query.refetch()}
              >
                {query.isFetching ? "Checking…" : "Check payment status"}
              </Button>
            )}
            {paid && (
              <Button
                variant="outline"
                className="w-full print:hidden"
                onClick={() => window.print()}
              >
                Print receipt
              </Button>
            )}
          </>
        )}
        <Link href="/student/finance" className="block print:hidden">
          <Button className="w-full">
            Back to tuition & payments
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default function PaymentSuccessPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<TableSkeleton />}>
        <ReceiptContent />
      </Suspense>
    </AuthGuard>
  );
}
