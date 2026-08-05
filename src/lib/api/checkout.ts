import { executeGQL } from "~/lib/graphql/server"
import { CHECKOUT_MUTATION } from "~/lib/graphql/queries"
import { cartsApi } from "~/lib/api/carts"
import type { CheckoutInput, CheckoutItemInput, CheckoutResult } from "~/lib/types"
import type { CheckoutFormData } from "~/lib/types/checkout"

function hasAny(r: Record<string, string>): boolean {
  return Object.values(r).some(v => v !== undefined && v !== null && v !== "")
}

export async function submitCheckout(data: CheckoutFormData): Promise<CheckoutResult & { message: string }> {
  let items: CheckoutItemInput[]

  if (data.directBuy) {
    const { productId, quantity, subtotal } = data.directBuy
    items = [{
      productId,
      quantity,
      subtotal,
    }]
  } else {
    const cart = await cartsApi.get()
    if (!cart || !cart.items.length) {
      return { success: false, status: "Cart is empty", message: "Cart is empty" }
    }

    items = cart.items
      .filter((item) => item.selected !== false)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal ?? "0.00",
        metadata: item.metadata ?? undefined,
      }))
  }

  const subtotal = items.reduce((s, i) => s + parseFloat(i.subtotal), 0).toFixed(2)
  const total = subtotal

  const isEmail = data.contact.includes("@")

  const input: CheckoutInput = {
    items,
    subtotal,
    total,
    tax: "0.00",
    shippingCost: "0.00",
    discount: "0.00",
    currency: "KES",
    provider: data.provider,
    paymentPhone: data.paymentPhone || undefined,
    customerEmail: isEmail ? data.contact : undefined,
    deliveryMethod: data.deliveryMethod || undefined,
    deliveryLocation: data.deliveryLocation || undefined,
    deliveryZone: data.deliveryZone || undefined,
    shippingAddress: hasAny(data.shippingAddress) ? JSON.stringify(data.shippingAddress) : undefined,
    billingAddress: hasAny(data.billingAddress) ? JSON.stringify(data.billingAddress) : undefined,
    name: data.name || undefined,
    phone: isEmail ? undefined : data.contact || undefined,
    notes: data.notes || undefined,
  }

  const res = await executeGQL<{ checkout: CheckoutResult }>(CHECKOUT_MUTATION, { input })
  const result = res.checkout

  if (result.success) {
    const payment = await fetch(`/api/pay/${data.provider}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: result.orderId!,
        orderNumber: result.orderNumber!,
        paymentId: result.paymentId!,
        amount: result.total!,
        currency: result.currency!,
        phone: data.paymentPhone,
      }),
    }).then(r => r.json()).catch(() => null)

    const message = payment?.success
      ? payment.message ?? "Order placed — payment pending"
      : `Order placed but payment could not be initiated: ${payment?.message ?? "unknown error"}`

    return {
      ...result,
      message,
    }
  }

  return { ...result, message: result.status ?? "Checkout failed" }
}
