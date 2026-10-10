export interface BkashGrantTokenResponse {
  statusCode: string;
  statusMessage: string;
  token_type: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface BkashCreatePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  successCallbackURL?: string;
  failureCallbackURL?: string;
  cancelledCallbackURL?: string;
  amount: string;
  intent: string;
  currency: string;
  paymentCreateTime: string;
  transactionStatus: string;
  merchantInvoiceNumber: string;
}

export interface BkashExecutePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  trxID: string;
  amount: string;
  transactionStatus: string;
  paymentExecuteTime?: string;
  currency?: string;
  intent?: string;
  merchantInvoiceNumber?: string;
}

const getBkashConfig = () => {
  return {
    appKey: process.env.BKASH_APP_KEY || "4f6o0cjiki2rfm34kfdadl1eqq",
    appSecret:
      process.env.BKASH_APP_SECRET ||
      "2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b",
    username: process.env.BKASH_USERNAME || "sandboxTokenizedUser02",
    password: process.env.BKASH_PASSWORD || "sandboxTokenizedUser02@12345",
    baseUrl:
      process.env.BKASH_URL || "https://tokenized.sandbox.bka.sh/v1.2.0-beta",
  };
};

export async function grantBkashToken(): Promise<string> {
  const { appKey, appSecret, username, password, baseUrl } = getBkashConfig();

  const res = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username,
      password,
    },
    body: JSON.stringify({
      app_key: appKey,
      app_secret: appSecret,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`bKash grant token HTTP error ${res.status}: ${errorText}`);
  }

  const data = (await res.json()) as BkashGrantTokenResponse;
  if (!data?.id_token) {
    throw new Error(
      `bKash grant token failed (${data?.statusCode || "ERR"}): ${data?.statusMessage || "Unknown response"}`,
    );
  }

  return data.id_token;
}

export async function createBkashPayment(params: {
  amount: number | string;
  merchantInvoiceNumber: string;
  payerReference?: string;
  callbackURL: string;
}): Promise<BkashCreatePaymentResponse> {
  const { appKey, baseUrl } = getBkashConfig();
  const idToken = await grantBkashToken();

  const numAmount =
    typeof params.amount === "number"
      ? params.amount.toFixed(2)
      : Number(params.amount).toFixed(2);

  const res = await fetch(`${baseUrl}/tokenized/checkout/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: idToken,
      "X-APP-Key": appKey,
    },
    body: JSON.stringify({
      mode: "0011",
      payerReference: params.payerReference || "01619777283",
      callbackURL: params.callbackURL,
      amount: numAmount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: params.merchantInvoiceNumber,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `bKash create payment HTTP error ${res.status}: ${errorText}`,
    );
  }

  const data = (await res.json()) as BkashCreatePaymentResponse;
  if (data?.statusCode !== "0000" && !data?.bkashURL) {
    throw new Error(
      `bKash checkout creation failed (${data?.statusCode}): ${data?.statusMessage}`,
    );
  }

  return data;
}

export async function executeBkashPayment(
  paymentID: string,
): Promise<BkashExecutePaymentResponse> {
  const { appKey, baseUrl } = getBkashConfig();
  const idToken = await grantBkashToken();

  const res = await fetch(`${baseUrl}/tokenized/checkout/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: idToken,
      "X-APP-Key": appKey,
    },
    body: JSON.stringify({
      paymentID,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `bKash execute payment HTTP error ${res.status}: ${errorText}`,
    );
  }

  const data = (await res.json()) as BkashExecutePaymentResponse;
  return data;
}
