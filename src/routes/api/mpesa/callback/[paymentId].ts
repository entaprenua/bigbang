import type { APIEvent } from "@solidjs/start/server"
import { executeGQL } from "~/lib/graphql/server"
import { CONFIRM_PAYMENT_MUTATION } from "~/lib/graphql/queries"
import { sendOrderNotification } from "~/lib/notifications/send"

interface StkCallback {
  MerchantRequestID?: string
  CheckoutRequestID?: string
  ResultCode: number
  ResultDesc?: string
  CallbackMetadata?: {
    Item: { Name: string; Value: string | number }[]
  }
}

interface ConfirmPaymentResponse {
  confirmPayment: {
    success: boolean
    paymentId: string
    status: string
    orderId?: string | null
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

  const res = await executeGQL<ConfirmPaymentResponse>(CONFIRM_PAYMENT_MUTATION, {
    input: { paymentId, status },
  }).catch((err) => {
    console.error("confirmPayment failed:", err)
    return null
  })

  if (res?.confirmPayment?.orderId) {
    const eventType = status === "SUCCEEDED" ? "order_confirmation" : "payment_failed"
    sendOrderNotification(res.confirmPayment.orderId, eventType).catch((err) => {
      console.error(`Failed to send ${eventType} notification:`, err)
      sendOrderNotification(res.confirmPayment.orderId, eventType).catch((err) => {
        console.error(`Failed to send ${eventType} notification:`, err)
      })
    })
  }

  return new Response(null, { status: 200 })
}
