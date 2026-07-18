"use server";

import { executeGQL } from "~/lib/graphql/server"
import { CHECKOUT_MUTATION, CLEAR_SELECTED_CART_ITEMS_MUTATION } from "~/lib/graphql/queries"
import { cartsApi } from "~/lib/api/carts"
import { getRequestEvent } from "solid-js/web"
import type { CheckoutInput, CheckoutItemInput, CheckoutResult } from "~/lib/types"

export type PaymentProvider = "mpesa"

export interface PaymentPayload {
  orderId: string
  orderNumber: string
  paymentId: string
  amount: string
  currency: string
  phone: string
  email?: string
  metadata?: Record<string, string>
  callbackUrl?: string
}

export interface PaymentResult {
  success: boolean
  provider: PaymentProvider
  transactionId?: string
  status: string
  message?: string
}

export interface CheckoutFormData {
  email: string
  name: string
  phone: string
  provider: string
  paymentPhone: string
  deliveryMethod: string
  deliveryLocation: string
  deliveryZone: string
  shippingAddress: Record<string, string>
  billingAddress: Record<string, string>
  notes: string
  directBuy?: {
    productId: string
    quantity: number
    subtotal: string
  }
}

function hasAny(r: Record<string, string>): boolean {
  return Object.values(r).some(v => v !== undefined && v !== null && v !== "")
}

export async function submitCheckout(data: CheckoutFormData, timeoutMinutes = 15): Promise<CheckoutResult & { message: string }> {
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
    customerEmail: data.email || undefined,
    deliveryMethod: data.deliveryMethod || undefined,
    deliveryLocation: data.deliveryLocation || undefined,
    deliveryZone: data.deliveryZone || undefined,
    shippingAddress: hasAny(data.shippingAddress) ? JSON.stringify(data.shippingAddress) : undefined,
    billingAddress: hasAny(data.billingAddress) ? JSON.stringify(data.billingAddress) : undefined,
    name: data.name || undefined,
    timeoutMinutes: timeoutMinutes ?? undefined,
    phone: data.phone || undefined,
    notes: data.notes || undefined,
  }

  const res = await executeGQL<{ checkout: CheckoutResult }>(CHECKOUT_MUTATION, { input })
  const result = res.checkout

  if (result.success) {
    if (data.provider === "mpesa") {
      const event = getRequestEvent()
      const host = event?.request.headers.get("host")
      const callbackUrl = host
        ? `${host.includes("localhost") ? "http" : "https"}://${host}`
        : undefined
      processPayment("mpesa", {
        orderId: result.orderId!,
        orderNumber: result.orderNumber!,
        paymentId: result.paymentId!,
        amount: result.total!,
        currency: result.currency!,
        phone: data.paymentPhone,
        callbackUrl,
      }).catch(() => { })
    }
    return {
      ...result,
      message: `Order #${result.orderNumber} confirmed!` +
        (result.total ? ` Total: ${result.total} ${result.currency}` : ""),
    }
  }

  return { ...result, message: result.status ?? "Checkout failed" }
}

async function mpesa(payload: PaymentPayload): Promise<PaymentResult> {
  const { initiateMpesaPayment } = await import("./mpesa")
  return initiateMpesaPayment(payload)
}

export async function processPayment(provider: PaymentProvider, payload: PaymentPayload): Promise<PaymentResult> {
  switch (provider) {
    case "mpesa":
      return mpesa(payload)
    default:
      return { success: false, provider, status: "failed", message: `Unsupported provider: ${provider}` }
  }
}
