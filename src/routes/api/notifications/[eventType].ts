import type { APIEvent } from "@solidjs/start/server"
import { sendNotification } from "~/lib/notifications/send"

export async function POST({ params, request }: APIEvent) {
  const { eventType } = params
  if (!eventType) {
    return new Response("Missing eventType", { status: 400 })
  }

  const context = await request.json()
  await sendNotification(eventType, context)
  return new Response(null, { status: 200 })
}
