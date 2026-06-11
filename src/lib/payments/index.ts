"use server";

import { gqlClient } from "~/lib/graphql/client"
import { CHECKOUT_MUTATION } from "~/lib/graphql/queries"
import { cartsApi } from "~/lib/api/carts"
import type { AddressInput, CheckoutInput, CheckoutItemInput, CheckoutResult } from "~/lib/types"

export type PaymentProvider = "mpesa"

export interface PaymentPayload {
  orderId: string
  orderNumber: string
  amount: string
  currency: string
  phone: string
  email?: string
  metadata?: Record<string, string>
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
  deliveryMethodId?: string
  deliveryZoneId?: string
  deliveryCountry: string
  deliveryCity: string
  shippingAddress: Record<string, string>
  billingAddress: Record<string, string>
  notes: string
  directBuy?: {
    productId: string
    variantId?: string
    quantity: number
  }
}

function buildAddress(addr: Record<string, string>): AddressInput | undefined {
  const hasContent = addr.street || addr.city || addr.state || addr.zip || addr.country
  if (!hasContent) return undefined
  return {
    street: addr.street || undefined,
    city: addr.city || undefined,
    state: addr.state || undefined,
    zip: addr.zip || undefined,
    country: addr.country || undefined,
  }
}

export async function submitCheckout(data: CheckoutFormData): Promise<CheckoutResult> {
  let items: CheckoutItemInput[]

  if (data.directBuy) {
    const { productId, variantId, quantity } = data.directBuy
    const res = await gqlClient.request<{ product: { id: string; name: string; variants: { id: string; price: string; sku: string }[] } }>(
      `query Product($id: String!) { product(id: $id) { id name variants { id price sku } } }`,
      { id: productId },
    )
    const product = res.product
    const variant = variantId
      ? product.variants.find((v) => v.id === variantId)
      : product.variants[0]
    const price = variant?.price ?? "0.00"
    const subtotal = (parseFloat(price) * quantity).toFixed(2)

    items = [{
      productId,
      variantId: variant?.id,
      productName: product.name,
      price,
      quantity,
      subtotal,
      variantSku: variant?.sku,
    }]
  } else {
    const cart = await cartsApi.get()
    if (!cart || !cart.items.length) {
      return { success: false, status: "Cart is empty" }
    }

    items = cart.items
      .filter((item) => item.selected !== false)
      .map((item) => ({
        productId: item.productId ?? item.id ?? "",
        variantId: item.variantId ?? undefined,
        productName: item.product?.name ?? "",
        price: item.price ?? "0.00",
        quantity: item.quantity,
        subtotal: item.subtotal ?? "0.00",
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
    deliveryMethodId: data.deliveryMethodId || undefined,
    deliveryZoneId: data.deliveryZoneId || undefined,
    deliveryCountry: data.deliveryCountry || undefined,
    deliveryCity: data.deliveryCity || undefined,
    shippingAddress: buildAddress(data.shippingAddress),
    billingAddress: buildAddress(data.billingAddress),
    name: data.name || undefined,
    phone: data.phone || undefined,
    notes: data.notes || undefined,
  }

  const res = await gqlClient.request<{ checkout: CheckoutResult }>(CHECKOUT_MUTATION, { input })
  const result = res.checkout

  if (result.success && data.provider === "mpesa") {
    processPayment("mpesa", {
      orderId: result.orderId!,
      orderNumber: result.orderNumber!,
      amount: result.total!,
      currency: result.currency!,
      phone: data.paymentPhone,
    }).catch(() => { })
  }

  return result
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
