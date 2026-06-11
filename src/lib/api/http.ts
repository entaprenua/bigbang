export function getApiPrefix(): string {
  return import.meta.env.VITE_API_PREFIX || "/api/v1"
}

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return import.meta.env.VITE_PROXY_API_BASE_URL || "https://entaprenua.com"
  }
  return ""
}

export function getApiKey(): string | undefined {
  if (typeof window === "undefined") return process.env.STORE_API_KEY
  return undefined
}
