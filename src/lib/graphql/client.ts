"use server";

import { getApiPrefix, getProxyBaseUrl, getStoreApiKey } from "~/lib/api/http"
import { getRequestEvent } from "solid-js/web"

export async function executeGQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const event = getRequestEvent()
  const baseUrl = getProxyBaseUrl()
  const prefix = getApiPrefix()
  const apiKey = getStoreApiKey()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "X-Store-API-Key": apiKey } : {}),
  }
  if (event?.request.headers.get("cookie")) {
    headers["Cookie"] = event.request.headers.get("cookie")!
  }

  const res = await fetch(`${baseUrl}${prefix}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    credentials: "include",
  })

  const setCookie = res.headers.get("set-cookie")
  if (setCookie && event) {
    const existing = event.response.headers.get("set-cookie")
    event.response.headers.set("set-cookie", existing ? `${existing}, ${setCookie}` : setCookie)
  }

  const json = await res.json() as { data?: T; errors?: { message: string }[] }
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join("\n"))
  }
  return json.data as T
}
