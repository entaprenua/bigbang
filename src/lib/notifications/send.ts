"use server";

import Handlebars from "handlebars"
import { executeGQL } from "~/lib/graphql/server"
import { ORDER_QUERY, STORE_QUERY, NOTIFICATION_TEMPLATES_QUERY } from "~/lib/graphql/queries"
import { sendEmail } from "~/lib/email"
import { defaultNotificationTemplates } from "./defaults"
import type { OrderEventContext } from "./defaults"

type NotificationEventType = "order_confirmation" | "payment_failed"

export async function sendOrderNotification(
  orderId: string,
  eventType: NotificationEventType,
): Promise<void> {
  const [orderResult, storeResult, templatesResult] = await Promise.all([
    executeGQL<{ order: OrderQueryResult }>(ORDER_QUERY, { id: orderId }),
    executeGQL<{ store: { name: string } }>(STORE_QUERY),
    executeGQL<{ notificationTemplates: NotificationTemplateResult[] }>(
      NOTIFICATION_TEMPLATES_QUERY,
      { eventType },
    ),
  ])

  const order = orderResult.order
  if (!order) {
    console.warn(`[notifications] Order not found: ${orderId}`)
    return
  }

  if (!order.email) {
    console.warn(`[notifications] Order ${order.orderNumber} has no email, skipping`)
    return
  }

  const storeName = storeResult.store?.name ?? "Store"
  const template = templatesResult.notificationTemplates.find(
    (t) => t.eventType === eventType,
  )

  if (template && !template.isActive) {
    return
  }

  const subject = template?.subject ?? defaultNotificationTemplates[eventType]?.subject ?? ""
  const bodyHtml = template?.bodyHtml ?? defaultNotificationTemplates[eventType]?.bodyHtml ?? ""
  const bodyText = template?.bodyText ?? defaultNotificationTemplates[eventType]?.bodyText ?? ""

  const context: OrderEventContext = {
    customer: {
      name: order.name ?? "Customer",
      email: order.email,
    },
    order: {
      orderNumber: order.orderNumber,
      total: order.total ?? "0.00",
      subtotal: order.subtotal ?? "0.00",
      currency: order.currency ?? "USD",
      status: order.status ?? "pending",
      trackingNumber: order.trackingNumber ?? undefined,
    },
    items: (order.items ?? []).map((item) => ({
      productName: item.productName ?? "Item",
      quantity: item.quantity,
      price: item.price ?? "0.00",
    })),
    store: {
      name: storeName,
    },
  }

  const storeEmailPrefix = storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  try {
    const renderSubject = Handlebars.compile(subject)(context)
    const renderHtml = Handlebars.compile(bodyHtml)(context)
    const renderText = Handlebars.compile(bodyText)(context)

    await sendEmail({
      to: context.customer.email,
      subject: renderSubject,
      html: renderHtml,
      text: renderText,
      from: `${storeEmailPrefix}@entaprenua.com`,
      fromName: storeName,
    })
  } catch (err) {
    console.error(`[notifications] Failed to send ${eventType} for order ${order.orderNumber}:`, err)
  }
}

interface OrderQueryResult {
  id: string
  orderNumber: string
  status?: string | null
  total?: string | null
  subtotal?: string | null
  currency?: string | null
  email?: string | null
  name?: string | null
  trackingNumber?: string | null
  items?: Array<{
    productName?: string | null
    quantity: number
    price?: string | null
  }> | null
}

interface NotificationTemplateResult {
  eventType: string
  channel: string
  subject?: string | null
  bodyHtml?: string | null
  bodyText?: string | null
  isActive: boolean
  isDefault: boolean
}
