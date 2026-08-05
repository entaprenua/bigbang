import { executeGQL } from "~/lib/graphql/server"
import { CONFIRM_PAYMENT_MUTATION } from "~/lib/graphql/queries"
import { buildOrderContext } from "~/lib/notifications/contexts"
import { sendNotification } from "~/lib/notifications/send"

interface ConfirmPaymentResponse {
  confirmPayment: {
    success: boolean
    paymentId: string
    status: string
    orderId?: string | null
  }
}

export async function confirmPayment(paymentId: string, status: "SUCCEEDED" | "FAILED"): Promise<void> {
  const res = await executeGQL<ConfirmPaymentResponse>(CONFIRM_PAYMENT_MUTATION, {
    input: { paymentId, status },
  }).catch((err) => {
    console.error("confirmPayment failed:", err)
    return null
  })

  if (res?.confirmPayment?.orderId) {
    const eventType = status === "SUCCEEDED" ? "order_confirmation" : "payment_failed"
    const send = async () => {
      const context = await buildOrderContext(res.confirmPayment!.orderId!)
      await sendNotification(eventType, context)
    }
    send().catch((err) => {
      console.error(`Failed to send ${eventType} notification:`, err)
      send().catch((err) => {
        console.error(`Failed to send ${eventType} notification:`, err)
      })
    })
  }
}
