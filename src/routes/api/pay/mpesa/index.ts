import type { APIEvent } from "@solidjs/start/server"
import type { PaymentPayload, PaymentResult } from "~/lib/types"

interface MpesaToken {
  access_token: string
  expires_in: string
}

interface StkPushResponse {
  MerchantRequestID?: string
  CheckoutRequestID?: string
  ResponseCode?: string
  ResponseDescription?: string
  errorCode?: string
  errorMessage?: string
}

const API_BASE = process.env.MPESA_ENVIRONMENT === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke"

async function getAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY
  const secret = process.env.MPESA_CONSUMER_SECRET
  if (!key || !secret) {
    throw new Error("M-Pesa consumer key or secret not configured")
  }
  const auth = Buffer.from(`${key}:${secret}`).toString("base64")
  const res = await fetch(`${API_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!res.ok) {
    throw new Error(`Failed to get M-Pesa token: ${res.status}`)
  }
  const data: MpesaToken = await res.json()
  return data.access_token
}

function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  const str = shortcode + passkey + timestamp
  return Buffer.from(str).toString("base64")
}

function timestamp(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("")
}

export async function POST({ request }: APIEvent) {
  const payload: PaymentPayload = await request.json()

  try {
    const shortcode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    if (!shortcode || !passkey) {
      return new Response(JSON.stringify({ success: false, provider: "mpesa", status: "failed", message: "M-Pesa not configured" }), { status: 422, headers: { "Content-Type": "application/json" } })
    }

    const token = await getAccessToken()
    const ts = timestamp()
    const password = generatePassword(shortcode, passkey, ts)

    const amount = Math.round(parseFloat(payload.amount))
    if (isNaN(amount) || amount <= 0) {
      return new Response(JSON.stringify({ success: false, provider: "mpesa", status: "failed", message: "Invalid amount" }), { status: 422, headers: { "Content-Type": "application/json" } })
    }

    const phone = payload.phone.replace(/^0+/, "254").replace(/^\+/, "")
    if (!/^254\d{9}$/.test(phone)) {
      return new Response(JSON.stringify({ success: false, provider: "mpesa", status: "failed", message: "Invalid phone number" }), { status: 422, headers: { "Content-Type": "application/json" } })
    }

    const host = request.headers.get("host") || "localhost"
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https"
    const callbackUrl = `${protocol}://${host}/api/pay/mpesa/${payload.paymentId}`

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: payload.orderNumber,
      TransactionDesc: `Payment for order ${payload.orderNumber}`,
    }

    const res = await fetch(`${API_BASE}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data: StkPushResponse = await res.json()

    const result: PaymentResult = data.ResponseCode === "0"
      ? { success: true, provider: "mpesa", transactionId: data.CheckoutRequestID, status: "pending", message: data.ResponseDescription }
      : { success: false, provider: "mpesa", status: "failed", message: data.errorMessage || data.ResponseDescription || "STK push failed" }

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 422,
      headers: { "Content-Type": "application/json" },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    return new Response(JSON.stringify({ success: false, provider: "mpesa", status: "failed", message }), { status: 422, headers: { "Content-Type": "application/json" } })
  }
}
