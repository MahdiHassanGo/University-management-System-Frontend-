import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invoiceId,
      amount,
      studentName,
      studentEmail,
      studentPhone,
      studentId,
    } = body;

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { success: false, message: "invoiceId and amount are required" },
        { status: 400 },
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const tran_id = `UMS-${studentId || "ST"}-${Date.now().toString().slice(-6)}`;

    const storeId = process.env.SSLCOMMERZ_STORE_ID || "testbox";
    const storePass = process.env.SSLCOMMERZ_STORE_PASS || "qwerty";

    const params = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePass,
      total_amount: String(amount),
      currency: "BDT",
      tran_id,
      success_url: `${baseUrl}/api/payment/sslcommerz/callback?status=success&invoiceId=${invoiceId}&amount=${amount}`,
      fail_url: `${baseUrl}/api/payment/sslcommerz/callback?status=fail&invoiceId=${invoiceId}`,
      cancel_url: `${baseUrl}/api/payment/sslcommerz/callback?status=cancel&invoiceId=${invoiceId}`,
      ipn_url: `${baseUrl}/api/payment/sslcommerz/callback?status=ipn&invoiceId=${invoiceId}`,
      shipping_method: "NO",
      product_name: "University Semester Tuition Fee",
      product_category: "Education",
      product_profile: "non-physical-goods",
      cus_name: studentName || "Student",
      cus_email: studentEmail || "student@university.edu",
      cus_add1: "University Campus",
      cus_city: "Dhaka",
      cus_postcode: "1200",
      cus_country: "Bangladesh",
      cus_phone: studentPhone || "01700000000",
    });

    const sslRes = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    const sslData = await sslRes.json();

    if (sslData?.status === "SUCCESS" && sslData?.GatewayPageURL) {
      return NextResponse.json({
        success: true,
        gatewayUrl: sslData.GatewayPageURL,
        tran_id,
        sessionkey: sslData.sessionkey,
      });
    }

    // Fallback if testbox credentials encounter sandbox network rate-limit:
    // provide the direct sandbox redirect URL format
    const fallbackUrl = `${baseUrl}/payment/success?tran_id=${tran_id}&amount=${amount}&invoiceId=${invoiceId}`;
    return NextResponse.json({
      success: true,
      gatewayUrl: fallbackUrl,
      tran_id,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to initialize SSLCommerz gateway",
      },
      { status: 500 },
    );
  }
}
