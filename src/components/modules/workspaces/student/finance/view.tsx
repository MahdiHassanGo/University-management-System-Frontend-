"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CreditCard,
  Receipt,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getMyInvoices,
  getMyPayments,
  initiatePayment,
} from "@/api/student.api";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import PageHeader from "@/components/common/page-header";
import StatCard from "@/components/common/stat-card";
import StatusBadge from "@/components/common/status-badge";
import TableSkeleton from "@/components/common/table-skeleton";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";
import { extractDataArray } from "@/lib/utils";

const money = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(value);
const date = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export default function StudentFinancePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filter = params.get("status") || "ALL";
  const invoicesQuery = useQuery({
    queryKey: ["student", "invoices"],
    queryFn: getMyInvoices,
  });
  const paymentsQuery = useQuery({
    queryKey: ["student", "payments"],
    queryFn: getMyPayments,
  });
  const invoices = extractDataArray(invoicesQuery.data);
  const payments = extractDataArray(paymentsQuery.data);
  const outstanding = invoices.filter(
    (i) => i.status === "UNPAID" || i.status === "OVERDUE",
  );
  const filtered =
    filter === "ALL" ? invoices : invoices.filter((i) => i.status === filter);
  const mutation = useMutation({
    mutationFn: initiatePayment,
    onSuccess: (response) => {
      if (!response.success || !response.data.gatewayUrl) {
        toast.add({
          title: "Checkout unavailable",
          description:
            "No secure checkout address was returned. Please try again later.",
          type: "error",
        });
        return;
      }
      const gateway = new URL(response.data.gatewayUrl);
      if (
        gateway.protocol !== "https:" ||
        !(
          gateway.hostname === "sslcommerz.com" ||
          gateway.hostname.endsWith(".sslcommerz.com")
        )
      ) {
        toast.add({
          title: "Checkout unavailable",
          description: "The checkout address could not be verified.",
          type: "error",
        });
        return;
      }
      sessionStorage.setItem("ums_last_payment", response.data.paymentId);
      window.location.assign(gateway.toString());
    },
    onError: (error) =>
      toast.add({
        title: "Couldn’t start checkout",
        description: getErrorMessage(error),
        type: "error",
      }),
  });
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student workspace"
        title="Tuition & payments"
        description="Keep track of your semester fees, manage outstanding invoices, and find your payment receipts."
        action={
          <Button
            variant="outline"
            disabled={invoicesQuery.isFetching || paymentsQuery.isFetching}
            onClick={() => {
              invoicesQuery.refetch();
              paymentsQuery.refetch();
            }}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Outstanding balance"
          value={
            invoicesQuery.isLoading || invoicesQuery.isError
              ? "—"
              : money(outstanding.reduce((sum, i) => sum + i.amount, 0))
          }
          subtitle="Unpaid and overdue invoices"
          icon={Receipt}
        />
        <StatCard
          title="Total settled"
          value={
            invoicesQuery.isLoading || invoicesQuery.isError
              ? "—"
              : money(
                  invoices
                    .filter((i) => i.status === "PAID")
                    .reduce((sum, i) => sum + i.amount, 0),
                )
          }
          subtitle="Confirmed invoice payments"
          icon={CreditCard}
        />
        <StatCard
          title="Invoices to pay"
          value={
            invoicesQuery.isLoading || invoicesQuery.isError
              ? "—"
              : outstanding.length
          }
          subtitle="Ready for secure checkout"
          icon={ArrowUpRight}
        />
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">
            Secure online checkout{" "}
            <span className="ml-2 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
              Test mode
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Choose a payment method on SSLCommerz. Your invoice is settled only
            after the provider confirms your transaction.
          </p>
        </div>
      </div>
      <section className="space-y-4" aria-label="Tuition invoices">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Your invoices</h2>
          <select
            aria-label="Filter invoices by status"
            value={filter}
            onChange={(e) => {
              const next = new URLSearchParams(params.toString());
              next.set("status", e.target.value);
              router.replace(`${pathname}?${next}`);
            }}
            className="rounded-lg border bg-card px-3 py-2 text-sm"
          >
            <option value="ALL">All statuses</option>
            {["UNPAID", "PAID", "OVERDUE", "CANCELLED"].map((s) => (
              <option key={s} value={s}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        {invoicesQuery.isLoading ? (
          <TableSkeleton />
        ) : invoicesQuery.isError ? (
          <ErrorState
            error={invoicesQuery.error}
            retry={() => invoicesQuery.refetch()}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No invoices found"
            description="Invoices issued by the finance office will appear here. Try another status if you have filtered this view."
          />
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {filtered.map((inv) => (
                <article
                  key={inv.id}
                  className="rounded-2xl border bg-card p-5 shadow-xs"
                >
                  <div className="flex justify-between items-start gap-3">
                    <p className="text-sm font-semibold break-all">
                      {inv.invoiceNumber}
                    </p>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="mt-4 text-2xl font-semibold tabular-nums">
                    {money(inv.amount)}
                  </p>
                  <div className="mt-2 mb-5 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                    <span>
                      {inv.semester
                        ? `${inv.semester.term} ${inv.semester.year}`
                        : "Semester fee"}
                    </span>
                    <span>Due {date(inv.dueDate)}</span>
                  </div>
                  {["UNPAID", "OVERDUE"].includes(inv.status) && (
                    <Button
                      className="w-full"
                      disabled={mutation.isPending}
                      onClick={() => mutation.mutate(inv.id)}
                    >
                      <CreditCard className="size-4" />
                      {mutation.isPending && mutation.variables === inv.id
                        ? "Connecting…"
                        : "Pay securely"}
                    </Button>
                  )}
                </article>
              ))}
            </div>
            <div className="hidden md:block overflow-hidden rounded-2xl border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                    <tr>
                      {[
                        "Invoice",
                        "Semester",
                        "Amount",
                        "Due date",
                        "Status",
                        "",
                      ].map((h, i) => (
                        <th key={h || i} className="px-5 py-4 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((inv) => (
                      <tr key={inv.id} className="hover:bg-muted/20">
                        <td className="px-5 py-5 font-medium">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-5 py-5 text-muted-foreground">
                          {inv.semester
                            ? `${inv.semester.term} ${inv.semester.year}`
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-5 font-semibold tabular-nums">
                          {money(inv.amount)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-5 text-muted-foreground">
                          {date(inv.dueDate)}
                        </td>
                        <td className="px-5 py-5">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="px-5 py-5 text-right">
                          {["UNPAID", "OVERDUE"].includes(inv.status) ? (
                            <Button
                              size="sm"
                              disabled={mutation.isPending}
                              onClick={() => mutation.mutate(inv.id)}
                            >
                              {mutation.isPending &&
                              mutation.variables === inv.id ? (
                                <Spinner className="size-4" />
                              ) : (
                                <CreditCard className="size-4" />
                              )}
                              {mutation.isPending &&
                              mutation.variables === inv.id
                                ? "Connecting…"
                                : "Pay securely"}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {inv.status === "PAID" ? "Settled" : "Closed"}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
      <section className="space-y-4" aria-label="Payment history">
        <h2 className="text-lg font-semibold">Payment history</h2>
        {paymentsQuery.isLoading ? (
          <TableSkeleton rows={3} />
        ) : paymentsQuery.isError ? (
          <ErrorState
            error={paymentsQuery.error}
            retry={() => paymentsQuery.refetch()}
          />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Your checkout attempts and confirmed payments will appear here."
          />
        ) : (
          <>
            <div className="grid gap-3 md:hidden">
              {payments.map((p) => (
                <article
                  key={p.id}
                  className="rounded-2xl border bg-card p-5 shadow-xs"
                >
                  <div className="flex justify-between gap-3">
                    <p className="text-sm font-semibold break-all">
                      {p.invoice?.invoiceNumber || "Tuition payment"}
                    </p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-3 text-xl font-semibold">
                    {money(p.amount)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground break-all">
                    {p.trxID || p.merchantInvoiceNumber} · {date(p.createdAt)}
                  </p>
                  <Link
                    href={`/payment/success?paymentId=${p.id}`}
                    className="mt-4 inline-flex py-2 text-sm font-semibold text-primary"
                  >
                    View payment details →
                  </Link>
                </article>
              ))}
            </div>
            <div className="hidden md:block overflow-hidden rounded-2xl border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
                    <tr>
                      {[
                        "Reference",
                        "Invoice",
                        "Amount",
                        "Status",
                        "Date",
                        "",
                      ].map((h, i) => (
                        <th key={h || i} className="px-5 py-4 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="px-5 py-4 text-xs font-medium">
                          {p.trxID || p.merchantInvoiceNumber}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {p.invoice?.invoiceNumber || "—"}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums">
                          {money(p.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                          {date(p.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/payment/success?paymentId=${p.id}`}
                            className="whitespace-nowrap text-xs font-semibold text-primary hover:underline"
                          >
                            View details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
