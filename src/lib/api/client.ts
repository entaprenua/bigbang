import { getApiBaseUrl, getApiPrefix, getApiKey } from "./http"

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = getApiBaseUrl()
  const prefix = getApiPrefix()
  const apiKey = getApiKey()
  const headers: Record<string, string> = {}
  if (apiKey) headers["X-Store-API-Key"] = apiKey
  if (init?.body) headers["Content-Type"] = "application/json"
  return fetch(`${base}${prefix}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
    credentials: "include",
  })
}
