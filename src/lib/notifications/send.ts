import Handlebars from "handlebars"
import { executeGQL } from "~/lib/graphql/server"
import { STORE_QUERY, NOTIFICATION_TEMPLATES_QUERY } from "~/lib/graphql/queries"
import { sendEmail } from "~/lib/email"
import { defaultNotificationTemplates } from "./defaults"

interface NotificationTemplateResult {
  eventType: string
  channel: string
  subject?: string | null
  bodyHtml?: string | null
  bodyText?: string | null
  isActive: boolean
  isDefault: boolean
}

export async function sendNotification(
  eventType: string,
  context: Record<string, unknown>,
): Promise<void> {
  const [storeResult, templatesResult] = await Promise.all([
    executeGQL<{ store: { name: string } }>(STORE_QUERY),
    executeGQL<{ notificationTemplates: NotificationTemplateResult[] }>(
      NOTIFICATION_TEMPLATES_QUERY,
      { eventType },
    ),
  ])

  const storeName = storeResult.store?.name ?? "Store"
  const customer = context.customer as { name?: string; email?: string } | undefined
  const email = customer?.email
  if (!email) {
    console.warn(`[notifications] ${eventType}: no customer email in context, skipping`)
    return
  }

  const template = templatesResult.notificationTemplates.find(
    (t) => t.eventType === eventType,
  )

  if (template && !template.isActive) {
    return
  }

  const subject = template?.subject ?? defaultNotificationTemplates[eventType]?.subject ?? ""
  const bodyHtml = template?.bodyHtml ?? defaultNotificationTemplates[eventType]?.bodyHtml ?? ""
  const bodyText = template?.bodyText ?? defaultNotificationTemplates[eventType]?.bodyText ?? ""

  const storeEmailPrefix = storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  try {
    const renderSubject = Handlebars.compile(subject)(context)
    const renderHtml = Handlebars.compile(bodyHtml)(context)
    const renderText = Handlebars.compile(bodyText)(context)

    await sendEmail({
      to: email,
      subject: renderSubject,
      html: renderHtml,
      text: renderText,
      from: `${storeEmailPrefix}@entaprenua.com`,
      fromName: storeName,
    })
  } catch (err) {
    console.error(`[notifications] Failed to send ${eventType}:`, err)
  }
}
