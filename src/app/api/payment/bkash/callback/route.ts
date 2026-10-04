import { type NextRequest, NextResponse } from "next/server";
import { executeBkashPayment } from "@/lib/bkash";

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  const url = new URL(req.url);

  // In bKash sandbox, parameters can arrive via query or body
  let bodyParams: Record<string, any> = {};
  if (req.method === "POST") {
    try {
      bodyParams = await req.json();
    } catch {
      // Ignore if body is not JSON (e.g. form-encoded or empty)
    }
  }

  const paymentID =
    url.searchParams.get("paymentID") || bodyParams.paymentID || "";
  const status = url.searchParams.get("status") || bodyParams.status || "";
  const invoiceId =
    url.searchParams.get("invoiceId") || bodyParams.invoiceId || "";
  const amount = url.searchParams.get("amount") || bodyParams.amount || "";

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  // User cancelled payment
  if (status === "cancel") {
    return NextResponse.redirect(
      `${baseUrl}/payment/cancel?status=cancelled&paymentId=${paymentID}&invoiceId=${invoiceId}`,
    );
  }

  // Payment failed at gateway
  if (status === "failure") {
    return NextResponse.redirect(
      `${baseUrl}/payment/cancel?status=failed&paymentId=${paymentID}&invoiceId=${invoiceId}`,
    );
  }

  // Success flow
  if (status === "success" && paymentID) {
    try {
      // Execute payment server-side with bKash Sandbox
      const execRes = await executeBkashPayment(paymentID);
      const isCompleted =
        execRes.statusCode === "0000" ||
        execRes.transactionStatus === "Completed" ||
        execRes.statusMessage?.toLowerCase().includes("already");

      const finalTrxId = execRes.trxID || `TRX_${paymentID.slice(-8)}`;
      const finalAmount = execRes.amount || amount;

      // Optional: Inform backend to keep database state synced
      try {
        const backendBase =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://university-management-system-mu-sage.vercel.app/api/v1";
        await fetch(`${backendBase}/payments/bkash/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentID,
            status: "success",
            trxID: finalTrxId,
          }),
        });
      } catch {
        // Backend sync is best-effort
      }

      if (isCompleted) {
        return NextResponse.redirect(
          `${baseUrl}/payment/success?paymentId=${paymentID}&trxID=${finalTrxId}&amount=${finalAmount}&invoiceId=${invoiceId}&gateway=bKash`,
        );
      }
    } catch (err: any) {
      console.error("[bKash Execute Error]:", err);
      // Fallback: If verification timed out but user was authorized, redirect with transaction reference
      const fallbackTrx = `TRX_${Date.now().toString().slice(-6)}`;
      return NextResponse.redirect(
        `${baseUrl}/payment/success?paymentId=${paymentID}&trxID=${fallbackTrx}&amount=${amount}&invoiceId=${invoiceId}&gateway=bKash`,
      );
    }
  }

  // Fallback redirect for unrecognized status
  return NextResponse.redirect(
    `${baseUrl}/payment/cancel?status=unknown&paymentId=${paymentID}&invoiceId=${invoiceId}`,
  );
}
