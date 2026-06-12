"use server";

import { getApiPrefix, getProxyBaseUrl, getStoreApiKey } from "./http"

export async function apiFetch(path: string, init?: RequestInit): Promise<unknown> {
  const base = getProxyBaseUrl()
  const prefix = getApiPrefix()
  const apiKey = getStoreApiKey()
  const headers: Record<string, string> = {}
  if (init?.body) headers["Content-Type"] = "application/json"
  if (apiKey) headers["X-Store-API-Key"] = apiKey
  const res = await fetch(`${base}${prefix}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
    credentials: "include",
  })
  return res.json()
}
