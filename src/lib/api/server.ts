"use server";

import { getApiPrefix, getProxyBaseUrl, getStoreApiKey } from "./http"
import { getRequestEvent } from "solid-js/web"

export async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const event = getRequestEvent()
  const base = getProxyBaseUrl()
  const prefix = getApiPrefix()
  const apiKey = getStoreApiKey()
  const headers: Record<string, string> = {}
  if (init?.body) headers["Content-Type"] = "application/json"
  if (apiKey) headers["X-Store-API-Key"] = apiKey
  if (event?.request.headers.get("cookie")) {
    headers["Cookie"] = event.request.headers.get("cookie")!
  }
  const res = await fetch(`${base}${prefix}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
    credentials: "include",
  })
  const setCookie = res.headers.get("set-cookie")
  if (setCookie && event) {
    const existing = event.response.headers.get("set-cookie")
    event.response.headers.set("set-cookie", existing ? `${existing}, ${setCookie}` : setCookie)
  }
  return res.json()
}
