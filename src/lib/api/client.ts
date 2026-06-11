import { getApiPrefix, localBaseUrl } from "./http"

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = localBaseUrl()
  const prefix = getApiPrefix()
  const headers: Record<string, string> = {}
  if (init?.body) headers["Content-Type"] = "application/json"
  return fetch(`${base}${prefix}${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string>) },
    credentials: "include",
  })
}
