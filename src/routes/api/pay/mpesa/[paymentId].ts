import type { APIEvent } from "@solidjs/start/server"
import { confirmPayment } from "~/lib/payments/confirm"

interface StkCallback {
  MerchantRequestID?: string
  CheckoutRequestID?: string
  ResultCode: number
  ResultDesc?: string
  CallbackMetadata?: {
    Item: { Name: string; Value: string | number }[]
  }
}

export async function POST({ params, request }: APIEvent) {
  const paymentId = params.paymentId
  if (!paymentId) {
    return new Response("Missing paymentId", { status: 400 })
  }

  let callback: StkCallback
  try {
    const body = await request.json()
    callback = body.Body?.stkCallback
  } catch {
    return new Response("Invalid callback body", { status: 400 })
  }

  if (callback == null) {
    return new Response("Missing stkCallback", { status: 400 })
  }

  const status = callback.ResultCode === 0 ? "SUCCEEDED" : "FAILED"
  await confirmPayment(paymentId, status)

  return new Response(null, { status: 200 })
}
